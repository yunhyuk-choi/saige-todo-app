import { Circle, CircleCheck, Pencil, Pin, Trash2 } from 'lucide-react'
import { useToggleDone } from '../../hooks/useTodos'
import { cn } from '../../lib/cn'
import { deadlineLabel, isNearDeadline, isOverdue } from '../../lib/date'
import { focusRing, iconButton } from '../../lib/ui'
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
    <li
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
        pinned && 'bg-indigo-50/60 dark:bg-indigo-950/30',
      )}
    >
      {/* 선택 체크박스 (다중 삭제용) */}
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleSelect(todo.id)}
        aria-label={`${todo.text} 선택`}
        className={cn('size-4 shrink-0 cursor-pointer accent-indigo-600', focusRing)}
      />

      {/* 완료/진행중 상태 토글 — 체크박스가 아닌 상태 칩(클릭 시 전환) */}
      <button
        type="button"
        onClick={() => toggleDone(todo)}
        aria-pressed={todo.done}
        aria-label={todo.done ? `${todo.text} 완료 취소` : `${todo.text} 완료 처리`}
        className={cn(
          'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
          todo.done
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
          focusRing,
        )}
      >
        {todo.done ? (
          <CircleCheck className="size-3.5" aria-hidden />
        ) : (
          <Circle className="size-3.5" aria-hidden />
        )}
        {todo.done ? '완료' : '진행중'}
      </button>

      {/* 내용 + 고정 표시 */}
      <span
        className={cn(
          'flex min-w-0 flex-1 items-center gap-1.5',
          todo.done && 'text-gray-400 line-through dark:text-gray-500',
        )}
      >
        {pinned && <Pin className="size-3.5 shrink-0 fill-indigo-500 text-indigo-500" aria-hidden />}
        <span className="truncate">{todo.text}</span>
      </span>

      {/* 마감 배지 */}
      <span
        title={`마감 ${deadlineLabel(todo.deadline)}`}
        className={cn(
          'shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium',
          overdue
            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
            : near
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        )}
      >
        {deadlineLabel(todo.deadline)}
      </span>

      {/* 액션 */}
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={() => togglePin(todo.id)}
          aria-pressed={pinned}
          aria-label={pinned ? '고정 해제' : '고정'}
          className={cn(iconButton, focusRing, pinned ? 'text-indigo-500' : 'hover:text-indigo-500')}
        >
          <Pin className={cn('size-4', pinned && 'fill-current')} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label="편집"
          className={cn(iconButton, focusRing, 'hover:text-gray-900 dark:hover:text-gray-100')}
        >
          <Pencil className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scheduleDelete([todo.id])}
          aria-label="삭제"
          className={cn(iconButton, focusRing, 'hover:text-red-500')}
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  )
}
