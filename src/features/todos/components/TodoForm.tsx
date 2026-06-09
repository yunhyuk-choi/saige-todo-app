import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useTodoCreateForm } from '../hooks/useTodoDraftForm'
import { today } from '../../../utils/date'

/**
 * 화면 상단의 새 할 일 생성 폼. 입력·검증·생성 로직은
 * {@link useTodoCreateForm}이 소유하며 prop 없는 자기완결 블록입니다. 생성
 * mutation만 구독하고 목록 쿼리는 구독하지 않으므로, 아래 목록이 바뀌어도 이
 * 폼은 리렌더되지 않습니다. (생성 실패는 전역 토스트로 표시)
 *
 * 유효성 규칙:
 *  - 할 일은 필수(공백 제거 후 비어 있지 않아야 함)
 *  - 기한은 필수이며 과거 날짜는 입력할 수 없음
 *
 * @example
 * ```tsx
 * <TodoForm />
 * ```
 */
export default function TodoForm() {
  const form = useTodoCreateForm()

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider' }}
    >
      <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
        새 할 일 추가
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      >
        <TextField
          label="할 일"
          placeholder="무엇을 해야 하나요?"
          value={form.text}
          onChange={(e) => form.onTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') form.submit()
          }}
          error={Boolean(form.errors.text)}
          helperText={form.errors.text ?? ' '}
          fullWidth
          size="small"
        />
        <DatePicker
          label="기한"
          value={form.deadline}
          minDate={today()}
          onChange={form.onDeadlineChange}
          slotProps={{
            textField: {
              size: 'small',
              error: Boolean(form.errors.deadline),
              helperText: form.errors.deadline ?? ' ',
              sx: { minWidth: { sm: 190 } },
            },
          }}
        />
        <Box sx={{ pt: { sm: 0.25 } }}>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => form.submit()}
            disabled={form.submitting}
            sx={{ height: 40, whiteSpace: 'nowrap', px: 2.5 }}
            fullWidth
          >
            추가
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}
