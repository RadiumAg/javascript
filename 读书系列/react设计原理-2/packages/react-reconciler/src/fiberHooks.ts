import internals from 'shared/internals';
import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import {
  UpdateQueue,
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  processUpdateQueue,
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { Lane, NoLane, requestUpdateLanes } from './fiberLanes';
import { Flags, PassiveEffect } from './fiberFlags';
import { Passive } from './hookEffectTags';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
let renderLane: Lane = NoLane;

const { currentDispatcher } = internals;

interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
}

export interface Effect {
  tag: Flags;
  create: EffectCallback | void;
  destory: EffectCallback | void;
  deps: EffectDeps;
  next: Effect | null;
}

export interface FCUpdateQueue<State> extends UpdateQueue<State> {
  lastEffect: Effect | null;
}

type EffectCallback = () => void;

type EffectDeps = any[] | null;

export function renderWithHooks(wip: FiberNode, lane: Lane) {
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;
  renderLane = lane;
  const current = wip.alternate;

  if (current !== null) {
    currentDispatcher.current = HooksDispatcherOnUpdate;
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
  workInProgressHook = null;
  currentHook = null;
  renderLane = NoLane;
  return children;
}

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
  useEffect: mountEffect,
};

const HooksDispatcherOnUpdate: Dispatcher = {
  useState: updateState,
  useEffect: updateEffect,
};

function updateEffect() {}

function mountEffect(create: EffectCallback | void, deps: EffectDeps | void) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  currentlyRenderingFiber!.flags |= PassiveEffect;

  hook.memoizedState = pushEffect(
    Passive | PassiveEffect,
    create,
    undefined,
    nextDeps,
  );
}

function pushEffect(
  hooksFlags: Flags,
  create: EffectCallback | void,
  destory: EffectCallback | void,
  deps: EffectDeps,
): Effect {
  const effect: Effect = {
    tag: hooksFlags,
    create,
    destory,
    deps,
    next: null,
  };
  const filber = currentlyRenderingFiber as FiberNode;
  const updateQueue = filber.updateQueue as FCUpdateQueue<any>;

  if (updateQueue === null) {
    const updateQueue = createFCUpdateQueue();
    filber.updateQueue = updateQueue;
    effect.next = effect;
    updateQueue.lastEffect = effect;
  } else {
    // 插入effect
    const lastEffect = updateQueue.lastEffect;
    if (lastEffect === null) {
      effect.next = effect;
      updateQueue.lastEffect = effect;
    } else {
      const firstEffect = lastEffect?.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      updateQueue.lastEffect = effect;
    }
  }
  return effect;
}

function createFCUpdateQueue<State>() {
  const updateQueue = createUpdateQueue<State>() as FCUpdateQueue<State>;
  updateQueue.lastEffect = null;
  return updateQueue;
}

function mountState<State>(
  initialState: (() => State) | State,
): [State, Dispatch<State>] {
  // 找到当前useState对应的hook数据
  const hook = mountWorkInProgressHook();
  let memoizedState;

  if (initialState instanceof Function) {
    memoizedState = initialState();
  } else {
    memoizedState = initialState;
  }
  const queue = createUpdateQueue<State>();
  hook.updateQueue = queue;
  hook.memoizedState = memoizedState;

  const dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber as any,
    queue as any,
  );
  queue.dispatch = dispatch;
  return [memoizedState, dispatch];
}

function updateState<State>(): [State, Dispatch<State>] {
  // 找到当前useState对应的hook数据
  const hook = updateWorkInProgressHook();

  // 计算新的state的逻辑
  const queue = hook.updateQueue as UpdateQueue<State>;
  const pending = queue.shared.pending;

  if (pending !== null) {
    const { memoizedState } = processUpdateQueue(
      hook.memoizedState,
      pending as any,
      renderLane,
    );
    hook.memoizedState = memoizedState;
    // 保证只执行一次
    queue.shared.pending = null;
  }

  return [hook.memoizedState, queue.dispatch as Dispatch<State>];
}

function dispatchSetState<State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue<State>,
  action: Action<State>,
) {
  const lane = requestUpdateLanes();
  const update = createUpdate(action, lane);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber, lane);
}

function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    if (currentlyRenderingFiber === null) {
      // mount 第一个hook

      throw new Error('请在函数组件内调用hook');
    } else {
      workInProgressHook = hook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    // mount时 后续的hook
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }

  return workInProgressHook;
}

function updateWorkInProgressHook(): Hook {
  // TODO render阶段发生的更新
  let nextCurrentHook: Hook | null = null;

  if (currentHook === null) {
    // 这是FC update时的第一个hook
    const current = currentlyRenderingFiber?.alternate;

    if (current !== null) {
      nextCurrentHook = current?.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    // 这个FC updage时 后续的hook
    nextCurrentHook = currentHook?.next;
  }

  if (nextCurrentHook === null) {
    // mount/update u1 u2 u3
    throw new Error(
      `组件${currentlyRenderingFiber?.type}本次执行的hook比上次执行的多`,
    );
  }

  currentHook = nextCurrentHook as Hook;

  const newHook: Hook = {
    memoizedState: currentHook.memoizedState,
    updateQueue: currentHook.updateQueue,
    next: null,
  };

  if (workInProgressHook === null) {
    if (currentlyRenderingFiber === null) {
      // mount 第一个hook

      throw new Error('请在函数组件内调用hook');
    } else {
      workInProgressHook = newHook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    // mount时 后续的hook
    workInProgressHook.next = newHook;
    workInProgressHook = newHook;
  }

  return workInProgressHook;
}
