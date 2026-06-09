import { Chip, Stack, Typography } from '@mui/material'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { deadlineLabel, formatDate, getDeadlineStatus } from '../../../utils/date'

/** {@link DeadlineCell}의 props. */
interface DeadlineCellProps {
  /** 기한(Unix timestamp, 밀리초). */
  deadline: number
  /** 완료된 항목은 긴급도 스타일을 약하게 표시합니다. */
  done: boolean
}

/**
 * 기한 날짜와 함께, 기한이 지났는지/임박했는지(3일 이내)를 알리는 색상 칩을
 * 렌더링합니다. 완료된 항목은 긴급도 강조 없이 표시됩니다.
 *
 * @example
 * ```tsx
 * <DeadlineCell deadline={todo.deadline} done={todo.done} />
 * ```
 */
export default function DeadlineCell({ deadline, done }: DeadlineCellProps) {
  const status = getDeadlineStatus(deadline)
  const showChip = !done && status !== 'normal'

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography
        variant="body2"
        color={done ? 'text.disabled' : 'text.primary'}
      >
        {formatDate(deadline)}
      </Typography>
      {showChip && (
        <Chip
          size="small"
          variant={status === 'overdue' ? 'filled' : 'outlined'}
          color={status === 'overdue' ? 'error' : 'warning'}
          icon={
            status === 'overdue' ? (
              <ErrorOutlineRoundedIcon />
            ) : (
              <AccessTimeRoundedIcon />
            )
          }
          label={deadlineLabel(deadline)}
          sx={{ fontWeight: 600, height: 22 }}
        />
      )}
    </Stack>
  )
}
