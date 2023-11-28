import { Action } from 'shared/reactTypes';

interface Dispatcher {
  useState: <T>(initialState: (() => T) | T) => [T, Dispatch<T>];
}

type Dispatch<State> = (action: Action<State>) => void;

const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};

window.a = currentDispatcher;

const resolveDispatcher = () => {
  const dispatcher = currentDispatcher.current || window.a.current;

  if (dispatcher === null) {
    throw new Error('hook只能在函数组件中执行');
  }
  return dispatcher;
};
export type { Dispatcher, Dispatch };
export { resolveDispatcher };
export default currentDispatcher;
