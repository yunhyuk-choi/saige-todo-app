import { TriangleAlert } from 'lucide-react'

export function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mt-3 flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 py-12 text-center dark:border-red-900 dark:bg-red-950">
      <TriangleAlert className="size-8 text-red-500" aria-hidden />
      <p className="text-red-600 dark:text-red-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-red-500 px-4 py-1.5 text-sm text-red-600 dark:text-red-300"
      >
        다시 시도
      </button>
    </div>
  )
}
