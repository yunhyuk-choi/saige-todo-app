import { useMemo } from 'react'
import { usePinStore } from '../../stores/pinStore'
import { usePrefsStore } from '../../stores/prefsStore'
import type { ToDo } from '../../types/api'

export interface TodoView {
  pageItems: ToDo[]
  allIds: number[]
  totalFiltered: number
  totalPages: number
  safePage: number
}

// 검색 → 필터 → 핀 우선 정렬 → 페이지 슬라이스. 전부 렌더 중 파생(effect ❌, select ❌).
export function useTodoView(todos: ToDo[], page: number): TodoView {
  const keyword = usePrefsStore((s) => s.keyword)
  const statusFilter = usePrefsStore((s) => s.statusFilter)
  const pageSize = usePrefsStore((s) => s.pageSize)
  const pinnedIds = usePinStore((s) => s.pinnedIds)

  return useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    const pinned = new Set(pinnedIds)

    const filtered = todos.filter((t) => {
      if (kw && !t.text.toLowerCase().includes(kw)) return false
      if (statusFilter === 'active' && t.done) return false
      if (statusFilter === 'done' && !t.done) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) => {
      const ap = pinned.has(a.id) ? 0 : 1
      const bp = pinned.has(b.id) ? 0 : 1
      if (ap !== bp) return ap - bp
      return a.deadline - b.deadline
    })

    const totalFiltered = sorted.length
    const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * pageSize

    return {
      pageItems: sorted.slice(start, start + pageSize),
      allIds: sorted.map((t) => t.id),
      totalFiltered,
      totalPages,
      safePage,
    }
  }, [todos, keyword, statusFilter, pageSize, pinnedIds, page])
}
