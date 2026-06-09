import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PinState {
  pinnedIds: number[]
  togglePin: (id: number) => void
  removePins: (ids: number[]) => void
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
      // 항목이 실제로 삭제되면 고정 정보도 제거한다.
      // (MSW는 전부 삭제 후 id를 1부터 재발급하므로, 정리하지 않으면
      //  과거 고정 id를 재사용한 새 항목이 고정 상태로 잘못 표시된다.)
      removePins: (ids) =>
        set((s) => {
          const remove = new Set(ids)
          const next = s.pinnedIds.filter((p) => !remove.has(p))
          return next.length === s.pinnedIds.length ? s : { pinnedIds: next }
        }),
    }),
    { name: 'todo:pins' },
  ),
)
