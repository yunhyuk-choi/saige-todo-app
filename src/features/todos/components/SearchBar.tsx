import { InputAdornment, TextField } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import IconButton from '@mui/material/IconButton'
import { useTodoListStore } from '../store'

/**
 * 검색 입력. 검색어 상태는 {@link useTodoListStore}에서 직접 구독하므로 prop이
 * 없습니다. 입력은 디바운스되지만 **X 버튼으로 지우면 즉시** 전체 목록으로
 * 복귀합니다(`clearKeyword`).
 *
 * @example
 * ```tsx
 * <SearchBar />
 * ```
 */
export default function SearchBar() {
  const value = useTodoListStore((s) => s.keyword)
  const setKeyword = useTodoListStore((s) => s.setKeyword)
  const clearKeyword = useTodoListStore((s) => s.clearKeyword)

  return (
    <TextField
      size="small"
      placeholder="할 일 검색"
      value={value}
      onChange={(e) => setKeyword(e.target.value)}
      sx={{ width: { xs: '100%', sm: 280 } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon fontSize="small" color="action" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              aria-label="검색어 지우기"
              onClick={clearKeyword}
              edge="end"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  )
}
