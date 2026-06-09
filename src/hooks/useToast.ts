import { createContext, useContext } from 'react'
import { AlertColor } from '@mui/material'

/** 전역 알림(토스트) API. `ToastProvider`가 제공합니다. */
export interface ToastApi {
  /** 임의 severity의 토스트를 띄웁니다. */
  showToast: (message: string, severity?: AlertColor) => void
  /** 오류 토스트를 띄웁니다. */
  error: (message: string) => void
  /** 성공 토스트를 띄웁니다. */
  success: (message: string) => void
}

/** 토스트 API를 전달하는 컨텍스트. `ToastProvider`가 값을 채웁니다. */
export const ToastContext = createContext<ToastApi | null>(null)

/**
 * 전역 토스트 API에 접근합니다. `ToastProvider` 하위에서만 호출할 수 있습니다.
 */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast는 <ToastProvider> 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
