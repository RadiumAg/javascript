import { scheduleUpdateOnFiber } from '../reconciler/ReactFiberWorkLoop.ts';
import { createUpdate, enqueueUpdate } from '../types/UpdateQueue.ts';
import { requestUpdateLane, getCurrentEventPriority } from '../scheduler/SchedulerPriorities.ts';
import { NoLanes, HookLayout, HookPassive } from '../types/constants.ts';

// 全局Hooks状态
let currentlyRenderingFiber = null;
let currentHook = null;
let workInProgressHook = null;
let didScheduleRenderPhaseUpdate = false;
let didScheduleRenderPhaseUpdateDuringThisPass = false;
let renderPhaseUpdates = null;
let numberOfReRenders = 0;

// 简化的常量
const HookHasEffect = 0b001;
const PassiveHookFlags = 0b100;
const MountPassiveDevHookFlags = 0b1000;
const StrictEffectsMode = 0b10000;
const NoMode = 0;
const NoLane = 0;
const enableNewReconciler = false;
const enableLazyContextPropagation = false;
const enableStrictEffects = false;
const RE_RENDER_LIMIT = 25;

/**
 * 渲染时的Hooks调用
 */
export function renderWithHooks(
  current,
  workInProgress,
  Component,
  props,
  secondArg,
  nextRenderLanes
) {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber = workInProgress;

  if (__DEV__) {
    hookTypesDev = current !== null ? current._debugHookTypes : null;
    hookTypesUpdateIndexDev = -1;
    ignorePreviousDependencies = current !== null && current.type !== workInProgress.type;
  }

  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = NoLanes;

  if (__DEV__) {
    if (current !== null && current.memoizedState !== null) {
      ReactCurrentDispatcher.current = HooksDispatcherOnUpdateInDEV;
    } else if (hookTypesDev !== null) {
      ReactCurrentDispatcher.current = HooksDispatcherOnMountWithHookTypesInDEV;
    } else {
      ReactCurrentDispatcher.current = HooksDispatcherOnMountInDEV;
    }
  } else {
    ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;
  }

  let children = Component(props, secondArg);

  // 检查是否有渲染阶段的更新
  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    let numberOfReRenders = 0;
    do {
      didScheduleRenderPhaseUpdateDuringThisPass = false;
      
      if (numberOfReRenders >= RE_RENDER_LIMIT) {
        throw new Error(
          'Too many re-renders. React limits the number of renders to prevent ' +
            'an infinite loop.'
        );
      }
      numberOfReRenders += 1;

      // 重新开始
      currentHook = null;
      workInProgressHook = null;
      workInProgress.updateQueue = null;

      if (__DEV__) {
        hookTypesUpdateIndexDev = -1;
      }

      ReactCurrentDispatcher.current = __DEV__
        ? HooksDispatcherOnRerenderInDEV
        : HooksDispatcherOnRerender;

      children = Component(props, secondArg);
    } while (didScheduleRenderPhaseUpdateDuringThisPass);
  }

  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  if (__DEV__) {
    workInProgress._debugHookTypes = hookTypesDev;
  }

  const didRenderTooFewHooks =
    currentHook !== null && currentHook.next !== null;

  renderLanes = NoLanes;
  currentlyRenderingFiber = null;
  currentHook = null;
  workInProgressHook = null;

  if (__DEV__) {
    hookTypesDev = null;
    hookTypesUpdateIndexDev = -1;
    ignorePreviousDependencies = false;
  }

  didScheduleRenderPhaseUpdate = false;
  didScheduleRenderPhaseUpdateDuringThisPass = false;

  if (didRenderTooFewHooks) {
    throw new Error(
      'Rendered fewer hooks than expected. This may be caused by an accidental ' +
        'early return statement.'
    );
  }

  if (enableLazyContextPropagation) {
    if (current !== null) {
      if (!checkIfWorkInProgressReceivedUpdate()) {
        const currentDependencies = current.dependencies;
        if (currentDependencies !== null) {
          checkIfContextChanged(currentDependencies);
        }
      }
    }
  }

  return children;
}

