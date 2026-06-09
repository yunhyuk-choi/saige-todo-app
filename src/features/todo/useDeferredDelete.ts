import { useQueryClient } from '@tanstack/react-query'
import { deleteTodo } from '../../api/todos'
import { todosKey } from '../../hooks/useTodos'
import { getErrorMessage } from '../../lib/error'
import { useSelectionStore } from '../../stores/selectionStore'
import { useToastStore } from '../../stores/toastStore'
import type { ToDo } from '../../types/api'

const UNDO_MS = 5000

// 삭제 = "지연 삭제": 캐시에서 낙관적 제거 + 5초 내 Undo 가능, 만료 시 실제 DELETE.
// 타이머는 이벤트 핸들러(scheduleDelete)에서 생성한다 (상태 감시 effect ❌).
export function useDeferredDelete() {
  const qc = useQueryClient()
  const push = useToastStore((s) => s.push)
  const dismiss = useToastStore((s) => s.dismiss)
  const clearSelection = useSelectionStore((s) => s.clear)

  function scheduleDelete(ids: number[]) {
    if (ids.length === 0) return
    const idSet = new Set(ids)
    const current = qc.getQueryData<ToDo[]>(todosKey) ?? []
    const removed = current.filter((t) => idSet.has(t.id))
    if (removed.length === 0) return

    // 낙관적 제거 + 선택 해제
    qc.setQueryData<ToDo[]>(todosKey, (old) => (old ?? []).filter((t) => !idSet.has(t.id)))
    clearSelection()

    const timer: { id?: ReturnType<typeof setTimeout> } = {}

    const restore = () => {
      qc.setQueryData<ToDo[]>(todosKey, (old) => [...(old ?? []), ...removed])
    }

    const commit = async () => {
      try {
        await Promise.all(removed.map((t) => deleteTodo(t.id)))
      } catch (error) {
        restore() // 실패 시 복원
        useToastStore.getState().push({ message: getErrorMessage(error), type: 'error' })
      } finally {
        void qc.invalidateQueries({ queryKey: todosKey })
      }
    }

    const toastId = push({
      message: `${removed.length}개 항목을 삭제했습니다.`,
      type: 'info',
      actionLabel: '실행취소',
      onAction: () => {
        if (timer.id) clearTimeout(timer.id)
        restore()
        dismiss(toastId)
      },
    })

    timer.id = setTimeout(() => {
      dismiss(toastId)
      void commit()
    }, UNDO_MS)
  }

  return { scheduleDelete }
}
