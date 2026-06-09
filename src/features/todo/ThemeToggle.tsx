import { Moon, Sun } from 'lucide-react'
import { cn } from '../../lib/cn'
import { focusRing } from '../../lib/ui'
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
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
        focusRing,
      )}
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
      {isDark ? '라이트' : '다크'}
    </button>
  )
}
