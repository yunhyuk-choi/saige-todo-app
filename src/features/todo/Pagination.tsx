import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { focusRing } from '../../lib/ui'

const btnClass = cn(
  'inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-gray-700 dark:hover:bg-gray-800',
  focusRing,
)

interface PaginationProps {
  safePage: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ safePage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <nav className="mt-4 flex items-center justify-center gap-3" aria-label="페이지네이션">
      <button type="button" className={btnClass} disabled={safePage <= 1} onClick={() => onChange(safePage - 1)}>
        <ChevronLeft className="size-4" aria-hidden />
        이전
      </button>
      <span className="text-sm tabular-nums text-gray-500" aria-current="page">
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
