import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
      {isDark ? '라이트' : '다크'}
    </button>
  )
}
