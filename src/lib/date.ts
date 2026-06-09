export const DAY_MS = 24 * 60 * 60 * 1000
export const NEAR_DEADLINE_DAYS = 3

// 로컬 자정 기준 timestamp
export function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function startOfToday(): number {
  return startOfDay(Date.now())
}

// 오늘 기준 남은 일수 (음수면 기한 지남)
export function daysLeft(deadline: number): number {
  return Math.round((startOfDay(deadline) - startOfToday()) / DAY_MS)
}

export function isOverdue(deadline: number): boolean {
  return daysLeft(deadline) < 0
}

// 기한이 N일 이내로 남았는지 (오늘 포함, 지난 건 제외)
export function isNearDeadline(deadline: number, days = NEAR_DEADLINE_DAYS): boolean {
  const left = daysLeft(deadline)
  return left >= 0 && left <= days
}

// 마감 배지 라벨
export function deadlineLabel(deadline: number): string {
  const left = daysLeft(deadline)
  if (left < 0) return `${-left}일 지남`
  if (left === 0) return '오늘'
  return `D-${left}`
}

// <input type="date"> 값 <-> timestamp (로컬 날짜 기준)
export function toDateInputValue(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromDateInputValue(value: string): number {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d).getTime()
}
