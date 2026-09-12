import { useCounterStore } from './store/index'
const Child = () => {
  const { count, update } = useCounterStore()

  console.log('render child')

  return (
    <div
      onClick={() => {
        update({ count: count + 1 })
      }}
    >
      {count}
    </div>
  )
}

export default Child
