# 대화 / 작업 로그

> Claude Code와의 작업 세션 기록. 시간순으로 append한다. (제출물에 포함)
> 전체 트랜스크립트가 아니라 의사결정·지시·산출물 요약이면 충분하다.

---

## 2026-06-09 — 세션 1: 워크플로우 문서 이관

### 사용자 핵심 지시

- 다른 프로젝트(dataspace-frontend, Next.js 16 / React 19)용으로 작성돼 있던 `.claude/` 워크플로우
  문서들을 **이 프로젝트(To-Do 과제)에 맞는 스택/기법으로 재작성**.
- 패키지 버전을 읽고 해당 버전 권장 기법으로 참고 md를 수정. CLAUDE.md에서 Next 관련 내용 제거.
- React/상태/React Query/태도에 관한 반복 피드백을 문서에 못박을 것.
- 이 프로젝트에서는 **Figma 단계 + Figma 피드백 단계를 건너뛴다.**
- Claude와의 대화 내용도 제출하므로 프로젝트 내부에 기록해 git으로 추적할 것.

### 파악한 실제 스택

- React 18.3.1 + Vite 6 (`@vitejs/plugin-react-swc`) + TypeScript 5.2 strict.
- ESLint 8 레거시 config(`.eslintrc.cjs`), `npm run lint`에 `--max-warnings 0`.
- MSW 2.6.8로 `/api/todos` CRUD 모킹(localStorage 백엔드). 그 외 라이브러리 미설치.
- seed 코드 스타일: 작은따옴표 + 세미콜론 없음 + 2스페이스, Prettier 설정 없음.
- 기준 타입은 `src/types/api.ts`(`ToDo`, `APIResponse<T>`, `ToDoRequest`), 수정 금지 대상.
- → **Next.js 아님.** 서버 컴포넌트/App Router/params Promise/next-intl 전부 무관.

### 내린 결정

- 도입 스택(필요 시 설치): **TanStack Query v5 / Zustand / Tailwind CSS v4 / Zod(선택) /
  Vitest + Testing Library**.
  - 상태관리 = Zustand: 피드백의 "store + selector 부분 구독"의 정석. (사용자 확인)
  - 스타일 = Tailwind v4: 빠른 스타일링 + cn()/cva 패턴. (사용자 확인)
  - 데이터 = TanStack Query v5: 피드백이 v5 API(QueryCache/MutationCache, select, throwOnError)를 명시.
  - 테스트 = Vitest + RTL: Vite 네이티브, MSW 핸들러 재사용 가능.
- React Compiler는 도입하지 않음(React 18 + SWC). "effect로 상태 동기화 금지" 원칙은
  `eslint-plugin-react-hooks` + `--max-warnings 0`로 강제됨을 문서에 반영.
- `@/` 경로 alias는 미설정 → 상대경로 사용으로 문서화(설정법은 주석으로 안내).

### 생성/수정한 파일

- `CLAUDE.md` — 프로젝트 개요를 To-Do 과제로 교체. Next 금지 규칙 제거. "절대 금지 5"를
  effect 동기화 금지 / any 금지 / 라이브러리 재구현 금지 / 훅 facade 금지 / 불변성으로 교체.
  "태도" 절 추가. 참조 표에서 NEXTJS.md → REACT.md.
- `.claude/NEXTJS.md` — **삭제**.
- `.claude/REACT.md` — **신규**. effect 안티패턴, Zustand store+selector, TanStack Query v5
  차이, React 18 forwardRef, 훅 규칙, 검색어 영속 패턴.
- `.claude/CODING.md` — 포맷(작은따옴표/no-semi), 명명, TS, Tailwind v4, Zod, 파일 구조로 재작성.
- `.claude/STACK.md` — 스택 표/디렉토리 구조/테스트/커밋 규칙을 Vite 프로젝트 기준으로 재작성.
  Figma 자동화 절 삭제.
- `.claude/CHECKLIST.md` — Next 항목 제거, effect/Query v5/store/React18/lint(--max-warnings 0) 항목으로 재작성.
- `.claude/WORKFLOW.md` — STEP을 0~8로 축소(Figma 캡처/피드백 단계 제거), 참조를 REACT.md로 변경,
  "대화 로그 보존" 절 추가.
- `docs/conversation-log.md` — 본 로그 신설.

### 다음 할 일

- 사용자 승인 후 STEP 0(기능 구체화)부터 To-Do 앱 개발 시작.

---

## 2026-06-09 — 세션 2: git 추적 정책 + STEP 0(기능 구체화)

### 사용자 핵심 지시

- 워크플로우 md 문서(`.claude/`, `CLAUDE.md`)는 고유 자산 → **git 추적 제외**.
  단, `docs/conversation-log.md`는 추적해 "Claude와 어떤 대화로 개발했는지" 공유.
- 기존 파일은 최대한 손대지 않기(불가피한 `App.tsx` 등 제외).
- 추가 기능: 사용자가 직접 만든 버전엔 **Pin(상단 고정/해제)**이 있었음 → 기본 포함.
  추가로 넣을 만한 기능을 Claude가 제안.

