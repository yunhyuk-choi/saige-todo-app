export function TodoListSkeleton() {
  return (
    <div className="mt-4 space-y-2" aria-busy="true" aria-label="불러오는 중">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
        />
      ))}
    </div>
  )
}
