import { useCallback, useState } from 'react'

/** {@link useTodoEditing}이 반환하는 값. */
interface TodoEditingResult {
  /** 편집 중인 항목의 id. 없으면 `null`. */
  editingId: number | null
  /** 주어진 id의 편집 모드로 진입합니다. */
  startEdit: (id: number) => void
  /** 편집 모드를 종료합니다(취소 및 저장 성공 시 공통). */
  stopEdit: () => void
}

/**
 * "한 번에 한 항목만 편집"을 보장하는 편집 모드 상태 훅. 저장 자체는 편집 폼
 * 컴포넌트가 mutation으로 처리하므로, 이 훅은 **어느 행이 열려 있는지**만
 * 관리하고 종료 시점에 `stopEdit`을 호출받습니다.
 */
export function useTodoEditing(): TodoEditingResult {
  const [editingId, setEditingId] = useState<number | null>(null)

  const startEdit = useCallback((id: number) => setEditingId(id), [])
  const stopEdit = useCallback(() => setEditingId(null), [])

  return { editingId, startEdit, stopEdit }
}
