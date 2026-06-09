import { Search, Trash2 } from 'lucide-react'
import { cn } from '../../lib/cn'
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
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-40 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-950"
            placeholder="검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="검색"
          />
        </div>
        <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" role="group" aria-label="상태 필터">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-2 text-sm',
                statusFilter === f.value ? 'bg-blue-500 text-white' : 'bg-transparent',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="text-sm text-gray-500">
          표시{' '}
          <select
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-950"
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

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allChecked}
            ref={(el) => {
              if (el) el.indeterminate = someChecked
            }}
            onChange={(e) => setMany(allIds, e.target.checked)}
            aria-label="전체 선택"
          />
          전체선택
        </label>
        <span className="text-gray-500">{selectedCount}개 선택됨</span>
        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={() => scheduleDelete(allIds.filter((id) => selectedIds.has(id)))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500 px-3 py-1.5 text-red-500 disabled:opacity-40"
        >
          <Trash2 className="size-4" aria-hidden />
          선택 삭제
        </button>
      </div>
    </div>
  )
}
