import internals from '../../shared/internals';
import { FiberNode } from './fiber';
import {
  UpdateQueue,
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import type { Action } from 'shared/reactTypes';
import type { Dispatch, Dispatcher } from '../../react/src/currentDispatcher';

interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
}
const { currentDispatcher } = internals;
let workInProgressHook: Hook | null = null;
let currentlyRenderingFiber: FiberNode | null = null;

function renderWithHooks(wip: FiberNode) {
  // 赋值操作
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;

  const current = wip.alternate;

  if (current !== null) {
    // update
  } else {
    // mount
    currentDispatcher.current = HooksDispatcherOrMount;
  }

  const Component = wip.type;
  const props = wip.pedingProps;
  const children = Component(props);

  // 重置操作
  currentlyRenderingFiber = null;
  return children;
}

const HooksDispatcherOrMount: Dispatcher = {
  userState: mountState,
};

function mountState<State>(
  initialState: (() => State) | State,
): [State, Dispatch<State>] {
  // 当前useState对应的hook数据
  const hook = mountWorkInProgressWork();
  let memoizedState;
  if (initialState instanceof Function) {
    memoizedState = initialState();
  } else {
    memoizedState = initialState;
  }

  const queue = createUpdateQueue<State>();
  hook.updateQueue = queue;
  hook.memoizedState = memoizedState;

  // dispatch
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber);
  queue.dispatch = dispatch;
  return [memoizedState, dispatch];
}

function dispatchSetState<State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue<State>,
  action: Action<State>,
) {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber);
}

function mountWorkInProgressWork(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // mount时 第一个hook
    if (currentlyRenderingFiber === null) {
      throw new Error('请在函数组件内调用hook');
    } else {
      workInProgressHook = hook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    // mount 之后的hook
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }

  return workInProgressHook;
}

export { renderWithHooks };
