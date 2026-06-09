import { create } from 'zustand'

interface SelectionState {
  selectedIds: Set<number>
  toggle: (id: number) => void
  setMany: (ids: number[], selected: boolean) => void
  clear: () => void
}

// 다중 선택 상태 (비영속 — 새로고침 시 초기화)
export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: new Set(),
  toggle: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedIds: next }
    }),
  setMany: (ids, selected) =>
    set((s) => {
      const next = new Set(s.selectedIds)
      ids.forEach((id) => (selected ? next.add(id) : next.delete(id)))
      return { selectedIds: next }
    }),
  clear: () => set({ selectedIds: new Set() }),
}))
