import { memo } from 'react'
import {
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeadlineCell from './DeadlineCell'
import TodoRowEditor from './TodoRowEditor'
import { ToDo } from '../../../types/api'
import { useTodoListStore } from '../store'
import { getDeadlineStatus } from '../../../utils/date'

/** {@link TodoRow}의 props. (선택 상태는 store에서 직접 구독합니다.) */
interface TodoRowProps {
  /** 이 행이 렌더링하는 할 일. */
  todo: ToDo
  /** 이 행이 현재 인라인 편집 모드인지 여부. */
  editing: boolean
  /** 할 일의 완료 상태를 토글합니다. */
  onToggleDone: (todo: ToDo) => void
  /** 주어진 id의 편집 모드로 진입합니다. */
  onStartEdit: (id: number) => void
  /** 편집 모드를 종료합니다(취소 및 저장 성공 시 공통). */
  onStopEdit: () => void
}

/**
 * 단일 테이블 행(데스크톱). 자신의 **선택 상태만 store에서 구독**하므로, 다른
 * 행을 선택해도 이 행은 리렌더되지 않습니다(`memo`). 편집/완료/저장 핸들러는
 * 부모(테이블)가 안정적 참조로 내려줍니다.
 */
function TodoRow({
  todo,
  editing,
  onToggleDone,
  onStartEdit,
  onStopEdit,
}: TodoRowProps) {
  const selected = useTodoListStore((s) => s.selectedIds.has(todo.id))
  const toggleSelect = useTodoListStore((s) => s.toggleSelect)

  const status = getDeadlineStatus(todo.deadline)
  const highlight = !todo.done && (status === 'soon' || status === 'overdue')

  return (
    <TableRow
      hover
      selected={selected}
      sx={{
        '& td': { borderColor: 'divider' },
        ...(highlight && {
          backgroundColor: (t) =>
            alpha(
              t.palette[status === 'overdue' ? 'error' : 'warning'].main,
              t.palette.mode === 'dark' ? 0.08 : 0.06
            ),
        }),
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onChange={() => toggleSelect(todo.id)}
          inputProps={{ 'aria-label': `${todo.text} 선택` }}
        />
      </TableCell>

      <TableCell padding="checkbox">
        <Checkbox
          color="success"
          checked={todo.done}
          onChange={() => onToggleDone(todo)}
          disabled={editing}
          inputProps={{ 'aria-label': `${todo.text} 완료 처리` }}
        />
      </TableCell>

      {editing ? (
        <TodoRowEditor todo={todo} onStopEdit={onStopEdit} />
      ) : (
        <>
          <TableCell>
            <Typography
              variant="body2"
              sx={{
                textDecoration: todo.done ? 'line-through' : 'none',
                color: todo.done ? 'text.disabled' : 'text.primary',
                wordBreak: 'break-word',
              }}
            >
              {todo.text}
            </Typography>
          </TableCell>
          <TableCell>
            <DeadlineCell deadline={todo.deadline} done={todo.done} />
          </TableCell>
          <TableCell align="right">
            <Tooltip title="수정">
              <IconButton
                onClick={() => onStartEdit(todo.id)}
                aria-label={`${todo.text} 수정`}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </TableCell>
        </>
      )}
    </TableRow>
  )
}

export default memo(TodoRow)
