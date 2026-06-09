import { memo } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeadlineCell from './DeadlineCell'
import TodoCardEditor from './TodoCardEditor'
import { ToDo } from '../../../types/api'
import { useTodoListStore } from '../store'
import { getDeadlineStatus } from '../../../utils/date'

/** {@link TodoCard}의 props. (선택 상태는 store에서 직접 구독합니다.) */
interface TodoCardProps {
  /** 이 카드가 렌더링하는 할 일. */
  todo: ToDo
  /** 이 카드가 현재 편집 모드인지 여부. */
  editing: boolean
  /** 할 일의 완료 상태를 토글합니다. */
  onToggleDone: (todo: ToDo) => void
  /** 주어진 id의 편집 모드로 진입합니다. */
  onStartEdit: (id: number) => void
  /** 편집 모드를 종료합니다(취소 및 저장 성공 시 공통). */
  onStopEdit: () => void
}

/**
 * {@link TodoRow}의 모바일 대응 카드. 자신의 선택 상태만 store에서 구독하고
 * (`memo`), 편집/완료/저장 핸들러는 부모(`TodoCardList`)가 안정적 참조로
 * 내려줍니다.
 */
function TodoCard({
  todo,
  editing,
  onToggleDone,
  onStartEdit,
  onStopEdit,
}: TodoCardProps) {
  const selected = useTodoListStore((s) => s.selectedIds.has(todo.id))
  const toggleSelect = useTodoListStore((s) => s.toggleSelect)

  const status = getDeadlineStatus(todo.deadline)
  const highlight = !todo.done && (status === 'soon' || status === 'overdue')

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        ...(highlight && {
          backgroundColor: (t) =>
            alpha(
              t.palette[status === 'overdue' ? 'error' : 'warning'].main,
              t.palette.mode === 'dark' ? 0.08 : 0.06
            ),
        }),
      }}
    >
      {editing ? (
        <TodoCardEditor todo={todo} onStopEdit={onStopEdit} />
      ) : (
        <Stack direction="row" spacing={0.5} alignItems="flex-start">
          <Checkbox
            checked={selected}
            onChange={() => toggleSelect(todo.id)}
            inputProps={{ 'aria-label': `${todo.text} 선택` }}
            sx={{ mt: -0.5 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                textDecoration: todo.done ? 'line-through' : 'none',
                color: todo.done ? 'text.disabled' : 'text.primary',
                wordBreak: 'break-word',
                mb: 0.75,
              }}
            >
              {todo.text}
            </Typography>
            <DeadlineCell deadline={todo.deadline} done={todo.done} />
            <FormControlLabel
              sx={{ mt: 0.5, ml: -0.75, '& .MuiTypography-root': { fontSize: 13 } }}
              control={
                <Checkbox
                  size="small"
                  color="success"
                  checked={todo.done}
                  onChange={() => onToggleDone(todo)}
                  inputProps={{ 'aria-label': `${todo.text} 완료 처리` }}
                />
              }
              label="완료"
            />
          </Box>
          <IconButton
            size="small"
            onClick={() => onStartEdit(todo.id)}
            aria-label={`${todo.text} 수정`}
          >
            <EditRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Paper>
  )
}

export default memo(TodoCard)
