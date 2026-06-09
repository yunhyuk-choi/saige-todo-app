import {
  Box,
  IconButton,
  PaletteMode,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'

/** {@link TodoListHeader}의 props. */
interface TodoListHeaderProps {
  /** 현재 색 모드. 토글 아이콘과 라벨을 결정합니다. */
  mode: PaletteMode
  /** 라이트/다크 모드를 전환합니다. */
  onToggleMode: () => void
}

/**
 * 화면 상단 헤더: 앱 로고와 제목, 라이트/다크 모드 토글 버튼.
 */
export default function TodoListHeader({
  mode,
  onToggleMode,
}: TodoListHeaderProps) {
  const label = mode === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <ChecklistRoundedIcon />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h5">To-Do List</Typography>
        <Typography variant="body2" color="text.secondary">
          할 일을 추가하고 기한을 관리하세요.
        </Typography>
      </Box>
      <Tooltip title={label}>
        <IconButton onClick={onToggleMode} aria-label={label}>
          {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
