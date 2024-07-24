import internals from 'shared/internals';
import { Dispatcher } from 'react/src/currentDispatcher';
import { FiberNode } from './fiber';

let currentlyRenderingFiber: FiberNode | null = null;
const workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;

interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;

  const current = wip.alternate;

  if (current !== null) {
    // update
  } else {
    // mount
    currentDispatcher.current = HooksDispatcherOnMount;
  }

  // 赋值操作
  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);

  // 重置操作
  currentlyRenderingFiber = null;
  return children;
}

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
};

function mountState<State>(
  initialState: (() => State) | State,
): [State, Dispatcher<State>] {
  // 找到当前useState对应的hook数据
  const hook = mountWorkInProgressHook();
}

function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };

  if (
    workInProgressHook === null && // mount 第一个hook
    currentlyRenderingFiber === null
  ) {
    throw new Error('请在函数组件内调用hook');
  }
}
