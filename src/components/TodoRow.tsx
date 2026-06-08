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
import { ToDo, ToDoRequest } from '../types/api'
import { getDeadlineStatus } from '../utils/date'
import DeadlineCell from './DeadlineCell'
import TodoRowEditor from './TodoRowEditor'

/** {@link TodoRow}의 props. */
interface TodoRowProps {
  /** 이 행이 렌더링하는 할 일. */
  todo: ToDo
  /** 이 행의 선택 체크박스가 체크되었는지 여부. */
  selected: boolean
  /** 이 행이 현재 인라인 편집 모드인지 여부. */
  editing: boolean
  /** 이 행의 선택을 토글합니다. 할 일 id를 받습니다. */
  onToggleSelect: (id: number) => void
  /** 할 일의 완료 상태를 토글합니다. */
  onToggleDone: (todo: ToDo) => void
  /** 주어진 id의 편집 모드로 진입합니다. */
  onStartEdit: (id: number) => void
  /** 저장하지 않고 편집 모드를 빠져나갑니다. */
  onCancelEdit: () => void
  /** 주어진 id의 수정 내용을 저장합니다. 실패 시 reject해야 합니다. */
  onSaveEdit: (id: number, body: ToDoRequest) => Promise<void>
}

/**
 * 단일 테이블 행(데스크톱 레이아웃). 선택·완료 체크박스는 항상 표시되며,
 * 나머지 셀은 읽기 뷰(할 일, 기한, 수정 버튼)와 `editing`이 true일 때의
 * {@link TodoRowEditor} 사이를 전환합니다. {@link TodoTable} 안에서 항목별로
 * 렌더링되도록 설계되었습니다.
 *
 * @example
 * ```tsx
 * <TodoRow
 *   todo={todo}
 *   selected={selectedIds.has(todo.id)}
 *   editing={editingId === todo.id}
 *   onToggleSelect={handleToggleSelect}
 *   onToggleDone={toggleDone}
 *   onStartEdit={handleStartEdit}
 *   onCancelEdit={handleCancelEdit}
 *   onSaveEdit={handleSaveEdit}
 * />
 * ```
 */
export default function TodoRow({
  todo,
  selected,
  editing,
  onToggleSelect,
  onToggleDone,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: TodoRowProps) {
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
          onChange={() => onToggleSelect(todo.id)}
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
        <TodoRowEditor
          todo={todo}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
        />
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