### 처리

- `.gitignore`에 `.claude/`, `CLAUDE.md` 추가. `git check-ignore`로 확인:
  두 경로 ignore됨, `docs/conversation-log.md`는 추적 대상.

### STEP 0 결정사항 (사용자 선택)

- 목록 표시: **페이지네이션(5/10/20)**. (API가 전체 배열 반환 → 클라이언트 분할,
  무한스크롤보다 자연스러움)
- 수정 UX: **인라인 행 편집**.
- 추가 기능: **Pin(기본)** + **상태 필터** + **낙관적 업데이트** + **삭제 실행취소(Undo)** + **다크모드**.

### 산출물

- STEP 1 전달 명세서 작성(기능 목록/시나리오/엣지케이스/상태 설계/신규 파일 목록).
- 상태 설계 핵심: 서버상태=React Query v5(낙관적 업데이트는 onMutate+롤백, 필터는 select/파생),
  공유상태=Zustand+persist(selection/pin/prefs/theme), 파생값은 렌더 중 계산(effect 동기화 금지).
  pin은 API 스펙에 필드가 없어 **클라이언트 전용 영속**으로 처리.

### 다음 할 일

- STEP 1: 컴포넌트 트리 + 상태 흐름 + 유저플로우 확정.

---

## 2026-06-09 — 세션 3: 산출물 폴더 + STEP 1(설계)

### 사용자 핵심 지시

- 단계별 **산출물도 프로젝트 내부에 모아** git으로 함께 추적(제출 포함).
- STEP 1 진행하고 산출물 저장.

### 처리

- `docs/workflow/` 폴더 신설 → 단계별 산출물 보관 (docs/는 git 추적됨).
  - `docs/workflow/step0-spec.md` — STEP 0 기능 명세서
  - `docs/workflow/step1-design.md` — STEP 1 설계

### STEP 1 핵심 설계 판단

- **검색/필터/정렬/페이지 = 렌더 중 파생(useMemo)**, `select` 아님.
  이유: select는 queryKey에 묶이는데 검색어·필터·핀은 클라이언트 UI 상태라 queryKey 불변 →
  select 재계산 안 됨. 캐시 원본 1벌 유지 + 렌더 중 파생이 정답.
- **삭제 Undo = 지연 삭제**: 낙관적 제거 + 스냅샷 + 5s 타이머, 만료 후 실제 DELETE,
  Undo 시 복원·타이머 취소. 타이머는 이벤트 핸들러에서 생성(effect 감시 ❌). 재생성 id 변경 회피.
- 완료토글만 낙관적 업데이트(onMutate+rollback), 편집/추가는 invalidate.
- 공유상태는 각 컴포넌트가 selector로 부분 구독(TodoPage god 컴포넌트화 방지).
- page 보정도 effect 아닌 렌더 중 clamp.

### 다음 할 일

- 사용자 승인 후 STEP 2(UI 초안) 또는 의존성 설치부터 진행.

---

## 2026-06-09 — 세션 4: 산출물 폴더 + STEP 2~4 압축 구현

### 사용자 핵심 지시

- 단계별 산출물을 프로젝트 내부에 모아 함께 추적(제출 포함).
- 진행 방식 = **압축(옵션 2)**: 의존성 설치 후 UI+로직 동시 구현.
- Figma 대신 **HTML 초안**을 UI 산출물로 제출.

### 처리

- 산출물: `docs/workflow/step0-spec.md`, `step1-design.md`, `step2-ui-draft.html`(상태별 화면 전환 가능한 정적 와이어프레임).
- 의존성 설치: `@tanstack/react-query@5`, `zustand@5`, `tailwindcss@4`+`@tailwindcss/vite`,
  `clsx`, `tailwind-merge`, (dev) `vitest`, `@testing-library/*`, `jsdom`.
- 설정: vite.config에 tailwind 플러그인, index.css에 `@import 'tailwindcss'` + `@custom-variant dark`,
  package.json에 test 스크립트. App.tsx = QueryClientProvider + TodoPage (main.tsx/handlers/types는 손대지 않음).

### 구현 (기존 seed 스타일: 작은따옴표·세미콜론 없음 준수)

- 데이터: `api/todos.ts`(APIResponse 언래핑), `hooks/useTodos.ts`(query + create/update/toggleDone 낙관적),
  `lib/queryClient.ts`(QueryCache/MutationCache 전역 에러 토스트).
- 스토어(Zustand): selection(비영속) / pin(영속, number[]) / prefs(영속: keyword·filter·pageSize) / theme(영속, DOM 동기화는 액션·onRehydrate) / toast.
- 파생: `useTodoView`(검색→필터→핀정렬→페이지, useMemo) — select/effect 아님.
- 삭제 Undo: `useDeferredDelete`(낙관적 제거 + 5s 타이머, 만료 후 DELETE, Undo 시 복원; 타이머는 이벤트에서 생성).
- UI: TodoPage(조립) / AddTodoForm / TodoToolbar(검색·필터·전체선택·삭제·페이지크기) / TodoList / TodoRow /
  TodoRowEditor(인라인, draft props 1회 초기화) / Pagination / ToastViewport / EmptyState·ErrorMessage·Skeleton / ThemeToggle.

