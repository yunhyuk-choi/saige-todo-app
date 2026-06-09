import { Inbox, SearchX } from 'lucide-react'

export function EmptyState({ variant }: { variant: 'empty' | 'noresult' }) {
  const isEmpty = variant === 'empty'
  const Icon = isEmpty ? Inbox : SearchX
  return (
    <div className="mt-3 flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900">
      <Icon className="size-10 text-gray-400" aria-hidden />
      <p>{isEmpty ? '할 일이 없습니다. 위에서 새 할 일을 추가해보세요.' : '검색/필터 결과가 없습니다.'}</p>
    </div>
  )
}
