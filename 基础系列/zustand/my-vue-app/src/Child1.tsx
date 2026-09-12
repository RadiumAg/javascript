import { useCounterStore } from './store/index'
import { useShallow } from 'zustand/react/shallow'
const Child1 = () => {
  const { count1, update } = useCounterStore(
    useShallow((state) => {
      return {
        count1: state.count1,
        update: state.update,
      }
    }),
  )

  console.log('render child1')

  return (
    <div
      onClick={() => {
        update({ count1: count1 + 1 })
      }}
    >
      {count1}
    </div>
  )
}

export default Child1
