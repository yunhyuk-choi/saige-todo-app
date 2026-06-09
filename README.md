# To-Do List Application

MSW(Mock Service Worker)로 제공되는 `/api/todos` CRUD API 기반 To-Do 리스트 SPA입니다.
요구사항(`REQUIREMENT.md`)을 모두 구현하고, 몇 가지 추가 기능을 더했습니다.

## 실행 방법

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (Vite + MSW), http://localhost:5173
npm run build    # 타입체크(tsc) + 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint (--max-warnings 0)
npm run test     # Vitest (단위 + 통합)
```

> API는 MSW가 **브라우저 안에서** 가로채므로, Postman/cURL 등 브라우저 외부 호출은 응답하지 않습니다.
> 데이터는 브라우저 `localStorage`에 저장됩니다.

## 구현한 요구사항

### 기능 요구사항 (필수)

- [x] 상단에서 신규 To-Do 추가 (내용 + 기한 날짜)
- [x] 입력 유효성 검증 — 내용 필수 / 과거 날짜 불가
- [x] Row 단위 선택 후 **인라인 수정**
- [x] 항목별 완료 처리 + 완료 표시(취소선 + 상태 칩)
- [x] 다중 선택 삭제 + **전체선택**
- [x] 기한 3일 이내 임박 표시 (지난 항목은 별도 표시)
- [x] **페이지네이션** (Page Size 5 / 10 / 20 선택)
- [x] 리스트 검색 + **검색어 영속**(브라우저를 다시 열어도 유지)

### 추가 기능

- [x] **Pin** — 항목을 상단에 고정/해제 (영속)
- [x] **상태 필터** — 전체 / 진행중 / 완료
- [x] **낙관적 업데이트** — 완료 토글 즉시 반영(실패 시 롤백)
- [x] **삭제 실행취소(Undo)** — 다중 삭제 후 5초 내 복원
- [x] **다크 모드** (영속)

## 기술 스택

| 구분 | 스택 | 선택 이유 |
| ---- | ---- | ---- |
| 빌드/런타임 | Vite 6 (SWC) + React 18 + TypeScript strict | 제공된 패키지 기준 |
| 서버 상태 | **TanStack Query v5** | 캐싱·로딩/에러 상태·낙관적 업데이트를 직접 구현하지 않음 |
| 클라이언트 상태 | **Zustand** (+ persist) | store + selector 부분 구독으로 불필요한 리렌더 차단 |
| 스타일 | **Tailwind CSS v4** | 빠른 스타일링, 클래스 기반 다크모드 |
| 아이콘 | lucide-react | |
| API 모킹 | MSW (제공됨) | |
| 테스트 | Vitest + Testing Library (+ MSW node) | |

## 아키텍처

```
src/
├── types/api.ts          # 기준 타입 (ToDo, APIResponse, ToDoRequest) — 제공됨
├── api/todos.ts          # fetch 래퍼 (APIResponse 언래핑 + 에러 throw)
├── hooks/useTodos.ts     # React Query 훅 (query + create/update/완료토글 낙관적)
├── lib/                  # queryClient, cn, date, error, ui(focusRing)
├── stores/               # zustand: selection / pin / prefs / theme / toast
└── features/todo/
    ├── TodoPage.tsx          # 조립 + 로딩/에러/빈 상태 분기
    ├── useTodoView.ts        # 검색→필터→핀정렬→페이지 파생 (useMemo)
    ├── useDeferredDelete.ts  # 지연 삭제(Undo) 컨트롤러
    ├── AddTodoForm / TodoToolbar / TodoList / TodoRow / TodoRowEditor / Pagination / ToastViewport
    └── components/           # EmptyState / ErrorMessage / TodoListSkeleton
```

**데이터 흐름**: `MSW` → `api/todos` → `hooks/useTodos`(React Query) → 컴포넌트.
공유 UI 상태는 각 컴포넌트가 Zustand store를 **selector로 부분 구독**.

## 핵심 설계 결정

- **상태를 3계층으로 분리**
  - 서버 상태 = React Query (`['todos']` 쿼리 + 뮤테이션)
  - 공유 클라이언트 상태 = Zustand (선택/핀/환경설정/테마)
  - 파생 값 = **렌더 중 계산**(검색·필터·정렬·페이지). `useEffect`로 상태를 동기화하지 않음.
- **검색/필터/정렬/페이지는 `select`가 아닌 렌더 중 파생**으로 처리.
  검색어·필터는 쿼리 키에 묶이지 않는 클라이언트 상태라, 캐시 원본 1벌을 유지하고 매 렌더 파생하는 것이 맞다.
- **완료 토글은 낙관적 업데이트**(`onMutate`로 즉시 반영, 실패 시 스냅샷 롤백). 전역 에러는 v5의 `QueryCache`/`MutationCache`로 토스트.
- **삭제는 "지연 삭제"**: 캐시에서 낙관적 제거 후 5초 타이머, 만료 시 실제 `DELETE`. 그 사이 Undo를 누르면 복원하고 타이머를 취소한다(항목 재생성으로 인한 id 변경 회피).
- **Pin은 클라이언트 전용**: API 스펙에 pin 필드가 없어 `localStorage`에 별도 보관. 항목이 실제 삭제되면 고정 정보도 정리한다(삭제 후 MSW가 id를 재발급할 때 무관한 항목이 고정 표시되는 문제 방지).
- **완료/진행중은 체크박스가 아닌 상태 칩**으로 표현 — 선택(삭제용) 체크박스와의 동작 혼동 제거.

## 접근성

- 모든 인터랙티브 요소에 키보드 포커스 링(`focus-visible`), 버튼/입력에 `aria-label`
- 완료 토글 `aria-pressed`, 폼 에러 `role="alert"` + `aria-describedby`
- 토스트/선택 개수 `aria-live`, 마감 배지 `title`, 문서 `lang="ko"`

## 테스트

- **단위**: `src/lib/date.test.ts` — 마감 계산/임박/지남/날짜 변환
- **통합**: `src/features/todo/TodoPage.test.tsx` — MSW + Testing Library로 추가/검증/검색/완료/필터/핀/페이지네이션/다중삭제+Undo/편집 검증

```bash
npm run test     # 16 tests
```

## 제외 범위 / 알려진 한계

- 서버 측 페이지네이션·정렬은 API 미지원이라 클라이언트에서 처리.
- 라우팅/인증/국제화는 범위 밖.
- 삭제 Undo 대기(5초) 중 탭을 닫으면 실제 DELETE가 호출되지 않아 항목이 유지된다.
- 과거 날짜 차단은 단위 테스트로 검증(jsdom의 date input 한계로 통합 테스트에선 제외).

## 개발 과정 기록

이 과제는 Claude Code와 협업해 진행했으며, 의사결정·단계별 산출물을 함께 추적합니다.

- `docs/conversation-log.md` — 작업 세션별 지시/결정/산출물 요약
- `docs/workflow/` — STEP별 산출물(기능 명세서, 설계, UI 초안 HTML)
