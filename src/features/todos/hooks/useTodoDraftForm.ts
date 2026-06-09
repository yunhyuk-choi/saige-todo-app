import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useCreateTodo, useUpdateTodo } from './useTodoMutation'
import { today } from '../../../utils/date'
import { ToDo } from '../../../types/api'
import { TodoDraftErrors, validateTodoDraft } from '../validation'

/** 검증을 통과한 폼 필드. `submit` 시 호출자에게 전달됩니다. */
export interface TodoDraftValues {
  /** 공백이 제거된 할 일 내용. */
  text: string
  /** 선택된 기한(유효성이 보장된 비-null 값). */
  deadline: Dayjs
}

/** {@link useTodoDraftForm}의 인자. */
interface UseTodoDraftFormArgs {
  /** 할 일 내용 초기값. */
  initialText: string
  /** 기한 초기값. */
  initialDeadline: Dayjs | null
  /** 제출 진행 여부(보통 mutation의 `isPending`을 그대로 전달). */
  submitting: boolean
  /**
   * 검증을 통과했을 때 호출됩니다. 보통 여기서 `mutate(body, { onSuccess })`를
   * 트리거하며, `helpers.resetForm`을 성공 콜백으로 넘겨 폼을 비울 수 있습니다.
   */
  onSubmit: (
    values: TodoDraftValues,
    helpers: { resetForm: () => void }
  ) => void
}

/**
 * 할 일 생성·수정 폼이 공유하는 컨트롤러 훅. 필드 상태와 검증만 소유하고,
 * **로딩/성공/실패는 React Query mutation에 위임**합니다(수동 `submitting`
 * 상태나 try/catch 없음). `submitting`은 `isPending`을 그대로 받고, 성공 후
 * 처리(초기화/닫기)는 `onSubmit`에서 `mutate`의 `onSuccess`로 연결합니다.
 *
 * 필드 상태는 `useState` 초기값으로 seed되므로 수정 폼은 **편집 중에만
 * 마운트**되어야 합니다(편집 진입 시 자연히 초기화).
 */
export function useTodoDraftForm({
  initialText,
  initialDeadline,
  submitting,
  onSubmit,
}: UseTodoDraftFormArgs) {
  const [text, setText] = useState(initialText)
  const [deadline, setDeadline] = useState<Dayjs | null>(initialDeadline)
  const [errors, setErrors] = useState<TodoDraftErrors>({})

  const resetForm = () => {
    setText(initialText)
    setDeadline(initialDeadline)
    setErrors({})
  }

  const submit = () => {
    const nextErrors = validateTodoDraft(text, deadline)
    setErrors(nextErrors)
    if (nextErrors.text || nextErrors.deadline || !deadline) return
    onSubmit({ text: text.trim(), deadline }, { resetForm })
  }

  return {
    text,
    deadline,
    errors,
    submitting,
    submit,
    onTextChange: (value: string) => {
      setText(value)
      if (errors.text) setErrors((prev) => ({ ...prev, text: undefined }))
    },
    onDeadlineChange: (value: Dayjs | null) => {
      setDeadline(value)
      if (errors.deadline) {
        setErrors((prev) => ({ ...prev, deadline: undefined }))
      }
    },
  }
}

/**
 * 생성 폼 전용 컨트롤러. 생성 mutation을 직접 소유하므로 입력 폼은 prop 없이
 * 자기완결적이며, 목록 쿼리를 구독하지 않아 목록 변경에 리렌더되지 않습니다.
 * 성공 시 `onSuccess`로 폼을 비웁니다. 실패는 전역 토스트로 표시됩니다.
 */
export function useTodoCreateForm() {
  const { mutate, isPending } = useCreateTodo()
  return useTodoDraftForm({
    initialText: '',
    initialDeadline: today(),
    submitting: isPending,
    onSubmit: ({ text, deadline }, { resetForm }) =>
      mutate(
        { text, done: false, deadline: deadline.endOf('day').valueOf() },
        { onSuccess: resetForm }
      ),
  })
}

/**
 * 수정 폼 전용 컨트롤러. 기존 할 일에서 값을 seed하고 완료 상태(`done`)를
 * 보존합니다. 저장이 성공하면 `onSaved`(보통 편집 모드 종료)를 호출합니다.
 *
 * @param todo - 편집 대상 할 일.
 * @param onSaved - 저장 성공 시 실행할 콜백(예: 편집 모드 종료).
 */
export function useTodoEditForm(todo: ToDo, onSaved: () => void) {
  const { mutate, isPending } = useUpdateTodo()
  return useTodoDraftForm({
    initialText: todo.text,
    initialDeadline: dayjs(todo.deadline),
    submitting: isPending,
    onSubmit: ({ text, deadline }) =>
      mutate(
        {
          id: todo.id,
          body: {
            text,
            done: todo.done,
            deadline: deadline.endOf('day').valueOf(),
          },
        },
        { onSuccess: onSaved }
      ),
  })
}
