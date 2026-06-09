import { ListTodo } from 'lucide-react'
import { useState } from 'react'
import { useTodosQuery } from '../../hooks/useTodos'
import { getErrorMessage } from '../../lib/error'
import { AddTodoForm } from './AddTodoForm'
import { Pagination } from './Pagination'
import { ThemeToggle } from './ThemeToggle'
import { ToastViewport } from './ToastViewport'
import { TodoList } from './TodoList'
import { TodoToolbar } from './TodoToolbar'
import { EmptyState } from './components/EmptyState'
import { ErrorMessage } from './components/ErrorMessage'
import { TodoListSkeleton } from './components/TodoListSkeleton'
import { useTodoView } from './useTodoView'

export function TodoPage() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = useTodosQuery()
  const todos = data ?? []
  const view = useTodoView(todos, page)

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6">
      <header className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <ListTodo className="size-6 text-blue-500" aria-hidden />
          To-Do List
        </h1>
        <ThemeToggle />
      </header>

      <div className="mt-4">
        <AddTodoForm />
      </div>

      {isPending ? (
        <TodoListSkeleton />
      ) : isError ? (
        <ErrorMessage message={getErrorMessage(error)} onRetry={() => void refetch()} />
      ) : (
        <>
          <TodoToolbar allIds={view.allIds} />
          {view.totalFiltered === 0 ? (
            <EmptyState variant={todos.length === 0 ? 'empty' : 'noresult'} />
          ) : (
            <>
              <TodoList items={view.pageItems} />
              <Pagination safePage={view.safePage} totalPages={view.totalPages} onChange={setPage} />
            </>
          )}
        </>
      )}

      <ToastViewport />
    </div>
  )
}
