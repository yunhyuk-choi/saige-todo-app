import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { ToDo, ToDoRequest } from '../types/api'
import { today } from '../utils/date'

/**
 * 단일 할 일 편집 폼의 draft 상태·유효성 검사·저장 로직을 모두 소유하는 훅.
 * 테이블 행과 모바일 카드 편집 폼이 공유합니다.
 *
 * draft는 `useState` 초기값으로 `todo`에서 seed되므로, 이 훅을 호출하는 편집
 * 폼은 **편집 중에만 마운트**되어야 합니다(취소/저장 시 언마운트). 편집 모드에
 * 다시 진입하면 폼이 재마운트되어 draft가 자연스럽게 초기화됩니다 —
 * `useEffect` 동기화가 필요 없습니다.
 *
 * `save`는 유효성 검사를 통과한 경우에만 draft를 {@link ToDoRequest}로 조립하여
 * `onSave`에 위임하고, 그동안 `saving` 플래그를 관리합니다.
 *
 * @param todo - 편집 대상 할 일. 각 필드의 초기값을 제공합니다.
 * @param onSave - 검증을 통과한 수정 내용을 저장하는 함수. 실패 시 reject해야 합니다.
 */
export function useEditDraft(
  todo: ToDo,
  onSave: (id: number, body: ToDoRequest) => Promise<void>
) {
  const [text, setText] = useState(todo.text)
  const [deadline, setDeadline] = useState<Dayjs | null>(dayjs(todo.deadline))
  const [textError, setTextError] = useState(false)
  const [dateError, setDateError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const validate = (): boolean => {
    let valid = true
    if (!text.trim()) {
      setTextError(true)
      valid = false
    }
    if (!deadline || !deadline.isValid()) {
      setDateError('기한을 선택해 주세요.')
      valid = false
    } else if (deadline.startOf('day').isBefore(today())) {
      setDateError('과거 날짜는 입력할 수 없습니다.')
      valid = false
    }
    return valid
  }

  const save = async () => {
    if (!validate() || !deadline) return
    setSaving(true)
    try {
      await onSave(todo.id, {
        text: text.trim(),
        done: todo.done,
        deadline: deadline.endOf('day').valueOf(),
      })
    } catch {
      // 상위에서 처리됨
    } finally {
      setSaving(false)
    }
  }

  return {
    text,
    deadline,
    textError,
    dateError,
    saving,
    save,
    onTextChange: (value: string) => {
      setText(value)
      if (textError) setTextError(false)
    },
    onDeadlineChange: (value: Dayjs | null) => {
      setDeadline(value)
      if (dateError) setDateError(null)
    },
  }
}
