import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ToDo } from '../../../types/api'
import { useTodoListStore } from '../store'
import { TODOS_QUERY_KEY, todosApi } from '../api'

/** 미완료 항목을 먼저, 그다음 기한이 이른 순으로 정렬합니다. */
function sortTodos(a: ToDo, b: ToDo): number {
  if (a.done !== b.done) return a.done ? 1 : -1
  return a.deadline - b.deadline
}

/** {@link useTodoListView}가 반환하는 값. */
interface TodoListViewResult {
  /** 현재 검색어로 필터링하고 정렬한 목록. */
  todos: ToDo[]
  /** 조회/재조회 진행 중이면 `true`. */
  loading: boolean
}

/**
 * "목록 조회" 관심사 훅. `useQuery`로 전체 목록을 캐싱하되, **`select`로
 * 검색어(store.query)를 적용한 필터/정렬 뷰만 파생**합니다. 캐시에는 원본
 * 전체가 그대로 남으므로 검색어를 지우면 즉시 전체가 복귀하고, mutation이
 * 캐시를 무효화하면 이 뷰도 자동 갱신됩니다. 조회 실패는 QueryClient의
 * `QueryCache.onError`에서 전역 토스트로 처리하므로 여기선 다루지 않습니다.
 */
export function useTodoListView(): TodoListViewResult {
  const query = useTodoListStore((s) => s.query)

  const select = useCallback(
    (all: ToDo[]) => {
      const k = query.trim().toLowerCase()
      return all
        .filter((todo) => (k ? todo.text.toLowerCase().includes(k) : true))
        .sort(sortTodos)
    },
    [query]
  )

  const result = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: async () => {
      const data = (await todosApi.list()) ?? []
      // 서버 목록이 갱신될 때, 더 이상 없는 항목의 선택을 함께 정리합니다.
      useTodoListStore.getState().pruneSelection(data.map((t) => t.id))
      return data
    },

    select,
  })

  return { todos: result.data ?? [], loading: result.isFetching }
}
