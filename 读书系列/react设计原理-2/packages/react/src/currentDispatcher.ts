export interface Dispatcher {
  useState: any;
}

const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};

export const resolveDispatcher = (): Dispatcher => {
  const dispatcher = currentDispatcher.current;

  if (dispatcher === null) {
    throw new Error('hook只能再函数组件中执行');
  }

  return dispatcher;
};

export default currentDispatcher;
