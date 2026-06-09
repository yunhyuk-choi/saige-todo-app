import { useState } from 'react'
import type { ToDo } from '../../types/api'
import { TodoRow } from './TodoRow'
import { TodoRowEditor } from './TodoRowEditor'

export function TodoList({ items }: { items: ToDo[] }) {
  // 한 번에 한 행만 편집
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <ul className="mt-4 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
      {items.map((todo) =>
        editingId === todo.id ? (
          <TodoRowEditor key={todo.id} todo={todo} onClose={() => setEditingId(null)} />
        ) : (
          <TodoRow key={todo.id} todo={todo} onEdit={() => setEditingId(todo.id)} />
        ),
      )}
    </ul>
  )
}
