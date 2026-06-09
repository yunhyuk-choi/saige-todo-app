import { Dayjs } from 'dayjs'
import { today } from '../../utils/date'

/** 할 일 입력 폼의 검증 오류. 해당 필드가 유효하면 키가 생략됩니다. */
export interface TodoDraftErrors {
  /** 할 일 내용 오류 메시지. */
  text?: string
  /** 기한 오류 메시지. */
  deadline?: string
}

/**
 * 할 일 생성·수정 폼이 공유하는 검증 규칙.
 * - 할 일은 공백을 제외하고 반드시 입력되어야 합니다.
 * - 기한은 유효해야 하며 과거 날짜일 수 없습니다.
 *
 * 순수 함수이므로 컴포넌트 없이 단위 테스트할 수 있습니다.
 *
 * @param text - 할 일 내용.
 * @param deadline - 선택된 기한. `null`이면 미입력으로 간주합니다.
 * @returns 유효하면 빈 객체, 아니면 해당 필드의 오류 메시지를 담은 객체.
 */
export function validateTodoDraft(
  text: string,
  deadline: Dayjs | null
): TodoDraftErrors {
  const errors: TodoDraftErrors = {}
  if (!text.trim()) {
    errors.text = '할 일을 입력해 주세요.'
  }
  if (!deadline || !deadline.isValid()) {
    errors.deadline = '기한을 선택해 주세요.'
  } else if (deadline.startOf('day').isBefore(today())) {
    errors.deadline = '과거 날짜는 입력할 수 없습니다.'
  }
  return errors
}
