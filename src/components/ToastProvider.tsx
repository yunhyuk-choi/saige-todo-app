import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { Alert, AlertColor, Snackbar } from '@mui/material'
import { ToastApi, ToastContext } from '../hooks/useToast'

interface ToastMessage {
  key: number
  message: string
  severity: AlertColor
}

/**
 * 앱 전역에서 공유하는 단일 토스트(MUI Snackbar) 처리기. 어디서든
 * {@link useToast}로 메시지를 보내면 한 번에 하나씩 순차적으로 표시합니다.
 *
 * 표시/다음 표시 전환은 **이벤트 기반**(showToast · Snackbar의 `onExited`)으로
 * 처리하며, 대기 큐는 리렌더를 유발하지 않도록 ref에 둡니다. 모든 에러 표시를
 * 이 한 곳으로 통일하기 위한 컴포넌트입니다(별도 `useEffect` 없음).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<ToastMessage | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const queueRef = useRef<ToastMessage[]>([])
  const showingRef = useRef(false)
  const keyRef = useRef(0)

  const present = useCallback((toast: ToastMessage) => {
    showingRef.current = true
    setCurrent(toast)
    setOpen(true)
  }, [])

  const showToast = useCallback(
    (message: string, severity: AlertColor = 'error') => {
      keyRef.current += 1
      const toast: ToastMessage = { key: keyRef.current, message, severity }
      if (showingRef.current) {
        // 표시 중이면 큐에 넣고 현재 토스트를 닫음 → onExited에서 다음 표시
        queueRef.current.push(toast)
        setOpen(false)
      } else {
        present(toast)
      }
    },
    [present]
  )

  const api = useMemo<ToastApi>(
    () => ({
      showToast,
      error: (message: string) => showToast(message, 'error'),
      success: (message: string) => showToast(message, 'success'),
    }),
    [showToast]
  )

  const handleClose = (_event: unknown, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  const handleExited = () => {
    showingRef.current = false
    const next = queueRef.current.shift()
    if (next) present(next)
    else setCurrent(undefined)
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Snackbar
        key={current?.key}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={current?.severity ?? 'info'}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{ width: '100%' }}
        >
          {current?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}
