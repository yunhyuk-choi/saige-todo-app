import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  type: 'info' | 'error'
  actionLabel?: string
  onAction?: () => void
}

interface ToastState {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => number
  dismiss: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// 스토어 밖(queryClient 등)에서 호출. 4초 후 자동 닫힘.
export function showErrorToast(message: string): void {
  const { push, dismiss } = useToastStore.getState()
  const id = push({ message, type: 'error' })
  setTimeout(() => dismiss(id), 4000)
}
