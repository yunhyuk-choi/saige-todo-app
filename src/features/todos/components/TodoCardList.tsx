import { memo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'
import TodoCard from './TodoCard'
import SelectAllCheckbox from './SelectAllCheckbox'
import { usePagedTodos } from '../hooks/usePagedTodos'
import { useUpdateTodo } from '../hooks/useTodoMutation'
import { useTodoEditing } from '../hooks/useTodoEditing'

/**
 * 모바일(<600px) 목록. {@link TodoTable}과 동일하게 표시 데이터는
 * {@link usePagedTodos}에서, 완료 토글/편집은 직접 소유하며 선택 상태는
 * 구독하지 않습니다. 전체 선택 헤더와 항목별 {@link TodoCard}를 쌓아 보여줍니다.
 */
function TodoCardList() {
  const { pageItems, isEmpty, emptyMessage } = usePagedTodos()
  const { toggleDone } = useUpdateTodo()
  const editing = useTodoEditing()

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      <SelectAllCheckbox label="전체 선택" />
      {isEmpty ? (
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
          <Typography variant="body2" align="center">
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.25}>
          {pageItems.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              editing={editing.editingId === todo.id}
              onToggleDone={toggleDone}
              onStartEdit={editing.startEdit}
              onStopEdit={editing.stopEdit}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default memo(TodoCardList)
