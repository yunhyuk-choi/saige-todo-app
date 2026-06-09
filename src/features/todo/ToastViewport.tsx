import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { focusRing } from '../../lib/ui'
import { useToastStore } from '../../stores/toastStore'

// 토스트는 순수 렌더만. 자동 닫힘/Undo 타이머는 push한 쪽에서 관리(effect ❌).
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  if (toasts.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-6 flex flex-col items-center gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-4 rounded-lg px-4 py-3 text-sm text-white shadow-lg',
            t.type === 'error' ? 'bg-red-600' : 'bg-gray-900',
          )}
        >
          <span>{t.message}</span>
          {t.actionLabel && (
            <button
              type="button"
              className={cn('rounded font-semibold text-indigo-300 hover:text-indigo-200', focusRing)}
              onClick={() => t.onAction?.()}
            >
              {t.actionLabel}
            </button>
          )}
          <button
            type="button"
            aria-label="닫기"
            className={cn('rounded text-gray-400 hover:text-white', focusRing)}
            onClick={() => dismiss(t.id)}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  )
}
