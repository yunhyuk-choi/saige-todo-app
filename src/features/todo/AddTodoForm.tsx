import { type FormEvent, useState } from 'react'
import { useCreateTodo } from '../../hooks/useTodos'
import { fromDateInputValue, startOfToday, toDateInputValue } from '../../lib/date'

const inputClass =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900'

export function AddTodoForm() {
  const [text, setText] = useState('')
  const [date, setDate] = useState(() => toDateInputValue(startOfToday()))
  const [error, setError] = useState<string | null>(null)
  const { mutate, isPending } = useCreateTodo()

  const today = toDateInputValue(startOfToday())

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      setError('할 일을 입력하세요')
      return
    }
    if (!date) {
      setError('기한을 선택하세요')
      return
    }
    const deadline = fromDateInputValue(date)
    if (deadline < startOfToday()) {
      setError('과거 날짜는 선택할 수 없습니다')
      return
    }
    setError(null)
    mutate(
      { text: trimmed, done: false, deadline },
      {
        onSuccess: () => {
          setText('')
          setDate(today)
        },
      },
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          className={`${inputClass} min-w-40 flex-1`}
          placeholder="할 일을 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="할 일 내용"
          aria-invalid={Boolean(error)}
        />
        <input
          className={inputClass}
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          aria-label="기한"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          추가
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </form>
  )
}
