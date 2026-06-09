import { Pencil, Pin, Trash2 } from 'lucide-react'
import { useToggleDone } from '../../hooks/useTodos'
import { cn } from '../../lib/cn'
import { deadlineLabel, isNearDeadline, isOverdue } from '../../lib/date'
import { usePinStore } from '../../stores/pinStore'
import { useSelectionStore } from '../../stores/selectionStore'
import type { ToDo } from '../../types/api'
import { useDeferredDelete } from './useDeferredDelete'

export function TodoRow({ todo, onEdit }: { todo: ToDo; onEdit: () => void }) {
  const selected = useSelectionStore((s) => s.selectedIds.has(todo.id))
  const toggleSelect = useSelectionStore((s) => s.toggle)
  const pinned = usePinStore((s) => s.pinnedIds.includes(todo.id))
  const togglePin = usePinStore((s) => s.togglePin)
  const { mutate: toggleDone } = useToggleDone()
  const { scheduleDelete } = useDeferredDelete()

  const near = !todo.done && isNearDeadline(todo.deadline)
  const overdue = !todo.done && isOverdue(todo.deadline)

  return (
    <li className={cn('flex items-center gap-2 px-2 py-2.5', pinned && 'bg-blue-50 dark:bg-blue-950/40')}>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleSelect(todo.id)}
        aria-label={`${todo.text} 선택`}
      />
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggleDone(todo)}
        aria-label={`${todo.text} 완료`}
      />
      <span className={cn('flex min-w-0 flex-1 items-center gap-1.5 truncate', todo.done && 'text-gray-400 line-through')}>
        {pinned && <Pin className="size-3.5 shrink-0 fill-current text-blue-500" aria-hidden />}
        <span className="truncate">{todo.text}</span>
      </span>
      <span
        className={cn(
          'whitespace-nowrap rounded-full px-2 py-0.5 text-xs',
          overdue
            ? 'bg-red-50 text-red-600 dark:bg-red-950'
            : near
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950'
              : 'border border-gray-200 text-gray-400 dark:border-gray-700',
        )}
      >
        {deadlineLabel(todo.deadline)}
      </span>
      <button
        type="button"
        onClick={() => togglePin(todo.id)}
        aria-pressed={pinned}
        aria-label={pinned ? '고정 해제' : '고정'}
        className={cn(
          'p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400',
          pinned && 'text-blue-500',
        )}
      >
        <Pin className={cn('size-4', pinned && 'fill-current')} aria-hidden />
      </button>
      <button
        type="button"
        onClick={onEdit}
        aria-label="편집"
        className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <Pencil className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => scheduleDelete([todo.id])}
        aria-label="삭제"
        className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </li>
  )
}