/**
 * useState Hook
 */
function useState(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function mountState(initialState) {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  };
  hook.queue = queue;
  const dispatch = queue.dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue,
  );
  return [hook.memoizedState, dispatch];
}

function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}

/**
 * useEffect Hook
 */
function useEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}

function mountEffect(create, deps) {
  if (__DEV__ && enableStrictEffects && (currentlyRenderingFiber.mode & StrictEffectsMode) !== NoMode) {
    return mountEffectImpl(
      MountPassiveDevHookFlags,
      HookPassive,
      create,
      deps,
    );
  } else {
    return mountEffectImpl(PassiveHookFlags, HookPassive, create, deps);
  }
}

function updateEffect(create, deps) {
  return updateEffectImpl(PassiveHookFlags, HookPassive, create, deps);
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps,
  );
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }

  currentlyRenderingFiber.flags |= fiberFlags;

  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps,
  );
}

/**
 * useCallback Hook
 */
function useCallback(callback, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}

function mountCallback(callback, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function updateCallback(callback, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

/**
 * useMemo Hook
 */
function useMemo(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}

function mountMemo(create, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = create();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo(create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  const nextValue = create();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

/**
 * useReducer Hook
 */
function useReducer(reducer, initialArg, init) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}

function mountReducer(reducer, initialArg, init) {
  const hook = mountWorkInProgressHook();
  let initialState;
  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = initialArg;
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState,
  };
  hook.queue = queue;
  const dispatch = queue.dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  );
  return [hook.memoizedState, dispatch];
}

function updateReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  if (queue === null) {
    throw new Error(
      'Should have a queue. This is likely a bug in React. Please file an issue.'
    );
  }

  queue.lastRenderedReducer = reducer;

  const current = currentHook;
  let baseQueue = current.baseQueue;
  const pendingQueue = queue.pending;
  if (pendingQueue !== null) {
    if (baseQueue !== null) {
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  if (baseQueue !== null) {
    const first = baseQueue.next;
    let newState = current.baseState;

    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;

    do {
      const updateLane = update.lane;
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        const clone = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: null,
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        );
        markSkippedUpdateLanes(updateLane);
      } else {
        if (newBaseQueueLast !== null) {
          const clone = {
            lane: NoLane,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null,
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        if (update.hasEagerState) {
          newState = update.eagerState;
        } else {
          const action = update.action;
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    } while (update !== null && update !== first);

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }

    if (!Object.is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;

    queue.lastRenderedState = newState;
  }

  if (baseQueue === null) {
    queue.lanes = NoLanes;
  }

  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}

// Hook调度器
const HooksDispatcherOnMount = {
  readContext,
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useInsertionEffect: mountInsertionEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  useDebugValue: mountDebugValue,
  useDeferredValue: mountDeferredValue,
  useTransition: mountTransition,
  useMutableSource: mountMutableSource,
  useSyncExternalStore: mountSyncExternalStore,
  useId: mountId,
  unstable_isNewReconciler: enableNewReconciler,
};

const HooksDispatcherOnUpdate = {
  readContext,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  useDebugValue: updateDebugValue,
  useDeferredValue: updateDeferredValue,
  useTransition: updateTransition,
  useMutableSource: updateMutableSource,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
  unstable_isNewReconciler: enableNewReconciler,
};

// 辅助函数
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

function updateWorkInProgressHook() {
  let nextCurrentHook;
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }

  let nextWorkInProgressHook;
  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
  } else {
    if (nextCurrentHook === null) {
      throw new Error('Rendered more hooks than during the previous render.');
    }

    currentHook = nextCurrentHook;

    const newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null,
    };

    if (workInProgressHook === null) {
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else {
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  return workInProgressHook;
}

function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}

function dispatchSetState(fiber, queue, action) {
  if (__DEV__) {
    if (typeof arguments[3] === 'function') {
      console.error(
        "State updates from the useState() and useReducer() Hooks don't support the " +
          'second callback argument. To execute a side effect after ' +
          'rendering, declare it in the component body with useEffect().'
      );
    }
  }

  const lane = requestUpdateLane(fiber);
  const update = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: null,
  };

  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    const alternate = fiber.alternate;
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        if (__DEV__) {
          prevDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
        }
        try {
          const currentState = queue.lastRenderedState;
          const eagerState = lastRenderedReducer(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;
          if (Object.is(eagerState, currentState)) {
            enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update, lane);
            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        } finally {
          if (__DEV__) {
            ReactCurrentDispatcher.current = prevDispatcher;
          }
        }
      }
    }

    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
    if (root !== null) {
      const eventTime = requestEventTime();
      scheduleUpdateOnFiber(root, fiber, lane, eventTime);
      entangleTransitionUpdate(root, queue, lane);
    }
  }

  markUpdateInDevTools(fiber, lane, action);
}

