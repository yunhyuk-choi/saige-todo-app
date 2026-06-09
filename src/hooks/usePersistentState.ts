import { useCallback, useEffect, useState } from 'react'

/**
 * 값을 localStorage에 미러링하여 브라우저를 완전히 다시 열어도 유지되는
 * `useState`. 색 모드 등 새로고침을 넘어 유지해야 하는 단순 상태에 사용합니다.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // 쓰기 실패(시크릿 모드/용량 초과 등)는 무시합니다.
    }
  }, [key, state])

  const setPersistentState = useCallback(
    (value: T | ((prev: T) => T)) => setState(value),
    []
  )

  return [state, setPersistentState]
}
