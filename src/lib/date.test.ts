import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  daysLeft,
  deadlineLabel,
  fromDateInputValue,
  isNearDeadline,
  isOverdue,
  startOfToday,
  toDateInputValue,
} from './date'

// "오늘"을 2026-06-09로 고정
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 5, 9, 13, 0, 0))
})
afterEach(() => vi.useRealTimers())

const at = (y: number, m: number, d: number, h = 0) => new Date(y, m - 1, d, h).getTime()

describe('date utils', () => {
  it('startOfToday는 오늘 자정 timestamp', () => {
    expect(startOfToday()).toBe(at(2026, 6, 9))
  })

  it('daysLeft — 시각 무시하고 날짜 단위로 계산', () => {
    expect(daysLeft(at(2026, 6, 9, 23))).toBe(0)
    expect(daysLeft(at(2026, 6, 12))).toBe(3)
    expect(daysLeft(at(2026, 6, 7))).toBe(-2)
  })

  it('isOverdue — 오늘 이전만 true', () => {
    expect(isOverdue(at(2026, 6, 8))).toBe(true)
    expect(isOverdue(at(2026, 6, 9))).toBe(false)
    expect(isOverdue(at(2026, 6, 10))).toBe(false)
  })

  it('isNearDeadline — 오늘~D-3, 지난 건 제외', () => {
    expect(isNearDeadline(at(2026, 6, 9))).toBe(true) // 오늘
    expect(isNearDeadline(at(2026, 6, 12))).toBe(true) // D-3
    expect(isNearDeadline(at(2026, 6, 13))).toBe(false) // D-4
    expect(isNearDeadline(at(2026, 6, 8))).toBe(false) // 지남
  })

  it('deadlineLabel', () => {
    expect(deadlineLabel(at(2026, 6, 9))).toBe('오늘')
    expect(deadlineLabel(at(2026, 6, 10))).toBe('D-1')
    expect(deadlineLabel(at(2026, 6, 7))).toBe('2일 지남')
  })

  it('date input 변환 라운드트립', () => {
    expect(toDateInputValue(at(2026, 6, 9))).toBe('2026-06-09')
    expect(fromDateInputValue('2026-06-09')).toBe(at(2026, 6, 9))
  })
})
