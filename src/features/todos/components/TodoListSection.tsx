import { LinearProgress, Paper, TablePagination, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import TodoListToolbar from './TodoListToolbar'
import TodoTable from './TodoTable'
import TodoCardList from './TodoCardList'
import { usePagedTodos } from '../hooks/usePagedTodos'

const PAGE_SIZE_OPTIONS = [5, 10, 20]

/**
 * 목록 영역의 레이아웃. 진행 표시줄과 페이지네이션에 필요한 값만
 * {@link usePagedTodos}에서 가져오고, 툴바·목록(테이블/카드)은 각자 직접
 * 구독하는 자기완결 블록으로 배치합니다(둘 다 `memo`).
 */
export default function TodoListSection() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { loading, total, page, pageCount, pageSize, setPage, setPageSize } =
    usePagedTodos()

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {loading && (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      )}

      <TodoListToolbar />

      {isMobile ? <TodoCardList /> : <TodoTable />}

      <TablePagination
        component="div"
        count={total}
        page={Math.min(page, pageCount - 1)}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={pageSize}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        onRowsPerPageChange={(e) => setPageSize(Number(e.target.value))}
        labelRowsPerPage={isMobile ? '행' : '페이지당 행'}
        labelDisplayedRows={({ from, to, count }) => `${count}건 중 ${from}–${to}`}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          '& .MuiTablePagination-toolbar': {
            flexWrap: 'wrap',
            px: { xs: 1, sm: 2 },
          },
        }}
      />
    </Paper>
  )
}
