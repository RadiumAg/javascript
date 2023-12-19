import currentBatchConfig from 'react/src/currentBatchConfig';
import internals from '../../shared/internals';
import { FiberNode } from './fiber';
import {
  Update,
  UpdateQueue,
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  processUpdateQueue,
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { Lane, NoLane, requestUpdateLanes } from './fiberLanes';
import { Flags, PassiveEffect } from './fiberFlags';
import { HookHasEffect, Passive } from './hookEffectTag';
import type { Action } from 'shared/reactTypes';
import type { Dispatch, Dispatcher } from 'react/src/currentDispatcher';

interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
  baseState: any;
  baseQueue: Update<any> | null;
}

interface Effect {
  tag: Flags;
  create: () => EffectCallback;
  destory: EffectCallback | undefined;
  deps: EffectDeps;
  next: Effect | null;
}

type EffectDeps = any[] | null;
type EffectCallback = () => any;

interface FCUpdateQueue<State> extends UpdateQueue<State> {
  lastEffect: Effect | null;
}

const { currentDispatcher } = internals;

let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
let currentlyRenderingFiber: FiberNode | null = null;
let renderLane: Lane = NoLane;

const HooksDispatcherOrMount: Dispatcher = {
  useState: mountState,
  useEffect: mountEffect,
  useTransition: mountTransition,
};

const HookDispatcherOnUpdate: Dispatcher = {
  useState: updateState,
  useEffect: updateEffect,
  useTransition: updateTransition,
};

function mountTransition(): [boolean, (callback: () => void) => void] {
  const [isPending, setPending] = mountState(false);
  const hook = mountWorkInProgressWork();
  const start = startTransition.bind(null, setPending);
  hook.memoizedState = start;
  return [isPending, start];
}

function startTransition(setPending: Dispatch<boolean>, callback: () => void) {
  setPending(true);
  const prevTransition = currentBatchConfig.transition;
  currentBatchConfig.transition = 1;

  callback();
  setPending(false);

  currentBatchConfig.transition = prevTransition;
}

function updateTransition(): [boolean, (callback: () => void) => void] {
  const [isPending] = updateState();
  const hook = updateWorkInProgressWork();
  const start = hook.memoizedState;
  return [isPending as boolean, start];
}

function mountEffect(create: EffectCallback, deps: EffectDeps | undefined) {
  const hook = mountWorkInProgressWork();
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber!.flags |= PassiveEffect;

  hook.memoizedState = pushEffect(
    Passive | HookHasEffect,
    create,
    undefined,
    nextDeps,
  );
}

function updateEffect(create: EffectCallback, deps: EffectDeps) {
  const hook = updateWorkInProgressWork();
  const nextDeps = deps === undefined ? null : deps;
  let destory: EffectCallback | undefined;

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState as Effect;
    destory = prevEffect.destory;

    if (nextDeps !== null) {
      // 浅比较相等
      const prevDeps = prevEffect.deps;
      if (areHookInPutsEqual(nextDeps, prevDeps)) {
        hook.memoizedState = pushEffect(Passive, create, destory, nextDeps);
        return;
      }
    }
    // 浅比较不相等
    currentlyRenderingFiber!.flags |= PassiveEffect;
    hook.memoizedState = pushEffect(
      Passive | HookHasEffect,
      create,
      destory,
      nextDeps,
    );
  }
}

function areHookInPutsEqual(nextDeps: EffectDeps, prevDeps: EffectDeps) {
  if (prevDeps === null || nextDeps === null) {
    return false;
  }
  for (let i = 0; i < prevDeps?.length && i < nextDeps.length; i++) {
    if (Object.is(prevDeps[i], nextDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
}

function pushEffect(
  hookFlags: Flags,
  create: EffectCallback,
  destory: EffectCallback | undefined,
  deps: EffectDeps,
) {
  const effect: Effect = {
    create,
    destory,
    deps,
    tag: hookFlags,
    next: null,
  };
  const fiber = currentlyRenderingFiber as FiberNode;
  const updateQueue = (fiber.updateQueue =
    fiber.updateQueue as FCUpdateQueue<any>);

  if (updateQueue === null) {
    const updateQueue = createFCUpdateQueue();
    fiber.updateQueue = updateQueue;
    effect.next = effect;
    updateQueue.lastEffect = effect;
  } else {
    // 插入effect
    const lastEffect = updateQueue.lastEffect;
    if (lastEffect === null) {
      effect.next = effect;
      updateQueue.lastEffect = effect;
    } else {
      const firstEffect = lastEffect.next;
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

function renderWithHooks(wip: FiberNode, lane: Lane) {
  // 赋值操作
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;
  wip.updateQueue = null;
  renderLane = lane;

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
  workInProgressHook = null;
  currentHook = null;
  renderLane = NoLane;
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
  hook.baseState = memoizedState;

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
  const baseState = hook.baseState;
  const pending = queue.shared.pending;
  const current = currentHook as Hook;
  let baseQueue = current.baseQueue;

  if (pending !== null) {
    if (baseQueue !== null) {
      const baseFirst = baseQueue.next;
      const pendingFirst = pending.next;

      baseQueue.next = pendingFirst;
      pending.next = baseFirst;
    }

    baseQueue = pending;
    current.baseQueue = pending;
    queue.shared.pending = null;
  }

  if (baseQueue !== null) {
    const {
      memoizedState,
      baseQueue: newBaseQueue,
      baseState: newBaseState,
    } = processUpdateQueue(baseState, baseQueue, renderLane);
    hook.memoizedState = memoizedState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueue;
  }

  return [hook.memoizedState, queue.dispatch as Dispatch<State>];
}

function dispatchSetState<State>(
  fiber: FiberNode | null,
  updateQueue: UpdateQueue<State>,
  action: Action<State>,
) {
  const lane = requestUpdateLanes();
  const update = createUpdate(action, lane);
  enqueueUpdate(updateQueue, update);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  scheduleUpdateOnFiber(fiber!, lane);
}

function mountWorkInProgressWork(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
    baseQueue: null,
    baseState: null,
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
    baseQueue: currentHook.baseQueue,
    baseState: currentHook.baseState,
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
export type { Effect, FCUpdateQueue };