### 검증

- `npm run lint` (--max-warnings 0) 통과. (초기 prefer-const 위반 1건 → timer를 const 홀더로 수정)
- `npm run build` (tsc -b + vite build) 통과. dev 서버 정상 부팅, Tailwind CSS 생성 확인.

### 미해결 / 다음 할 일

- 브라우저 실제 동작 확인(요구사항별 수동 검증).
- STEP 5: Vitest 테스트(정상/에러/엣지/빈상태) — 테스트 환경 설정 포함.
- STEP 8: README.md 작성.
- 의미 단위 커밋(커밋 히스토리 평가 대상).

---

## 2026-06-09 — 세션 5: 아이콘 lucide 교체 + 동작 검증 + 커밋

### 사용자 핵심 지시

- 이모지 아이콘을 전부 **lucide-react**로 교체.
- 그다음 #1(동작 검증) → #4(커밋) 진행.

### 처리

- `lucide-react` 설치. 전 컴포넌트 이모지 → lucide 아이콘 교체:
  ListTodo(제목)·Sun/Moon(테마)·Pin(고정)·Pencil(편집)·Trash2(삭제/선택삭제)·Search(검색)·
  X(토스트 닫기)·Inbox/SearchX(빈 상태)·TriangleAlert(에러)·ChevronLeft/Right(페이지네이션).
- 동작 검증: 브라우저 자동화 도구가 없어 **MSW(node) + Testing Library 스모크 테스트**로 대체 검증.
  - 테스트 인프라: vite.config의 vitest test 설정, `src/test/server.ts`(setupServer로 핸들러 재사용),
    `src/test/setup.ts`(jest-dom, 핸들러 listen/reset, localStorage·zustand 스토어 초기화).
  - `src/features/todo/TodoPage.test.tsx`: 빈 상태 / 추가 / 빈 입력 검증 / 검색 필터 / 완료 취소선 — **5/5 통과**.
- 최종: `npm run lint`(--max-warnings 0)·`npm run build`·`npm run test` 모두 통과.
- `public/mockServiceWorker.js`는 LF/CRLF 줄바꿈 차이만 있어 원상복구(seed 보존).

### 커밋

- 의미 단위로 분리 커밋(세부는 git log 참조). `.claude/`·`CLAUDE.md`는 추적 제외, `docs/`는 포함.

### 다음 할 일

- STEP 8: README.md 작성. 필요 시 테스트 케이스 보강(에러/페이지네이션/Undo/Pin).

---

## 2026-06-09 — 세션 6: 완료 토글 UX 수정 + 접근성 + 디자인 개선

### 사용자 피드백 (브라우저 확인 중)

- "진행중 상태로 변경이 불가능한 것 같다" / "핀 아이콘이 아직 이모티콘" / "UI가 별로 안 예쁘다" / 접근성 반영 요청.

### 진단

- **핀 이모지 원인 = stale dev 서버**: 이전 세션에서 띄운 vite 서버 2개(:5173 PID 133136, :5174 PID 133168)가
  살아있었고 브라우저가 lucide 교체 이전 코드(:5173)를 보고 있었음. 코드상으론 이미 lucide.
  → 두 서버 종료 후 신규 서버를 :5173에 기동(브라우저 자동 재연결).
- **"진행중 변경 불가" 원인 = UX**: 행에 외형이 동일한 체크박스 2개(선택/완료)가 있어 완료 토글을
  인지하지 못함. 필터 로직 자체는 정상.

### 변경

- 완료 토글을 **원형 체크 버튼**(Check 아이콘, aria-pressed, "완료 처리/완료 취소" 라벨)으로 분리 →
  선택 체크박스와 명확히 구분, 진행중↔완료 전환이 직관적.
- 접근성: 공용 `lib/ui.ts`(focusRing) 추가해 모든 인터랙티브 요소에 키보드 포커스 링,
  폼 에러 `role="alert"` + `aria-describedby`, 마감 배지 `title`, `index.html` lang=ko,
  토스트 `aria-live`, 선택 개수 `aria-live`.
- 디자인: indigo 팔레트, rounded-2xl 카드 + shadow, 세그먼트형 필터(피사형), hover/transition,
  배지 색 대비 개선, 다크모드 톤 정리, index.css 배경/안티앨리어싱.
- 테스트: 완료 토글이 버튼으로 바뀌어 해당 케이스를 role/라벨 기준으로 갱신. **5/5 통과 유지**.

### 검증

- lint(--max-warnings 0) · test(5/5) · build 모두 통과.

### 다음 할 일

- 사용자 브라우저 재확인. 이후 STEP 8 README, 테스트 보강(에러/페이지네이션/Undo/Pin).
