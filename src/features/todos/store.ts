import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEBOUNCE_MS = 300
let debounceTimer: ReturnType<typeof setTimeout> | undefined

/**
 * 목록 화면의 client UI 상태(검색어/선택/고정/페이지네이션) store. 각 컴포넌트는
 * selector로 필요한 slice만 구독하므로, 무관한 상태 변경이 무관한 컴포넌트를
 * 리렌더하지 않습니다. 검색어·페이지 크기·고정 목록은 localStorage에 영속화됩니다.
 */
interface TodoListStore {
  /** 입력란에 즉시 반영되는 검색어. */
  keyword: string
  /** 필터에 실제 적용되는(디바운스된) 검색어. */
  query: string
  /** 검색어 설정. 내용이 있으면 디바운스, 비면 즉시 적용(필터 해제). */
  setKeyword: (value: string) => void
  /** 검색어를 즉시 비웁니다(X 버튼). 디바운스 없이 전체 목록 복귀. */
  clearKeyword: () => void

  /** 선택된 할 일 id 집합. */
  selectedIds: Set<number>
  /** 단일 선택 토글. */
  toggleSelect: (id: number) => void
  /** 주어진 id들(보통 필터된 항목)의 선택을 일괄 토글. */
  toggleSelectAll: (ids: number[]) => void
  /** 모든 선택 해제. */
  clearSelection: () => void

  /** 상단에 고정된 할 일 id 목록(영속). */
  pinnedIds: number[]
  /** 해당 항목의 고정/해제를 토글합니다. */
  togglePin: (id: number) => void

  /** 더 이상 존재하지 않는 항목의 선택·고정을 정리. */
  pruneMissing: (existingIds: number[]) => void

  /** 0부터 시작하는 현재 페이지. */
  page: number
  /** 페이지당 항목 수(영속화). */
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

export const useTodoListStore = create<TodoListStore>()(
  persist(
    (set) => ({
      keyword: '',
      query: '',
      setKeyword: (value) => {
        set({ keyword: value, page: 0 })
        if (debounceTimer) clearTimeout(debounceTimer)
        if (value.trim() === '') {
          set({ query: '' }) // 비면 즉시
        } else {
          debounceTimer = setTimeout(() => set({ query: value }), DEBOUNCE_MS)
        }
      },
      clearKeyword: () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        set({ keyword: '', query: '', page: 0 })
      },

      selectedIds: new Set<number>(),
      toggleSelect: (id) =>
        set((s) => {
          const next = new Set(s.selectedIds)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return { selectedIds: next }
        }),
      toggleSelectAll: (ids) =>
        set((s) => {
          const all = ids.length > 0 && ids.every((id) => s.selectedIds.has(id))
          const next = new Set(s.selectedIds)
          if (all) ids.forEach((id) => next.delete(id))
          else ids.forEach((id) => next.add(id))
          return { selectedIds: next }
        }),
      clearSelection: () => set({ selectedIds: new Set() }),

      pinnedIds: [],
      togglePin: (id) =>
        set((s) => ({
          pinnedIds: s.pinnedIds.includes(id)
            ? s.pinnedIds.filter((x) => x !== id)
            : [...s.pinnedIds, id],
        })),

      pruneMissing: (existingIds) =>
        set((s) => {
          const existing = new Set(existingIds)
          const nextSelected = new Set(
            [...s.selectedIds].filter((id) => existing.has(id))
          )
          const nextPinned = s.pinnedIds.filter((id) => existing.has(id))
          const selChanged = nextSelected.size !== s.selectedIds.size
          const pinChanged = nextPinned.length !== s.pinnedIds.length
          if (!selChanged && !pinChanged) return {}
          return {
            ...(selChanged ? { selectedIds: nextSelected } : {}),
            ...(pinChanged ? { pinnedIds: nextPinned } : {}),
          }
        }),

      page: 0,
      pageSize: 10,
      setPage: (page) => set({ page }),
      setPageSize: (size) => set({ pageSize: size, page: 0 }),
    }),
    {
      name: 'todo:list',
      partialize: (s) => ({
        keyword: s.keyword,
        query: s.query,
        pageSize: s.pageSize,
        pinnedIds: s.pinnedIds,
      }),
    }
  )
)
