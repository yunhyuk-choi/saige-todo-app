import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTodoListStore } from '../store'
import { TODOS_QUERY_KEY, todosApi } from '../api'

/** {@link useTodoDeletion}이 반환하는 값. */
interface TodoDeletionResult {
  /** 현재 선택된 항목들을 일괄 삭제하고, 성공 시 선택을 비웁니다. */
  deleteSelected: () => void
}

/**
 * "삭제" 관심사 훅. 선택(store)을 부가 상태로 삼아 단체 삭제를 수행합니다.
 * 선택 집합은 구독하지 않고 호출 시점에 `getState()`로만 읽으며, 성공 시 선택
 * 비우기와 목록 무효화는 mutation 콜백이, 실패 시 전역 토스트는
 * `MutationCache.onError`가 처리합니다. (사라진 항목의 선택 정리는 목록
 * 쿼리의 `queryFn`에서 이뤄집니다.)
 */
export function useTodoDeletion(): TodoDeletionResult {
  const queryClient = useQueryClient()
  const clearSelection = useTodoListStore((s) => s.clearSelection)

  const { mutate } = useMutation({
    mutationFn: (ids: number[]) =>
      Promise.all(ids.map((id) => todosApi.remove(id))),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  })

  const deleteSelected = useCallback(() => {
    const ids = [...useTodoListStore.getState().selectedIds]
    if (ids.length === 0) return
    mutate(ids, { onSuccess: clearSelection })
  }, [mutate, clearSelection])

  return { deleteSelected }
}
