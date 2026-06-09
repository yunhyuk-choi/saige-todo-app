import { useMemo } from 'react'
import { PaletteMode } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { getTheme } from '../theme'
import { usePersistentState } from './usePersistentState'

/** OS가 다크 모드를 선호하는지 여부(최초 방문 시 기본값 결정에 사용). */
function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

/** {@link useColorMode}가 반환하는 값. */
interface ColorModeResult {
  /** 현재 색 모드. */
  mode: PaletteMode
  /** 현재 모드로 생성된 MUI 테마. */
  theme: Theme
  /** 라이트/다크를 전환합니다. */
  toggleMode: () => void
}

/**
 * 색 모드(라이트/다크)와 그에 맞는 MUI 테마를 소유하는 훅. 최초 방문 시 OS
 * 설정을 따르고, 이후 사용자의 선택을 localStorage에 영속화합니다.
 */
export function useColorMode(): ColorModeResult {
  const [mode, setMode] = usePersistentState<PaletteMode>(
    'todo:colorMode',
    prefersDark() ? 'dark' : 'light'
  )
  const theme = useMemo(() => getTheme(mode), [mode])
  const toggleMode = () =>
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return { mode, theme, toggleMode }
}
