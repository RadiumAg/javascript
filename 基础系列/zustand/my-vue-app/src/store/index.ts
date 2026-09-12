import { create } from 'zustand'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/vanilla/shallow'

interface Count {
  count: number
  count1: number
  update: (payload: Partial<{ count: number; count1: number }>) => void
}

// createWithEqualityFn传入第二个参数所有都开启
// const useCounterStore = createWithEqualityFn<Count>(
//   (set) => ({
//     count: 0,
//     count1: 0,
//     update: (payload) =>
//       set((state) => ({
//         count: payload.count == null ? state.count : payload.count,
//         count1: payload.count1 == null ? state.count1 : payload.count1,
//       })),
//   }),
//   shallow,
// )

const useCounterStore = create<Count>((set) => ({
  count: 0,
  count1: 0,
  update: (payload) =>
    set((state) => ({
      count: payload.count == null ? state.count : payload.count,
      count1: payload.count1 == null ? state.count1 : payload.count1,
    })),
}))

export { useCounterStore }
