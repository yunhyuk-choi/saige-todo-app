import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useColorMode } from './hooks/useColorMode'
import { ToastProvider } from './components/ToastProvider'
import QueryProvider from './components/QueryProvider'
import TodoPage from './features/todos/components/TodoPage'

/**
 * 애플리케이션 루트. 색 모드 기반 MUI 테마({@link useColorMode}), 전역 토스트,
 * 데이터 캐시(에러 전역 처리 포함), 날짜 선택기 로컬라이제이션 provider를
 * 구성하고 {@link TodoPage}를 렌더링합니다.
 *
 * @example
 * ```tsx
 * createRoot(document.getElementById('root')!).render(<App />)
 * ```
 */
export default function App() {
  const { mode, theme, toggleMode } = useColorMode()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <QueryProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TodoPage mode={mode} onToggleMode={toggleMode} />
          </LocalizationProvider>
        </QueryProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
