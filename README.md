# To-Do List Application

요구사항을 충족하는 To-Do List 애플리케이션입니다. **React 18 + TypeScript + Vite**
기반이며, API는 제공된 **Mock Service Worker(MSW)** 를 그대로 사용하고 UI는 **MUI**로
구현했습니다. 서버 상태는 **TanStack Query**, 화면(클라이언트) 상태는 **Zustand**로
분리해 관리합니다.

## 실행 방법

```bash
# Node 22 (.nvmrc 참고)
npm install      # 의존성 설치 (MSW 워커는 public/mockServiceWorker.js 로 포함)
npm run dev      # 개발 서버 실행 후 브라우저에서 접속
```

| 스크립트          | 설명                                  |
| ----------------- | ------------------------------------- |
| `npm run dev`     | 개발 서버 (Vite)                      |
| `npm run build`   | 타입 체크(`tsc -b`) 후 프로덕션 빌드  |
| `npm run preview` | 빌드 결과물 미리보기                  |
| `npm run lint`    | ESLint 검사 (`--max-warnings 0`)      |

> API는 브라우저 컨텍스트의 MSW로 동작합니다(외부 도구에서의 호출 불가). 데이터는
> 브라우저 `localStorage`(`todos` 키)에 저장되어 새로고침/재방문 후에도 유지됩니다.

## 기술 스택

| 영역          | 사용 기술                                                        |
| ------------- | --------------------------------------------------------------- |
| 코어          | React 18, TypeScript, Vite 6                                    |
| UI            | MUI 6 (`@mui/material`, `@mui/icons-material`), Emotion         |
| 날짜          | `@mui/x-date-pickers` 7, Day.js                                 |
| 서버 상태     | TanStack Query 5 (`@tanstack/react-query`)                     |
| 클라이언트 상태 | Zustand (+ `persist` 미들웨어)                                 |
| API 모킹      | MSW 2 (제공된 설정 사용)                                        |

## 요구사항 구현 내역

### 기능 요구사항

- **신규 To-Do 추가** — 상단 폼에서 내용·기한을 입력해 추가합니다.
  - **유효성 검증**(`features/todos/validation.ts`)
    - 할 일은 반드시 입력(공백만 입력 시 차단).
    - 과거 날짜 입력 불가(`DatePicker`의 `minDate`를 오늘로 제한 + 제출 시 재검증).
- **Row 단위 수정** — 수정 아이콘 → 해당 행이 인라인 편집 모드로 전환되어 내용·기한을
  바로 고치고 저장/취소합니다.
- **완료 처리 및 표시** — 완료 체크박스로 토글하며, 완료 항목은 취소선·흐린 색으로
  구분하고 목록 하단으로 정렬합니다(미완료 우선 → 기한 오름차순).
- **다중 선택 후 삭제** — 행 체크박스로 여러 건 선택 후 일괄 삭제하며, 삭제 전 확인
  다이얼로그를 노출합니다.
  - **전체 선택** — 헤더 체크박스로 현재 검색 결과 전체를 선택/해제하고, 일부만
    선택 시 indeterminate로 표시합니다.
- **기한 임박 표시** — 기한이 **3일 이내**면 `D-n`/`D-DAY` 칩과 행 배경색으로 강조,
  기한이 지난 항목은 빨간색(`N일 지남`)으로 구분합니다(완료 항목은 강조 제외).
- **페이지네이션** — (페이지네이션/무한 스크롤 중) **페이지네이션**을 선택. 페이지당
  **5 / 10 / 20** 행을 고를 수 있습니다.
- **검색** — 내용 기준 실시간 검색.
  - 검색어는 `localStorage`에 보존되어 **브라우저를 다시 열어도 유지/복원**됩니다.
  - 입력은 디바운스(300ms)로 필터링하되, **X 버튼으로 지우면 즉시** 전체 목록으로
    복귀합니다.

### 비기능 요구사항

- **UI 라이브러리** — MUI 사용, 별도 테마(`theme.ts`)로 차분하고 일관된 디자인 적용.
- **다크 모드** — 헤더 우측 토글로 전환. 최초 방문 시 OS 설정(`prefers-color-scheme`)을
  따르고 이후 선택은 `localStorage`에 보존.
