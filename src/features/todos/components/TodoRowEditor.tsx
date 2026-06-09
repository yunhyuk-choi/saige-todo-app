import { IconButton, Stack, TableCell, TextField, Tooltip } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useTodoEditForm } from '../hooks/useTodoDraftForm'
import { DatePicker } from '@mui/x-date-pickers'
import { today } from '../../../utils/date'
import { ToDo } from '../../../types/api'

/** {@link TodoRowEditor}의 props. */
interface TodoRowEditorProps {
  /** 편집 대상 할 일. 마운트 시 draft 초기값으로 사용됩니다. */
  todo: ToDo
  /** 편집 모드를 종료합니다(취소 및 저장 성공 시 공통). */
  onStopEdit: () => void
}

/**
 * 행이 편집 모드일 때 보여지는 세 개의 편집 셀(할 일, 기한, 동작 버튼).
 * 편집 중에만 마운트되므로 {@link useTodoEditForm} 상태가 `todo`로부터 seed되고,
 * 편집을 새로 시작할 때마다 자동으로 초기화됩니다. 저장 진행 상태/성공은
 * mutation(`isPending`/`onSuccess`)이 처리합니다.
 */
export default function TodoRowEditor({ todo, onStopEdit }: TodoRowEditorProps) {
  const draft = useTodoEditForm(todo, onStopEdit)

  return (
    <>
      <TableCell>
        <TextField
          value={draft.text}
          onChange={(e) => draft.onTextChange(e.target.value)}
          error={Boolean(draft.errors.text)}
          helperText={draft.errors.text}
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
              error: Boolean(draft.errors.deadline),
              helperText: draft.errors.deadline,
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
                onClick={() => draft.submit()}
                disabled={draft.submitting}
                aria-label="저장"
              >
                <CheckRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="취소">
            <IconButton onClick={onStopEdit} aria-label="취소">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </>
  )
}
