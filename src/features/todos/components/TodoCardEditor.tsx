import { Button, Stack, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { ToDo } from '../../../types/api'
import { useTodoEditForm } from '../hooks/useTodoDraftForm'
import { today } from '../../../utils/date'

/** {@link TodoCardEditor}의 props. */
interface TodoCardEditorProps {
  /** 편집 대상 할 일. 마운트 시 draft 초기값으로 사용됩니다. */
  todo: ToDo
  /** 편집 모드를 종료합니다(취소 및 저장 성공 시 공통). */
  onStopEdit: () => void
}

/**
 * {@link TodoCard}가 편집 중일 때 보여주는 인라인 편집 폼. 편집 중에만
 * 마운트되므로 {@link useTodoEditForm} 상태가 `todo`로부터 seed되고, 편집을
 * 새로 시작할 때마다 자동으로 초기화됩니다. 저장 진행/성공은 mutation이 처리.
 */
export default function TodoCardEditor({
  todo,
  onStopEdit,
}: TodoCardEditorProps) {
  const draft = useTodoEditForm(todo, onStopEdit)

  return (
    <Stack spacing={1}>
      <TextField
        value={draft.text}
        onChange={(e) => draft.onTextChange(e.target.value)}
        error={Boolean(draft.errors.text)}
        helperText={draft.errors.text ?? ' '}
        size="small"
        fullWidth
        autoFocus
        label="할 일"
      />
      <DatePicker
        label="기한"
        value={draft.deadline}
        minDate={today()}
        onChange={draft.onDeadlineChange}
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
            error: Boolean(draft.errors.deadline),
            helperText: draft.errors.deadline ?? ' ',
          },
        }}
      />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button size="small" onClick={onStopEdit}>
          취소
        </Button>
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={() => draft.submit()}
          disabled={draft.submitting}
        >
          저장
        </Button>
      </Stack>
    </Stack>
  )
}
