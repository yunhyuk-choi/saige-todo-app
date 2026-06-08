import { InputAdornment, TextField } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import IconButton from '@mui/material/IconButton'

/** {@link SearchBar}의 props. */
interface SearchBarProps {
  /** 현재 검색 키워드(controlled value). */
  value: string
  /** 입력이 바뀔 때마다 새 키워드와 함께, 지울 때는 `''`로 호출됩니다. */
  onChange: (value: string) => void
}

/**
 * 앞쪽에 검색 아이콘, 텍스트가 있으면 나타나는 지우기 버튼을 갖춘 controlled
 * 검색 입력. 순수 표현 컴포넌트이며, 키워드와 그 영속화는 부모가 소유합니다.
 *
 * @example
 * ```tsx
 * <SearchBar value={search} onChange={setSearch} />
 * ```
 */
export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <TextField
      size="small"
      placeholder="할 일 검색"
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
              onClick={() => onChange('')}
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
