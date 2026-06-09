import { ChevronLeft, ChevronRight } from 'lucide-react'

const btnClass =
  'inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700'

interface PaginationProps {
  safePage: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ safePage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <nav className="mt-4 flex items-center justify-center gap-3" aria-label="페이지네이션">
      <button
        type="button"
        className={btnClass}
        disabled={safePage <= 1}
        onClick={() => onChange(safePage - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden />
        이전
      </button>
      <span className="text-sm text-gray-500">
        {safePage} / {totalPages}
      </span>
      <button
        type="button"
        className={btnClass}
        disabled={safePage >= totalPages}
        onClick={() => onChange(safePage + 1)}
      >
        다음
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  )
}
