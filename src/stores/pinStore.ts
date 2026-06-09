import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PinState {
  pinnedIds: number[]
  togglePin: (id: number) => void
}

// 상단 고정 — 클라이언트 전용(API 스펙에 pin 필드 없음), localStorage 영속.
// 영속 직렬화를 위해 Set이 아닌 number[]로 저장.
export const usePinStore = create<PinState>()(
  persist(
    (set) => ({
      pinnedIds: [],
      togglePin: (id) =>
        set((s) => ({
          pinnedIds: s.pinnedIds.includes(id)
            ? s.pinnedIds.filter((p) => p !== id)
            : [...s.pinnedIds, id],
        })),
    }),
    { name: 'todo:pins' },
  ),
)
