import internals from '../../shared/internals';
import { FiberNode } from './fiber';
import {
  UpdateQueue,
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  processUpdateQueue,
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import type { Action } from 'shared/reactTypes';
import type { Dispatch, Dispatcher } from 'react/src/currentDispatcher';

interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
}
const { currentDispatcher } = internals;

let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
let currentlyRenderingFiber: FiberNode | null = null;

const HooksDispatcherOrMount: Dispatcher = {
  useState: mountState,
};

const HookDispatcherOnUpdate: Dispatcher = {
  useState: updateState,
};

function renderWithHooks(wip: FiberNode) {
  // 赋值操作
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;
  wip.updateQueue = null;

  const current = wip.alternate;

  if (current !== null) {
    // update
    currentDispatcher.current = HookDispatcherOnUpdate;
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
  const dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue as any,
  ) as any;
  queue.dispatch = dispatch;
  return [memoizedState, dispatch];
}

function updateState<State>(): [State, Dispatch<State>] {
  // 当前useState对应的hook数据
  const hook = updateWorkInProgressWork();

  const queue = hook.updateQueue as UpdateQueue<State>;
  const pending = queue.shared.pending;

  if (pending !== null) {
    const { memoizedState } = processUpdateQueue(hook.memoizedState, pending);
    hook.memoizedState = memoizedState;
  }

  return [hook.memoizedState, queue.dispatch as Dispatch<State>];
}

function dispatchSetState<State>(
  fiber: FiberNode | null,
  updateQueue: UpdateQueue<State>,
  action: Action<State>,
) {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  scheduleUpdateOnFiber(fiber!);
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

function updateWorkInProgressWork(): Hook {
  let nextCurrentHook: Hook | null;

  if (currentHook === null) {
    // 这是Fc update时的第一个hook
    const current = currentlyRenderingFiber?.alternate;

    if (current !== null) {
      nextCurrentHook = current?.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }

  if (nextCurrentHook === null) {
    // mount/update
    throw new Error(
      `${currentlyRenderingFiber?.type}本次执行时的Hook比上次执行时多`,
    );
  }

  currentHook = nextCurrentHook as Hook;
  const newHook: Hook = {
    memoizedState: currentHook?.memoizedState,
    updateQueue: currentHook?.updateQueue,
    next: null,
  };

  if (workInProgressHook === null) {
    if (currentlyRenderingFiber === null) {
      throw new Error('请在函数组件内调用hook');
    } else {
      workInProgressHook = newHook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    workInProgressHook.next = newHook;
    workInProgressHook = newHook;
  }
  return workInProgressHook;
}

export { renderWithHooks };
