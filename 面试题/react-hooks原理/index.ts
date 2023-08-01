const render = () => {
  cursor = 0;
};
const memoizedState: any[] = [];
let cursor = 0; // 当前memoizedState下表

function useState(initialValue: unknown) {
  memoizedState[cursor] = memoizedState[cursor] || initialValue;
  const currentCursor = cursor;

  function setState(newState) {
    memoizedState[currentCursor] = newState;
    render();
  }

  return [memoizedState[cursor++], setState];
}

function useEffect(callback: (...args) => any, depArray: []) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];
  const hasChangedDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;

  if (hasNoDeps || hasChangedDeps) {
    callback();
    memoizedState[cursor] = depArray;
  }

  cursor++;
}
