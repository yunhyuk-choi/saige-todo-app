import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

/** {@link DeleteConfirmDialog}의 props. */
interface DeleteConfirmDialogProps {
  /** 다이얼로그 표시 여부. */
  open: boolean
  /** 삭제 대상 개수(안내 문구에 표시). */
  count: number
  /** 취소하거나 바깥을 클릭해 닫을 때 호출됩니다. */
  onClose: () => void
  /** 삭제를 확정할 때 호출됩니다. */
  onConfirm: () => void
}

/**
 * 선택한 할 일들의 일괄 삭제를 확인받는 다이얼로그.
 */
export default function DeleteConfirmDialog({
  open,
  count,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>선택한 항목 삭제</DialogTitle>
      <DialogContent>
        <DialogContentText>
          선택한 {count}개의 할 일을 삭제하시겠습니까? 이 작업은 되돌릴 수
          없습니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>취소</Button>
        <Button
          color="error"
          variant="contained"
          disableElevation
          onClick={onConfirm}
        >
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  )
}
