import dayjs, { Dayjs } from 'dayjs'

/** 기한이 "임박"한 것으로 간주하는 기준 일수. */
export const DEADLINE_WARNING_DAYS = 3

/** 오늘 자정(로컬 기준) — 선택 가능한 가장 이른 기한. */
export const today = (): Dayjs => dayjs().startOf('day')

/**
 * 오늘 기준(일 단위) 기한의 긴급도 분류.
 *
 * - `overdue` — 기한이 이미 지남
 * - `soon` — 오늘이거나 {@link DEADLINE_WARNING_DAYS}일 이내
 * - `normal` — 경고 기간보다 더 남음
 */
export type DeadlineStatus = 'overdue' | 'soon' | 'normal'

/**
 * 기한을 오늘 기준(일 단위)으로 분류합니다.
 * - `overdue`: 기한이 이미 지남
 * - `soon`: 오늘이거나 DEADLINE_WARNING_DAYS일 이내
 * - `normal`: 경고 기간보다 더 남음
 */
export function getDeadlineStatus(
  deadline: number,
  now: Dayjs = dayjs()
): DeadlineStatus {
  const today = now.startOf('day')
  const due = dayjs(deadline).startOf('day')
  const diff = due.diff(today, 'day')

  if (diff < 0) return 'overdue'
  if (diff <= DEADLINE_WARNING_DAYS) return 'soon'
  return 'normal'
}

/** 기한까지 남은 일수(정수). 기한이 지났으면 음수. */
export function daysUntil(deadline: number, now: Dayjs = dayjs()): number {
  return dayjs(deadline).startOf('day').diff(now.startOf('day'), 'day')
}

/** "D-2", "D-DAY", "1일 지남"처럼 짧은 상대 표기 라벨. */
export function deadlineLabel(deadline: number, now: Dayjs = dayjs()): string {
  const diff = daysUntil(deadline, now)
  if (diff === 0) return 'D-DAY'
  if (diff > 0) return `D-${diff}`
  return `${Math.abs(diff)}일 지남`
}

/** 기한을 `YYYY-MM-DD` 형식 문자열로 변환합니다. */
export function formatDate(deadline: number): string {
  return dayjs(deadline).format('YYYY-MM-DD')
}
