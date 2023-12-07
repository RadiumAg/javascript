import { Action } from 'shared/reactTypes';

interface Dispatcher {
  useState: <T>(initialState: (() => T) | T) => [T, Dispatch<T>];
  useEffect: (
    callback: () => void | undefined,
    deps: any[] | undefined,
  ) => void;
}

type Dispatch<State> = (action: Action<State>) => void;

const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};

const resolveDispatcher = () => {
  const dispatcher = currentDispatcher.current;

  if (dispatcher === null) {
    throw new Error('hook只能在函数组件中执行');
  }
  return dispatcher;
};

export type { Dispatcher, Dispatch };
export { resolveDispatcher, Fragment };
export default currentDispatcher;
