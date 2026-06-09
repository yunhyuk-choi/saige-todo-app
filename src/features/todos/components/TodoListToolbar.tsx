import { memo, useState } from 'react'
import { Box, Button, Stack, Toolbar, Typography, alpha } from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import SearchBar from './SearchBar'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { useTodoListStore } from '../store'
import { useTodoListView } from '../hooks/useTodoListView'
import { useTodoDeletion } from '../hooks/useTodoDeletion'

/**
 * 목록 상단 영역. 선택된 항목이 있으면 일괄 삭제 선택 바로, 없으면 검색
 * 입력과 결과 개수로 전환됩니다. 선택 개수와 결과 개수를 store/쿼리에서 직접
 * 구독하고, 삭제 확인 다이얼로그를 자체 소유합니다.
 */
function TodoListToolbar() {
  const selectedCount = useTodoListStore((s) => s.selectedIds.size)
  const { todos } = useTodoListView()
  const { deleteSelected } = useTodoDeletion()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleConfirm = () => {
    setConfirmOpen(false)
    deleteSelected()
  }

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
        <Typography variant="subtitle2" color="primary" sx={{ flex: 1 }}>
          {selectedCount}개 선택됨
        </Typography>
        <Button
          color="error"
          variant="contained"
          disableElevation
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={() => setConfirmOpen(true)}
        >
          삭제
        </Button>
        <DeleteConfirmDialog
          open={confirmOpen}
          count={selectedCount}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
        />
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
      <SearchBar />
      <Box>
        <Typography variant="body2" color="text.secondary">
          총 {todos.length}건
        </Typography>
      </Box>
    </Stack>
  )
}

export default memo(TodoListToolbar)
