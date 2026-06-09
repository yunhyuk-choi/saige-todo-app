import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTodo, fetchTodos, updateTodo } from '../api/todos'
import type { ToDo, ToDoRequest } from '../types/api'

export const todosKey = ['todos'] as const

export function useTodosQuery() {
  return useQuery({ queryKey: todosKey, queryFn: fetchTodos })
}

export function useCreateTodo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ToDoRequest) => createTodo(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: todosKey }),
  })
}

export function useUpdateTodo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ToDoRequest }) => updateTodo(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: todosKey }),
  })
}

// 완료 토글 — 낙관적 업데이트 + 실패 시 롤백
export function useToggleDone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (todo: ToDo) =>
      updateTodo(todo.id, { text: todo.text, done: !todo.done, deadline: todo.deadline }),
    onMutate: async (todo: ToDo) => {
      await qc.cancelQueries({ queryKey: todosKey })
      const previous = qc.getQueryData<ToDo[]>(todosKey)
      qc.setQueryData<ToDo[]>(todosKey, (old) =>
        (old ?? []).map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)),
      )
      return { previous }
    },
    onError: (_error, _todo, context) => {
      if (context?.previous) qc.setQueryData(todosKey, context.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: todosKey }),
  })
}