- **반응형** — `sm`(600px) 미만에서는 테이블 대신 **카드 리스트**로 전환되어 모바일에서도
  가로 스크롤 없이 동일 기능을 제공합니다.
- **문서화 / 커밋 히스토리** — 본 README와 단계별 커밋(`.git` 포함)으로 정리.

## 기술적으로 신경 쓴 점

요구사항 충족을 넘어, **유지보수 가능하고 성능을 고려한 구조**에 집중했습니다.

- **서버 상태 / 클라이언트 상태 분리** — 서버 데이터(목록)는 TanStack Query, 화면 상태
  (검색·선택·고정·페이지)는 Zustand로 나눠 각자 책임만 지게 했습니다. "어디서 무엇이
  바뀌는가"가 명확해 추적·확장이 쉽습니다.
- **불필요한 리렌더 차단** — 컴포넌트는 store의 필요한 slice만 `selector`로 구독하고,
  리스트 항목은 `memo` + 자기 상태만 구독합니다. 한 항목을 선택/고정해도 **그 항목만**
  리렌더되고, 입력 폼은 목록이 바뀌어도 리렌더되지 않습니다.
- **React Query 관용적 사용** — 필터는 `select`로 파생(원본 캐시 보존), mutation은
  `invalidate`로 자동 동기화, 로딩/성공/실패는 `isPending`·`onSuccess`·`onError`에 위임해
  **수동 로딩 상태와 try/catch를 제거**했습니다.
- **`useEffect` 최소화** — 파생 데이터는 `select`, 정리(prune)는 `queryFn`, 토스트 큐는
  이벤트 기반으로 처리해 "상태를 effect로 뒤쫓는" 안티패턴을 없앴습니다(strict/React
  Compiler에도 안전).
- **재사용 & 관심사 분리** — 생성·수정 폼을 공용 컨트롤러 훅으로 통합, 도메인 로직을
  기능별 커스텀 훅으로 분리, feature 단위 폴더 구조.
- **에러 처리 일원화** — 모든 조회·변경 실패를 한 곳(`QueryCache`/`MutationCache`)에서
  전역 토스트로 표시 → 각 컴포넌트는 에러 표시를 신경 쓰지 않습니다.
- **타입 안전성 · 코드 품질** — TypeScript strict, ESLint(`--max-warnings 0`) 무경고,
  공개 API에 TSDoc 주석.
- **UX 디테일** — 검색 디바운스 + X 즉시 해제, 검색어 영속, 삭제 확인 다이얼로그,
  `aria-label` 접근성, 다크모드(OS 연동), 반응형(모바일 카드 전환), 기한 임박 시각화,
  항목 상단 고정(pin).

## 아키텍처 & 설계 결정

### 서버 상태 — TanStack Query

- 목록은 `useQuery(['todos'])`로 **한 번만 조회·캐싱**합니다. 검색 필터는 `select`로
  **파생 뷰**를 만들어 적용하므로, 캐시에는 원본 전체가 유지되어 **검색어를 지우면 즉시
  전체가 복귀**하고 매 검색마다 재요청하지 않습니다.
- 생성/수정/삭제는 `useMutation`으로 처리하고 성공 시 쿼리를 무효화(`invalidate`)해
  목록을 자동 갱신합니다. 수동 `loading`/`refetch` 로직이 없습니다.
- 제공 API에 검색·페이징 파라미터가 없어 **필터/정렬/페이징은 클라이언트**에서 수행합니다.
- **에러 처리 일원화** — `QueryClient`(`components/QueryProvider.tsx`)의 `QueryCache`/
  `MutationCache` `onError`에서 모든 조회·변경 실패를 잡아 **전역 토스트**로 표시합니다
  (개별 훅은 에러를 모름).

### 클라이언트 상태 — Zustand

- 검색어·선택 집합·페이지네이션을 store로 두고, 각 컴포넌트는 **selector로 필요한 slice만
  구독**합니다. 덕분에 무관한 상태 변경이 무관한 컴포넌트를 리렌더하지 않습니다
  (예: 한 행을 선택해도 다른 행·입력 폼은 리렌더되지 않음).
