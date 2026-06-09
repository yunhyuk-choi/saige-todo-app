import { Search, Trash2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { focusRing } from '../../lib/ui'
import { type PageSize, type StatusFilter, usePrefsStore } from '../../stores/prefsStore'
import { useSelectionStore } from '../../stores/selectionStore'
import { useDeferredDelete } from './useDeferredDelete'

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행중' },
  { value: 'done', label: '완료' },
]
const PAGE_SIZES: PageSize[] = [5, 10, 20]

// allIds: 현재 검색/필터로 걸러진 전체 항목 id (전체선택·선택삭제 대상)
export function TodoToolbar({ allIds }: { allIds: number[] }) {
  const keyword = usePrefsStore((s) => s.keyword)
  const setKeyword = usePrefsStore((s) => s.setKeyword)
  const statusFilter = usePrefsStore((s) => s.statusFilter)
  const setStatusFilter = usePrefsStore((s) => s.setStatusFilter)
  const pageSize = usePrefsStore((s) => s.pageSize)
  const setPageSize = usePrefsStore((s) => s.setPageSize)

  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const setMany = useSelectionStore((s) => s.setMany)
  const { scheduleDelete } = useDeferredDelete()

  const selectedCount = allIds.filter((id) => selectedIds.has(id)).length
  const allChecked = allIds.length > 0 && selectedCount === allIds.length
  const someChecked = selectedCount > 0 && !allChecked

  return (
    <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-40 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            className={cn(
              'w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-950',
              focusRing,
            )}
            placeholder="검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="검색"
          />
        </div>
        <div
          className="inline-flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
          role="group"
          aria-label="상태 필터"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                statusFilter === f.value
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-indigo-300'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200',
                focusRing,
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-500">
          표시
          <select
            className={cn(
              'rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-950',
              focusRing,
            )}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) as PageSize)}
            aria-label="페이지 크기"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={allChecked}
            ref={(el) => {
              if (el) el.indeterminate = someChecked
            }}
            onChange={(e) => setMany(allIds, e.target.checked)}
            aria-label="전체 선택"
            className={cn('size-4 cursor-pointer accent-indigo-600', focusRing)}
          />
          전체선택
        </label>
        <span className="text-gray-500" aria-live="polite">
          {selectedCount}개 선택됨
        </span>
        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={() => scheduleDelete(allIds.filter((id) => selectedIds.has(id)))}
          className={cn(
            'ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950',
            focusRing,
          )}
        >
          <Trash2 className="size-4" aria-hidden />
          선택 삭제
        </button>
      </div>
    </div>
  )
}
