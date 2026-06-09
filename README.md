# To-Do List Application — 안내

> ⚠️ **이 `main` 브랜치에는 안내(가이드)만 있습니다.**
> 실제 결과물(소스 코드 · 각 버전의 README)은 아래 **두 브랜치에 각각** 들어 있습니다.
> 리뷰하실 때는 번거로우시겠지만 각 브랜치로 이동해 코드와 해당 브랜치의 README를 확인해 주세요.

이 저장소에는 동일한 To-Do List 과제를 **두 가지 방식**으로 구현한 결과물이 브랜치별로 담겨 있습니다.

| 브랜치 | 구현 방식 | 핵심 스택 |
| ------ | --------- | --------- |
| [`self-development`](../../tree/self-development) | 직접 개발 | React 18 · MUI 6 · TanStack Query · Zustand |
| [`auto-development-workflow`](../../tree/auto-development-workflow) | 직접 만든 Claude Code 워크플로우 기반 개발 | React 18 · Tailwind CSS v4 · TanStack Query v5 · Zustand |

```bash
# 각 브랜치로 이동해 확인
git checkout self-development        # 직접 개발 버전
git checkout auto-development-workflow # 워크플로우 기반 버전

# 공통 실행
npm install && npm run dev
```

> 두 버전 모두 요구사항(`REQUIREMENT.md`)을 충족하며, API는 제공된 **MSW**를 그대로 사용합니다.
> 데이터는 브라우저 `localStorage`에 저장됩니다.

---

## 1. `self-development` — 직접 개발 버전

손으로 직접 설계·구현한 버전입니다. **MUI**로 완성도 높은 UI를 구성하고, 서버 상태와 화면 상태를 분리해 관리합니다.

**스택**: React 18 · TypeScript · Vite 6 · **MUI 6 + Emotion** · `@mui/x-date-pickers` + Day.js · TanStack Query 5 · Zustand(persist) · MSW

**핵심 로직 / 설계**

- **상태 분리**: 서버 데이터(목록)는 TanStack Query, 화면 상태(검색·선택·고정·페이지)는 Zustand로 분리.
- **검색 필터는 React Query `select`로 파생** — 캐시에 원본 전체를 유지해 검색어를 지우면 즉시 전체 복귀(재요청 없음).
- **리렌더 최소화**: 컴포넌트가 store의 필요한 slice만 `selector`로 구독 + 행은 `memo`로 자기 상태만 구독 → 한 항목 선택/고정 시 그 항목만 리렌더. 검색 input에 debouncing을 사용해 지연 요청으로 매 타이핑 시점에 요청하지 않도록 구현(한글 검색 sideEffect제거(한을 검색하기 위해 ㅎ->하->한을 타이핑할 때 순간적으로 원하지 않은 결과가 나올 수 있는 케이스. 또한 의도와는 다른 요청이 발생하는 상황 제거))
- **에러 처리 일원화**: `QueryCache`/`MutationCache`의 `onError`에서 전역 토스트 표시.
- **`useEffect` 최소화**: 파생은 `select`, 편집 폼은 편집 중에만 마운트해 effect 없이 초기화.
- **도메인 훅 분리**: `useTodoListView` · `useTodoMutation` · `useTodoDeletion` · `useTodoEditing` · `useTodoDraftForm` · `usePagedTodos`.

**README 핵심 요약**

- 필수 요구사항 전부 구현(추가/검증/인라인 수정/완료 표시/다중삭제+전체선택/마감 임박/페이지네이션 5·10·20/검색 영속).
- 추가: **항목 상단 고정(Pin, 영속)**, **다크 모드**(OS `prefers-color-scheme` 연동 + 영속), **반응형**(모바일에서 테이블→카드 리스트 전환), **검색 디바운스(300ms) + X 즉시 해제**, **삭제 확인 다이얼로그**.
- 기한은 timestamp(ms) + `endOf('day')` 저장으로 당일 마감 오판 방지, `manualChunks` 벤더 분리, `@/*` 경로 alias, TypeScript strict · ESLint 무경고.