- 검색어와 페이지 크기는 `persist` 미들웨어로 `localStorage`에 보존됩니다.

### 관심사 분리 & 리렌더 최적화

- `TodoPage`는 상태 훅 없이 **블록을 배치만** 하는 정적 레이아웃이라, 목록·검색·선택이
  바뀌어도 형제(입력 폼·헤더)는 리렌더되지 않습니다.
- 도메인 로직은 커스텀 훅으로 분리: 조회(`useTodoListView`), 변경(`useTodoMutation`),
  삭제(`useTodoDeletion`), 편집 모드(`useTodoEditing`), 폼 컨트롤러(`useTodoDraftForm`),
  페이지 파생(`usePagedTodos`).
- 행/카드는 `memo` + 자기 선택 상태만 구독해 리스트 리렌더를 최소화합니다.
- 입력 폼은 생성 mutation만 구독(`useQuery` 비구독)하므로 목록 변경에 흔들리지 않습니다.
- 생성·수정 폼은 **공용 컨트롤러**(`useTodoDraftForm`)를 공유하고, 편집 폼은 *편집 중에만
  마운트*되어 `useEffect` 없이 초기화됩니다. 로딩/성공/실패는 mutation의
  `isPending`/`onSuccess`/`onError`에 위임합니다.

### 성능

- 리렌더는 `memo` + Zustand selector **부분 구독**으로 최소화했습니다(위 참고).
- `vite.config`의 `manualChunks`로 벤더(mui-material / emotion / query / mui-icons)를
  분리해 단일 거대 번들을 쪼개고 캐싱·병렬 로드를 개선했습니다.

### 도메인 처리 메모

- 기한은 timestamp(ms)로 저장하며, 추가/수정 시 선택 날짜의 `endOf('day')`로 저장해 당일
  마감이 "지남"으로 오판되지 않게 했습니다. 임박 여부는 일(day) 단위 차이로 판정합니다.
- 접근성: 체크박스/버튼에 `aria-label` 부여, 삭제는 확인 다이얼로그로 실수 방지.

## 프로젝트 구조

```text
src/
├─ components/                # 도메인 비의존 공용 컴포넌트
│  ├─ QueryProvider.tsx       # QueryClient 구성(캐시 기반 전역 에러) + Provider
│  └─ ToastProvider.tsx       # 전역 토스트(Snackbar) + 큐
├─ features/
│  └─ todos/                  # To-Do 기능
│     ├─ components/          # TodoPage · TodoListSection · TodoListToolbar · SearchBar
│     │                       #  · TodoTable/Row/RowEditor · TodoCardList/Card/CardEditor
│     │                       #  · SelectAllCheckbox · DeadlineCell · DeleteConfirmDialog
│     │                       #  · TodoForm · TodoListHeader
│     ├─ hooks/               # useTodoListView · useTodoMutation · useTodoDeletion
│     │                       #  · useTodoEditing · useTodoDraftForm · usePagedTodos
│     ├─ api.ts               # APIResponse 언래핑 + CRUD 클라이언트 + 쿼리 키
│     ├─ store.ts             # Zustand: 검색/선택/페이지네이션 (영속)
│     └─ validation.ts        # 입력 유효성 규칙
├─ hooks/                     # 공용 훅
│  ├─ useColorMode.ts         # 라이트/다크 모드 + 테마(영속)
│  ├─ usePersistentState.ts   # localStorage 동기화 state
│  └─ useToast.ts             # 토스트 컨텍스트/훅
├─ mocks/                     # MSW 핸들러 (제공된 코드)
├─ types/                     # API 타입
├─ utils/
│  ├─ date.ts                 # 기한 상태/라벨 계산
│  └─ error.ts                # 에러 메시지 변환
├─ App.tsx                    # provider 조립 + 화면 렌더
├─ theme.ts                   # MUI 라이트/다크 테마 팩토리
├─ index.css / App.css        # 전역 스타일
└─ main.tsx                   # 진입점 (MSW 워커 기동)
```

> `@/*` → `src/*` 경로 alias(tsconfig + vite)로 import 경로를 단순화했습니다.
