import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StatusFilter = 'all' | 'active' | 'done'
export type PageSize = 5 | 10 | 20

interface PrefsState {
  keyword: string
  statusFilter: StatusFilter
  pageSize: PageSize
  setKeyword: (keyword: string) => void
  setStatusFilter: (statusFilter: StatusFilter) => void
  setPageSize: (pageSize: PageSize) => void
}

// 검색어/필터/페이지크기 — 영속(요구사항: 검색어는 브라우저 재오픈 시 유지)
export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      keyword: '',
      statusFilter: 'all',
      pageSize: 10,
      setKeyword: (keyword) => set({ keyword }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setPageSize: (pageSize) => set({ pageSize }),
    }),
    { name: 'todo:prefs' },
  ),
)
