import { IconButton, Stack, TableCell, TextField, Tooltip } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { ToDo, ToDoRequest } from '../types/api'
import { today } from '../utils/date'
import { useEditDraft } from '../hooks/useEditDraft'

/** {@link TodoRowEditor}의 props. */
interface TodoRowEditorProps {
  /** 편집 대상 할 일. 마운트 시 draft 초기값으로 사용됩니다. */
  todo: ToDo
  /** 저장하지 않고 편집 모드를 빠져나갑니다. */
  onCancelEdit: () => void
  /** 해당 id의 수정 내용을 저장합니다. 실패 시 reject해야 합니다. */
  onSaveEdit: (id: number, body: ToDoRequest) => Promise<void>
}

/**
 * 행이 편집 모드일 때 보여지는 세 개의 편집 셀(할 일, 기한, 동작 버튼).
 * 편집 중에만 마운트되므로 {@link useEditDraft} 상태가 `todo`로부터 seed되고,
 * 편집을 새로 시작할 때마다 자동으로 초기화됩니다 — effect 기반 동기화가
 * 필요 없습니다. {@link TodoRow}가 `editing`일 때만 렌더링합니다.
 */
export default function TodoRowEditor({
  todo,
  onCancelEdit,
  onSaveEdit,
}: TodoRowEditorProps) {
  const draft = useEditDraft(todo, onSaveEdit)

  return (
    <>
      <TableCell>
        <TextField
          value={draft.text}
          onChange={(e) => draft.onTextChange(e.target.value)}
          error={draft.textError}
          helperText={draft.textError ? '할 일을 입력해 주세요.' : ' '}
          size="small"
          fullWidth
          autoFocus
        />
      </TableCell>
      <TableCell>
        <DatePicker
          value={draft.deadline}
          minDate={today()}
          onChange={draft.onDeadlineChange}
          slotProps={{
            textField: {
              size: 'small',
              error: Boolean(draft.dateError),
              helperText: draft.dateError ?? ' ',
              sx: { width: 190 },
            },
          }}
        />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="저장">
            <span>
              <IconButton
                color="primary"
                onClick={() => void draft.save()}
                disabled={draft.saving}
                aria-label="저장"
              >
                <CheckRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="취소">
            <IconButton onClick={onCancelEdit} aria-label="취소">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </>
  )
}
