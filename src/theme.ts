import { PaletteMode } from '@mui/material'
import { createTheme, Theme } from '@mui/material/styles'

/**
 * 차분하고 전문적인 테마: 깊은 인디고 primary에 절제된 강조색, 부드러운
 * surface와 살짝 둥근 모서리를 사용합니다. 데이터가 주목받도록 의도적으로
 * 단정하게 유지했습니다. 라이트/다크 색 구성을 지원하며, 다크 팔레트에서는
 * 어두운 surface에서도 대비가 유지되도록 강조색을 한 단계 밝게 올립니다.
 */
export function getTheme(mode: PaletteMode): Theme {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? '#818cf8' : '#4f46e5' },
      secondary: { main: '#0ea5e9' },
      success: { main: isDark ? '#4ade80' : '#16a34a' },
      warning: { main: isDark ? '#fbbf24' : '#d97706' },
      error: { main: isDark ? '#f87171' : '#dc2626' },
      background: isDark
        ? { default: '#11131c', paper: '#1a1d2b' }
        : { default: '#f4f5fb', paper: '#ffffff' },
      text: isDark
        ? { primary: '#e7e9f0', secondary: '#9aa1b5' }
        : { primary: '#1f2433', secondary: '#5b6275' },
      divider: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.12)',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily:
        '"Pretendard", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      subtitle2: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, color: isDark ? '#9aa1b5' : '#5b6275' },
        },
      },
    },
  })
}
