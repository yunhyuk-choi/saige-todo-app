# STEP 1 산출물 — 컴포넌트 트리 / 상태 흐름 / 데이터 흐름

> 작성: 2026-06-09 / 선행: step0-spec.md

## 1. 컴포넌트 트리

```
main.tsx (제공됨, 수정 안 함)
└─ App.tsx (수정: Provider + 화면 마운트)
   └─ AppProviders            QueryClientProvider + 테마 초기화
      └─ TodoPage             features/todo/TodoPage.tsx (조립만, god 컴포넌트 금지)
         ├─ TodoHeader        제목 + ThemeToggle
         ├─ AddTodoForm       내용·기한 입력 + 검증 + create
         ├─ TodoToolbar
         │   ├─ SearchInput       keyword (prefsStore)
         │   ├─ StatusFilter      전체/진행중/완료 (prefsStore)
         │   ├─ BulkActions       전체선택 체크 + 선택삭제 버튼
         │   └─ PageSizeSelect    5/10/20 (prefsStore)
         ├─ TodoList          상태분기(loading/error/empty/검색0건) + 목록 렌더
         │   └─ TodoRow ×N
         │       ├─ (보기) 선택체크박스 · 완료토글 · 내용 · 기한배지 · Pin · 편집 · 삭제
         │       └─ TodoRowEditor  (편집 모드) 내용·기한 인라인 입력 + 저장/취소
         ├─ Pagination        페이지 이동 + 현재/전체
         └─ ToastViewport     Undo 토스트 · 에러 토스트
```

> TodoPage는 **조립자**다. 상태를 한 곳에서 다 들고 자식에 내려주는 god 컴포넌트가 되지 않도록,
> 공유 상태는 각 자식이 **store에서 selector로 직접 부분 구독**한다(props 드릴링 최소화).

## 2. 상태 분류

### 서버 상태 — React Query v5 (`src/hooks/useTodos.ts`)

| 훅 | 동작 | 전략 |
| --- | --- | --- |
| `useTodosQuery()` | `GET /api/todos` → `ToDo[]` | queryKey `['todos']`, staleTime 적당히 |
| `useCreateTodo()` | `POST` | onSuccess invalidate `['todos']` |
| `useUpdateTodo()` | `PUT` (편집 저장) | onSuccess invalidate (낙관적 불필요) |
| `useToggleDone()` | `PUT` (done 반전) | **낙관적**: onMutate cancel→snapshot→setQueryData, onError rollback, onSettled invalidate |
| `useDeleteTodos()` | `DELETE` ×N (지연) | Undo 컨트롤러 경유 (아래 §4) |

- 전역 에러: `src/lib/queryClient.ts`의 `QueryCache.onError` / `MutationCache.onError` → 에러 토스트.
  (v5 useQuery엔 onError 없음)

### 공유 클라이언트 상태 — Zustand (`src/stores/`)

| store | 영속 | 상태 | 액션 |
| --- | --- | --- | --- |
| `selectionStore` | ✗ | `selectedIds: Set<number>` | toggle, setMany, clear |
| `pinStore` | ✓ `todo:pins` | `pinnedIds: Set<number>` | togglePin |
| `prefsStore` | ✓ `todo:prefs` | `keyword, statusFilter, pageSize` | setKeyword, setFilter, setPageSize |
| `themeStore` | ✓ `todo:theme` | `theme: 'light'\|'dark'` | toggleTheme (action에서 `<html>` class 적용) |

- 구독은 **필요한 값만 selector로** (예: `useSelectionStore(s => s.selectedIds)`). 객체 통째 구독 ❌.
- 검색어 영속(요구사항)은 prefsStore persist로 충족. effect로 localStorage 동기화하지 않는다.

### 로컬 상태 (useState — 컴포넌트 안)

- `AddTodoForm`: `text`, `deadline`, `error`
- `TodoList`: `editingId: number | null` (한 번에 한 행만 편집)
- `TodoRowEditor`: `draftText`, `draftDeadline` — **편집 진입 시 props로 1회 초기화**(effect 동기화 ❌)
- `TodoPage`(또는 Pagination): `page: number` (비영속)

