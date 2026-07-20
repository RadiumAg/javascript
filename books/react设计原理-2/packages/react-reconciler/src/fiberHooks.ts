import internals from '../../shared/internals';
import { Dispatch, Dispatcher } from '../../react/src/currentDispatcher';
import { Action } from '../../shared/ReactTypes';
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
import { HookHasEffect, Passive } from './hookEffectTags';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
let renderLane: Lane = NoLane;

const { currentDispatcher, currentBatchConfig } = internals;

interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
  baseState: any;
  baseQueue: Update<any> | null;
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
  // 重置 effect 链表
  wip.updateQueue = null;
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
  useTransition: mountTransition,
  useRef: mountRef,
  useCallback: mountCallback,
  useMemo: mountMemo,
};

const HooksDispatcherOnUpdate: Dispatcher = {
  useState: updateState,
  useEffect: updateEffect,
  useTransition: updateTransition,
  useRef: updateRef,
  useCallback: updateCallback,
  useMemo: updateMemo,
};

function updateEffect(create: EffectCallback | void, deps: EffectDeps | void) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destory: EffectCallback | void;

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState as Effect;
    destory = prevEffect.destory;

    if (nextDeps !== null) {
      // 浅比较依赖
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 绑定的是上一个destory函数，并将最新的create赋值
        hook.memoizedState = pushEffect(Passive, create, destory, nextDeps);
        return;
      }
    }
    // 浅比较后 不相等，将最新的create赋值
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    currentlyRenderingFiber!.flags |= PassiveEffect;
    hook.memoizedState = pushEffect(
      Passive | HookHasEffect,
      create,
      undefined,
      nextDeps,
    );
  }
}

function areHookInputsEqual(nextDeps: EffectDeps, prevDeps: EffectDeps) {
  if (prevDeps === null || nextDeps === null) {
    return false;
  }

  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(prevDeps[i], nextDeps[i])) {
      continue;
    }
    return false;
  }

  return true;
}

function mountRef<T>(initialValue: T) {
  const hook = mountWorkInProgressHook();
  const ref = { current: initialValue };
  hook.memoizedState = ref;
  return ref;
}

function updateRef() {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}

/**
 * mount 时：直接缓存 [callback, deps]，返回 callback
 */
function mountCallback<T>(callback: T, deps: EffectDeps | void) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

/**
 * update 时：浅比较 deps
 * - deps 相同 → 返回缓存的 callback（引用不变）
 * - deps 不同 → 缓存并返回新的 callback
 */
function updateCallback<T>(callback: T, deps: EffectDeps | void) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (nextDeps !== null) {
    const prevDeps = prevState[1];
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0];
    }
  }

  hook.memoizedState = [callback, nextDeps];
  return callback;
}

/**
 * mount 时：执行 nextCreate() 得到值，缓存 [value, deps]，返回值
 */
function mountMemo<T>(nextCreate: () => T, deps: EffectDeps | void) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

/**
 * update 时：浅比较 deps
 * - deps 相同 → 返回缓存的值（不重新执行 nextCreate）
 * - deps 不同 → 重新执行 nextCreate() 并缓存新值
 */
function updateMemo<T>(nextCreate: () => T, deps: EffectDeps | void) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (nextDeps !== null) {
    const prevDeps = prevState[1];
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0];
    }
  }

  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function mountEffect(create: EffectCallback | void, deps: EffectDeps | void) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  currentlyRenderingFiber!.flags |= PassiveEffect;

  hook.memoizedState = pushEffect(
    Passive | HookHasEffect,
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
  const fiber = currentlyRenderingFiber as FiberNode;
  const updateQueue = fiber.updateQueue as FCUpdateQueue<any>;

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

function mountTransition(): [boolean, (callback: () => void) => void] {
  const [isPending, setPending] = mountState(false);
  const hook = mountWorkInProgressHook();
  const start = startTransition.bind(null, setPending);
  hook.memoizedState = start;

  return [isPending, start];
}

function updateTransition(): [boolean, (callback: () => void) => void] {
  const [isPending] = updateState();
  const hook = updateWorkInProgressHook();
  const start = hook.memoizedState;
  return [isPending as boolean, start];
}

function startTransition(setPending: Dispatch<boolean>, callback: () => void) {
  // 立即触发isPending，先渲染一次
  setPending(true);
  const prevTransition = currentBatchConfig.transition;
  currentBatchConfig.transition = 1;
  callback();
  setPending(false);

  currentBatchConfig.transition = prevTransition;
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
  // 创建queue结构
  const queue = createUpdateQueue<State>();
  hook.updateQueue = queue;
  hook.memoizedState = memoizedState;
  hook.baseState = memoizedState;

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
  const baseState = hook.baseState;

  const pending = queue.shared.pending;
  const current = currentHook as Hook;
  let baseQueue = current.baseQueue;

  //pending update 保存在current中
  if (pending !== null) {
    if (baseQueue !== null) {
      // baseQueue b2 -> b0 -> b1 -> b2
      // pendingQueue p2 -> p2 -> p1 ->p2
      const baseFirst = baseQueue.next;
      // p0
      const pendingFirst = pending.next;
      // b2 -> p0
      baseQueue.next = pendingFirst;
      // p2 -> b0
      pending.next = baseFirst;
    }
    baseQueue = pending;
    // 保存在current中
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
  fiber: FiberNode,
  updateQueue: UpdateQueue<State>,
  action: Action<State>,
) {
  const lane = requestUpdateLanes();
  const update = createUpdate(action, lane);

  // eagerState 优化：在调度之前提前计算新状态
  // 条件：update 阶段（current !== null）且无其他待处理的更新（fiber.lanes === NoLane）
  // 如果新状态与当前状态相同（Object.is），则跳过整个更新流程
  const current = fiber.alternate;
  if (current !== null && fiber.lanes === NoLane) {
    // 遍历 hook 链表，找到与当前 updateQueue 匹配的 hook
    // 因为一个 FC 可能有多个 useState，需要精确找到对应的 hook
    let hook: Hook | null = current.memoizedState;
    while (hook !== null) {
      if (hook.updateQueue === updateQueue) {
        const currentState = hook.memoizedState;
        const eagerState =
          action instanceof Function ? action(currentState) : action;
        if (Object.is(eagerState, currentState)) {
          // 新状态与当前状态相同，无需更新
          return;
        }
        break;
      }
      hook = hook.next;
    }
  }

  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber, lane);
}

/**
 * mount时获取当前的hook，根据链表
 *
 * @return {*}  {Hook}
 */
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null, // useState中保存state信息 | useEffect中保存effect对象信息
    updateQueue: null,
    next: null,
    baseQueue: null,
    baseState: null,
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

/**
 * update时获取当前的hook，根据链表
 *
 * @return {*}  {Hook}
 */
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
    // 这个FC update时 后续的hook
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
    baseQueue: currentHook.baseQueue,
    baseState: currentHook.baseState,
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
