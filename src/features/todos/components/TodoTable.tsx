import { memo } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'
import TodoRow from './TodoRow'
import SelectAllCheckbox from './SelectAllCheckbox'
import { usePagedTodos } from '../hooks/usePagedTodos'
import { useUpdateTodo } from '../hooks/useTodoMutation'
import { useTodoEditing } from '../hooks/useTodoEditing'

/**
 * 데스크톱 목록 테이블. 표시 데이터는 {@link usePagedTodos}에서, 완료 토글/편집은
 * 직접 소유합니다. **선택 상태는 구독하지 않으며**(전체 선택은
 * {@link SelectAllCheckbox}, 행별 선택은 각 {@link TodoRow}가 자체 구독), 그래서
 * 선택을 토글해도 이 테이블 본문은 리렌더되지 않습니다.
 */
function TodoTable() {
  const { pageItems, isEmpty, emptyMessage } = usePagedTodos()
  const { toggleDone } = useUpdateTodo()
  const editing = useTodoEditing()

  return (
    <TableContainer>
      <Table sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow sx={{ '& th': { borderColor: 'divider' } }}>
            <TableCell padding="checkbox">
              <SelectAllCheckbox />
            </TableCell>
            <TableCell padding="checkbox" align="center">
              완료
            </TableCell>
            <TableCell>할 일</TableCell>
            <TableCell sx={{ width: { sm: 240 } }}>기한</TableCell>
            <TableCell align="right" sx={{ width: 96 }}>
              관리
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ borderBottom: 'none' }}>
                <Box
                  sx={{
                    py: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: 'text.disabled',
                    gap: 1,
                  }}
                >
                  <InboxRoundedIcon sx={{ fontSize: 40 }} />
                  <Typography variant="body2">{emptyMessage}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            pageItems.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                editing={editing.editingId === todo.id}
                onToggleDone={toggleDone}
                onStartEdit={editing.startEdit}
                onStopEdit={editing.stopEdit}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(TodoTable)
