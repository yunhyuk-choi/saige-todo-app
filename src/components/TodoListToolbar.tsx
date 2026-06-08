import {
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import SearchBar from './SearchBar'

/** {@link TodoListToolbar}의 props. */
interface TodoListToolbarProps {
  /** 현재 검색 키워드. */
  search: string
  /** 검색 입력이 바뀔 때마다 새 키워드와 함께 호출됩니다. */
  onSearchChange: (value: string) => void
  /** 현재 필터에 매칭되는 항목 수("총 N건"으로 표시). */
  totalCount: number
  /** 현재 선택된 행 수. `> 0`이면 선택 바가 표시됩니다. */
  selectedCount: number
  /** 일괄 삭제 동작을 실행할 때 호출됩니다. */
  onDeleteSelected: () => void
}

/**
 * 목록 상단 영역. 행이 선택되면 일괄 삭제 동작을 노출하는 강조된 선택 바로
 * 전환되고, 그렇지 않으면 검색 입력과 현재 결과 개수를 보여줍니다.
 *
 * @example
 * ```tsx
 * <TodoListToolbar
 *   search={search}
 *   onSearchChange={setSearch}
 *   totalCount={filtered.length}
 *   selectedCount={selectedIds.size}
 *   onDeleteSelected={() => setConfirmOpen(true)}
 * />
 * ```
 */
export default function TodoListToolbar({
  search,
  onSearchChange,
  totalCount,
  selectedCount,
  onDeleteSelected,
}: TodoListToolbarProps) {
  if (selectedCount > 0) {
    return (
      <Toolbar
        sx={{
          px: { xs: 2, sm: 2.5 },
          bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
          borderBottom: '1px solid',
          borderColor: 'divider',
          gap: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{ flex: 1 }}
        >
          {selectedCount}개 선택됨
        </Typography>
        <Button
          color="error"
          variant="contained"
          disableElevation
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={onDeleteSelected}
        >
          삭제
        </Button>
      </Toolbar>
    )
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: 1.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <SearchBar value={search} onChange={onSearchChange} />
      <Box>
        <Typography variant="body2" color="text.secondary">
          총 {totalCount}건
        </Typography>
      </Box>
    </Stack>
  )
}
