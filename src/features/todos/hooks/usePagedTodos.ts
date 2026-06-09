import { useMemo } from 'react'
import { useTodoListStore } from '../store'
import { useTodoListView } from '../hooks/useTodoListView'
import { ToDo } from '../../../types/api'

/** {@link usePagedTodos}가 반환하는 값. */
interface PagedTodosResult {
  /** 현재 페이지에 표시할 항목들. */
  pageItems: ToDo[]
  /** 현재 페이지가 비었는지 여부. */
  isEmpty: boolean
  /** 비었을 때 보여줄 메시지(검색 여부에 따라 다름). */
  emptyMessage: string
  /** 필터된 전체 개수. */
  total: number
  /** 범위 보정된 현재 페이지(0부터). */
  page: number
  /** 전체 페이지 수(최소 1). */
  pageCount: number
  /** 페이지당 항목 수. */
  pageSize: number
  /** 조회/재조회 진행 중이면 `true`. */
  loading: boolean
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

/**
 * 필터된 목록({@link useTodoListView})에 페이지네이션(store의 page/pageSize)을
 * 적용해 **현재 페이지 항목과 메타데이터**를 돌려주는 공유 훅. 테이블·카드·
 * 페이지네이션 컨트롤이 동일 로직을 중복 없이 사용합니다. **선택 상태는
 * 구독하지 않으므로**, 이 훅을 쓰는 목록은 선택 토글에 리렌더되지 않습니다.
 */
export function usePagedTodos(): PagedTodosResult {
  const { todos, loading } = useTodoListView()
  const query = useTodoListStore((s) => s.query)
  const page = useTodoListStore((s) => s.page)
  const pageSize = useTodoListStore((s) => s.pageSize)
  const setPage = useTodoListStore((s) => s.setPage)
  const setPageSize = useTodoListStore((s) => s.setPageSize)

  const total = todos.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = useMemo(
    () => todos.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [todos, safePage, pageSize]
  )

  const emptyMessage = query.trim()
    ? '검색 결과가 없습니다.'
    : '등록된 할 일이 없습니다. 위에서 새 할 일을 추가해 보세요.'

  return {
    pageItems,
    isEmpty: pageItems.length === 0,
    emptyMessage,
    total,
    page: safePage,
    pageCount,
    pageSize,
    loading,
    setPage,
    setPageSize,
  }
}
