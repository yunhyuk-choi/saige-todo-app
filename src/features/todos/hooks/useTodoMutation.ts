import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TODOS_QUERY_KEY, todosApi } from '../api'
import { ToDo, ToDoRequest } from '../../../types/api'

/** 목록 쿼리를 무효화(재조회)하는 콜백을 돌려주는 내부 훅. */
function useInvalidateTodos() {
  const queryClient = useQueryClient()
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
    [queryClient]
  )
}

/**
 * 생성 mutation. `useMutation` 결과를 그대로 반환하므로 호출부가 `mutate`/
 * `isPending`을 직접 씁니다(수동 로딩 상태·try/catch 불필요). 성공 시 목록을
 * 무효화하며, 실패는 QueryClient의 `MutationCache.onError`에서 전역 토스트로
 * 처리합니다. 목록 쿼리를 구독하지 않으므로 이 훅만 쓰는 입력 폼은 목록
 * 변경에 리렌더되지 않습니다.
 */
export function useCreateTodo() {
  const invalidate = useInvalidateTodos()
  return useMutation({
    mutationFn: (body: ToDoRequest) => todosApi.create(body),
    onSuccess: invalidate,
  })
}

/**
 * 수정/완료 토글 mutation. 편집 폼은 `mutate`/`isPending`을 직접 사용하고,
 * 체크박스는 `toggleDone`(fire-and-forget)을 씁니다. 성공 시 목록을 무효화하며,
 * 실패는 `MutationCache.onError`에서 전역 토스트로 처리합니다.
 */
export function useUpdateTodo() {
  const invalidate = useInvalidateTodos()
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: ToDoRequest }) =>
      todosApi.update(id, body),
    onSuccess: invalidate,
  })

  const toggleDone = useCallback(
    (todo: ToDo) =>
      mutate({
        id: todo.id,
        body: { text: todo.text, done: !todo.done, deadline: todo.deadline },
      }),
    [mutate]
  )

  return { mutate, isPending, toggleDone }
}