> 자세한 내용은 `self-development` 브랜치의 `README.md` 참고.

---

## 2. `auto-development-workflow` — 워크플로우 기반 버전

Claude Code와 정의된 개발 워크플로우(기능 구체화 → 설계 → 구현 → 테스트 → 문서화)를 따라 구현한 버전입니다. **Tailwind CSS**로 UI를 구성하고, 개발 과정 기록을 함께 추적합니다.

사용된 workflow는 제가 직접 고안한 것으로 현재는 `aws ai-dlc`를 sub agent로 붙여 `multi-repo를 자동 탐지해 각각의 repo의 role을 파악하고 관계에 맞게 sub agent를 동작하여 full stack 개발을 병렬로 orchestration` 할 수 있는 super agent로 고도화를 해놓은 상태지만, 현재 이 프로젝트에 사용한 workflow는 `프론트엔드 한정의 초기 버전`입니다.

**스택**: React 18 · TypeScript strict · Vite 6(SWC) · **Tailwind CSS v4** · lucide-react · TanStack Query v5 · Zustand(persist) · MSW · **Vitest + Testing Library**

**핵심 로직 / 설계**

- **상태 3계층 분리**: 서버 상태(React Query) / 공유 클라이언트 상태(Zustand, selector 부분 구독) / 파생값(렌더 중 계산).
- **검색·필터·정렬·페이지는 `select`가 아닌 렌더 중 파생**(`useTodoView`, useMemo) — 클라이언트 UI 상태라 쿼리 키에 묶이지 않으므로 캐시 원본 1벌 유지 + 매 렌더 파생. (self-development와 대비되는 선택)
- **완료 토글 낙관적 업데이트**(`onMutate` + 실패 롤백), 전역 에러는 v5 `QueryCache`/`MutationCache`.
- **삭제는 "지연 삭제(Undo)"**: 캐시에서 낙관적 제거 + 5초 타이머, 만료 시 실제 `DELETE`, 그 전 Undo 시 복원. 삭제 확정 시 고정(pin) 정보 정리(id 재사용 대비).
- **완료/진행중을 체크박스가 아닌 상태 칩**으로 표현 → 선택(삭제용) 체크박스와의 혼동 제거.

**README 핵심 요약**

- 필수 요구사항 전부 구현(추가/검증/인라인 수정/완료 표시/다중삭제+전체선택/마감 임박/페이지네이션 5·10·20/검색 영속).
- 추가: **Pin(영속)**, **상태 필터(전체/진행중/완료)**, **낙관적 업데이트**, **삭제 Undo**, **다크 모드(영속)**.
- 접근성: 키보드 포커스 링, `aria-label`/`aria-pressed`, 폼 에러 `role="alert"`, `aria-live`, `lang="ko"`.
- 테스트: Vitest + Testing Library로 추가/검증/검색/완료/필터/핀/페이지네이션/다중삭제+Undo/편집 검증(16 tests).
- 개발 과정 기록: `docs/conversation-log.md`(세션별 의사결정), `docs/workflow/`(단계별 산출물 — 명세서·설계·UI 초안).

> 자세한 내용은 `auto-development-workflow` 브랜치의 `README.md` 참고.

---

## 두 버전 비교 요약

| 항목 | self-development | auto-development-workflow |
| ---- | ---------------- | ------------------------- |
| UI 라이브러리 | MUI 6 | Tailwind CSS v4 + lucide-react |
| 검색/필터 처리 | React Query `select` 파생 | 렌더 중 파생(useMemo) |
| 완료 표시 | 체크박스 + 취소선 | 상태 칩(진행중/완료) |
| 삭제 UX | 확인 다이얼로그 | 낙관적 삭제 + Undo 토스트 |
| 반응형 | 모바일 카드 전환 | flex 기반 대응 |
| 다크 모드 | OS 연동 + 영속 | 토글 + 영속 |
| 자동화 테스트 | — | Vitest + RTL(16) |
| 개발 과정 기록 | 커밋 히스토리 | 커밋 + 대화 로그 + 단계별 산출물 |