// 导出Hooks
export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
};

// 简化的辅助函数
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  if (dispatcher === null) {
    throw new Error(
      'Invalid hook call. Hooks can only be called inside of the body of a function component.'
    );
  }
  return dispatcher;
}

function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) return false;
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}

function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create,
    destroy,
    deps,
    next: null,
  };
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue;
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = componentUpdateQueue;
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null,
    events: null,
    stores: null,
  };
}

// 全局变量和常量
const ReactCurrentDispatcher = { current: null };
let renderLanes = NoLanes;
const __DEV__ = process.env.NODE_ENV !== 'production';

// 简化的其他Hook实现
function mountRef(initialValue) { return { current: initialValue }; }
function updateRef(initialValue) { return currentHook.memoizedState; }
function mountLayoutEffect() {}
function updateLayoutEffect() {}
function mountInsertionEffect() {}
function updateInsertionEffect() {}
function mountImperativeHandle() {}
function updateImperativeHandle() {}
function mountDebugValue() {}
function updateDebugValue() {}
function mountDeferredValue() {}
function updateDeferredValue() {}
function mountTransition() {}
function updateTransition() {}
function mountMutableSource() {}
function updateMutableSource() {}
function mountSyncExternalStore() {}
function updateSyncExternalStore() {}
function mountId() {}
function updateId() {}
function readContext() {}

// 简化的调度函数
function isRenderPhaseUpdate() { return false; }
function enqueueRenderPhaseUpdate() {}
function enqueueConcurrentHookUpdate() { return null; }
function enqueueConcurrentHookUpdateAndEagerlyBailout() {}
function requestEventTime() { return performance.now(); }
function entangleTransitionUpdate() {}
function markUpdateInDevTools() {}
function markWorkInProgressReceivedUpdate() {}
function checkIfWorkInProgressReceivedUpdate() { return false; }
function checkIfContextChanged() {}


// 简化的调度器
const ContextOnlyDispatcher = {};
const HooksDispatcherOnRerender = HooksDispatcherOnUpdate;

// 开发环境调度器
let HooksDispatcherOnMountInDEV = HooksDispatcherOnMount;
let HooksDispatcherOnMountWithHookTypesInDEV = HooksDispatcherOnMount;
let HooksDispatcherOnUpdateInDEV = HooksDispatcherOnUpdate;
let HooksDispatcherOnRerenderInDEV = HooksDispatcherOnUpdate;
let InvalidNestedHooksDispatcherOnUpdateInDEV = {};

// 开发环境变量
let hookTypesDev = null;
let hookTypesUpdateIndexDev = -1;
let ignorePreviousDependencies = false;

// Lane相关函数
function isSubsetOfLanes(set, subset) { return (set & subset) === subset; }
function mergeLanes(a, b) { return a | b; }
function markSkippedUpdateLanes() {}

function dispatchReducerAction(fiber, queue, action) {
  return dispatchSetState(fiber, queue, action);
}