## 3. 파생 파이프라인 (렌더 중 계산, `src/features/todo/useTodoView.ts` useMemo 체인)

```
todos: ToDo[]                         ← useTodosQuery().data
  → searched   = keyword로 text 필터 (대소문자 무시)
  → filtered   = statusFilter (all | active(!done) | done) 적용
  → sorted     = 핀 우선(pinnedIds) → 그 안에서 deadline 오름차순(안정 정렬)
  → totalPages = max(1, ceil(sorted.length / pageSize))
  → safePage   = clamp(page, 1, totalPages)          // effect로 page 보정하지 않음
  → pageItems  = sorted.slice((safePage-1)*pageSize, safePage*pageSize)

행별 파생: isNearDeadline(deadline) / isOverdue(deadline)  (src/lib/date.ts)
전체선택 상태: pageItems가 모두 selectedIds에 있으면 checked, 일부면 indeterminate
```

> 이 파이프라인은 전부 입력(서버데이터 + prefs + pin + page)에서 순수 계산된다.
> 어떤 단계도 useEffect+setState로 만들지 않는다. page 보정도 렌더 중 clamp로 처리.

## 4. 삭제 Undo (지연 삭제) — `src/features/todo/useDeferredDelete.ts`

```
삭제 클릭(이벤트 핸들러):
  1. ids 스냅샷 + 현재 todos 스냅샷 보관
  2. queryClient.setQueryData(['todos'], 제거된 목록)   // 낙관적 제거
  3. selectionStore.clear()
  4. toast(Undo, duration=5s) 표시
  5. const timer = setTimeout(commit, 5000)              // 이벤트에서 타이머 생성

Undo 클릭:
  - clearTimeout(timer); setQueryData(['todos'], 스냅샷 복원); 토스트 닫기

commit (타이머 만료):
  - ids 각각 DELETE 호출(Promise.all); onError 시 스냅샷 롤백 + 에러 토스트; onSettled invalidate
```

> 타이머는 이벤트 핸들러에서 만들고 ref로 보관한다. "상태를 감시하는 useEffect"로 만들지 않는다.

## 5. 데이터 흐름 요약

```
fetch(MSW /api/todos)
  └─ src/api/todos.ts   APIResponse<T> 언래핑 + code!==200 throw
       └─ src/hooks/useTodos.ts  useQuery/useMutation
            ├─ 서버데이터 → useTodoView(파생) → TodoList/Pagination
            └─ 뮤테이션 ← AddTodoForm / TodoRow(완료·편집·삭제)

공유 UI 상태: 각 컴포넌트 ─selector→ Zustand store (selection/pin/prefs/theme)
```

## 6. 유저플로우 (텍스트 다이어그램)

```
[추가]   입력 → 검증(빈값/과거날짜) ─실패→ 인라인 에러
                                   ─성공→ POST → invalidate → 목록 갱신 → 폼 리셋
[완료]   체크 → 낙관적 토글(즉시 취소선) → PUT ─실패→ 롤백 + 에러토스트
[수정]   편집진입(draft 1회 초기화) → 인라인 수정 → 검증 → PUT → invalidate
[삭제]   다중선택 → 삭제 → 낙관적 제거 + Undo토스트(5s)
            ├─ Undo → 복원
            └─ 만료 → 실제 DELETE
[검색]   입력 → prefs.keyword(persist) → 렌더 중 필터 → (재오픈해도 유지)
[필터]   전체/진행중/완료 → prefs.statusFilter → 렌더 중 필터
[핀]     Pin → pinStore(persist) → 정렬 우선
[페이지] 사이즈(5/10/20)·페이지이동 → 렌더 중 슬라이스(safePage clamp)
[테마]   토글 → themeStore(persist) → <html> class
```

## 7. 빈/에러/로딩 상태

- 로딩: `TodoListSkeleton`
- 에러: `ErrorMessage`(query isError) + 전역 토스트
- 빈 목록(전체 0건): `EmptyState`("할 일을 추가해보세요")
- 검색/필터 결과 0건: `EmptyState` 변형("검색 결과 없음")
