import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { usePinStore } from '../stores/pinStore'
import { usePrefsStore } from '../stores/prefsStore'
import { useSelectionStore } from '../stores/selectionStore'
import { server } from './server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
  // zustand 스토어는 모듈 싱글턴이라 테스트 간 상태가 남는다 — 초기화
  usePrefsStore.setState({ keyword: '', statusFilter: 'all', pageSize: 10 })
  useSelectionStore.setState({ selectedIds: new Set() })
  usePinStore.setState({ pinnedIds: [] })
})

afterAll(() => server.close())
