import { useState } from 'react'
import { useUpdateTodo } from '../../hooks/useTodos'
import { cn } from '../../lib/cn'
import { fromDateInputValue, startOfToday, toDateInputValue } from '../../lib/date'
import { focusRing } from '../../lib/ui'
import type { ToDo } from '../../types/api'

const inputClass = cn(
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950',
  focusRing,
)

export function TodoRowEditor({ todo, onClose }: { todo: ToDo; onClose: () => void }) {
  // 편집 진입 시 props로 1회 초기화 (draft를 effect로 동기화하지 않는다)
  const [text, setText] = useState(todo.text)
  const [date, setDate] = useState(() => toDateInputValue(todo.deadline))
  const [error, setError] = useState<string | null>(null)
  const { mutate, isPending } = useUpdateTodo()

  const today = toDateInputValue(startOfToday())

  function handleSave() {
    const trimmed = text.trim()
    if (!trimmed) {
      setError('할 일을 입력하세요')
      return
    }
    const deadline = fromDateInputValue(date)
    if (deadline < startOfToday()) {
      setError('과거 날짜는 선택할 수 없습니다')
      return
    }
    setError(null)
    mutate({ id: todo.id, body: { text: trimmed, done: todo.done, deadline } }, { onSuccess: onClose })
  }

  return (
    <li className="bg-indigo-50/80 px-3 py-2.5 dark:bg-indigo-950/30">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className={cn(inputClass, 'min-w-40 flex-1')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          aria-label="할 일 내용 수정"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `edit-error-${todo.id}` : undefined}
          autoFocus
        />
        <input
          className={inputClass}
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          aria-label="기한 수정"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className={cn(
            'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50',
            focusRing,
          )}
        >
          저장
        </button>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
            focusRing,
          )}
        >
          취소
        </button>
      </div>
      {error && (
        <p id={`edit-error-${todo.id}`} role="alert" className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </li>
  )
}
