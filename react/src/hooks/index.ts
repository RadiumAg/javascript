// React Hooks 系统的 TypeScript 实现

import { Fiber, Hook } from '../types/Fiber.js';
import { Lanes, Lane, NoLanes } from '../types/constants.js';
import { Update, UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate, processUpdateQueue } from '../types/UpdateQueue.js';

// Hook 类型定义
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type Reducer<S, A> = (prevState: S, action: A) => S;

interface EffectHook {
  memoizedState: any;
  baseState: any;
  baseQueue: Update<any> | null;
  queue: EffectUpdateQueue | null;
  next: Hook | null;
}

interface EffectUpdateQueue {
  pending: Update<any> | null;
  interleaved: Update<any> | null;
  lanes: Lanes;
  dispatch?: Dispatch<any> | null;
}

interface Effect {
  tag: number;
  create: (() => void) | (() => (() => void));
  destroy: (() => void) | null;
  deps: any[] | null;
  next: Effect | null;
}

// 当前 Hook 状态
let currentlyRenderingFiber: Fiber | null = null;
let currentHook: Hook | null = null;
let workInProgressHook: Hook | null = null;

// 是否正在重新渲染
let isReRender = false;
let didScheduleRenderPhaseUpdate = false;
let renderPhaseUpdates: Map<UpdateQueue<any>, Update<any>> | null = null;
let numberOfReRenders = 0;

const RE_RENDER_LIMIT = 25;

/**
 * useState Hook
 */
export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  return useReducer(
    basicStateReducer as Reducer<S, SetStateAction<S>>,
    initialState as S
  );
}

/**
 * useReducer Hook
 */
export function useReducer<S, A = any>(
  reducer: Reducer<S, A>,
  initialState: S
): [S, Dispatch<A>] {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = hook.baseState = initialState;

  const queue: any = {
    baseState: initialState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      interleaved: null,
      lanes: NoLanes,
    },
    effects: null,
  };

  hook.queue = queue;

  const dispatch: Dispatch<A> = dispatchAction.bind(null, currentlyRenderingFiber!, queue);
  if (queue.shared) {
    queue.shared.dispatch = dispatch;
  }

  return [hook.memoizedState, dispatch];
}

/**
 * useEffect Hook
 */
export function useEffect(
  create: () => void | (() => void),
  deps?: any[]
): void {
  return useEffectImpl(create, deps, 0b100 /* Passive */);
}

/**
 * useLayoutEffect Hook
 */
export function useLayoutEffect(
  create: () => void | (() => void),
  deps?: any[]
): void {
  return useEffectImpl(create, deps, 0b010 /* Layout */);
}

/**
 * useCallback Hook
 */
export function useCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

/**
 * useMemo Hook
 */
export function useMemo<T>(factory: () => T, deps: any[]): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = factory();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

/**
 * useRef Hook
 */
export function useRef<T>(initialValue: T): { current: T } {
  const hook = mountWorkInProgressHook();
  const ref = { current: initialValue };
  hook.memoizedState = ref;
  return ref;
}

/**
 * useContext Hook
 */
export function useContext<T>(context: ReactContext<T>): T {
  if (__DEV__) {
    if (context.$$typeof !== Symbol.for('react.context')) {
      console.error('useContext must be passed a context object.');
    }
  }
  return context._currentValue;
}

// Transition 相关 Hooks
let isTransition = false;
let currentTransition: any = null;

/**
 * useTransition Hook
 */
export function useTransition(): [boolean, (callback: () => void) => void] {
  const [isPending, setPending] = useState(false);

  const start = (callback: () => void) => {
    setPending(true);
    const prevTransition = currentTransition;
    currentTransition = {};
    
    try {
      isTransition = true;
      callback();
    } finally {
      isTransition = false;
      currentTransition = prevTransition;
      setPending(false);
    }
  };

  return [isPending, start];
}

/**
 * startTransition 函数
 */
export function startTransition(callback: () => void): void {
  const prevTransition = currentTransition;
  currentTransition = {};
  
  try {
    isTransition = true;
    callback();
  } finally {
    isTransition = false;
    currentTransition = prevTransition;
  }
}

/**
 * useDeferredValue Hook
 */
export function useDeferredValue<T>(value: T): T {
  const [deferredValue, setDeferredValue] = useState(value);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDeferredValue(value);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [value]);
  
  return isTransition ? deferredValue : value;
}

// 辅助函数

/**
 * 基础状态 reducer
 */
function basicStateReducer<S>(state: S, action: SetStateAction<S>): S {
  return typeof action === 'function' ? (action as (prevState: S) => S)(state) : action;
}

/**
 * 挂载工作进行中的 Hook
 */
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // 这是列表中的第一个 hook
    if (currentlyRenderingFiber !== null) {
      currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    }
  } else {
    // 追加到现有 hook 列表的末尾
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook!;
}

/**
 * 实现 Effect Hook
 */
function useEffectImpl(
  create: () => void | (() => void),
  deps: any[] | undefined,
  fiberFlags: number
): void {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  
  if (currentlyRenderingFiber !== null) {
    currentlyRenderingFiber.flags |= fiberFlags;
  }

  hook.memoizedState = pushEffect(
    0b001 /* HasEffect */ | fiberFlags,
    create,
    undefined,
    nextDeps
  );
}

/**
 * 推送 Effect
 */
function pushEffect(
  tag: number,
  create: () => void | (() => void),
  destroy: (() => void) | undefined,
  deps: any[] | null
): Effect {
  const effect: Effect = {
    tag,
    create,
    destroy: destroy || null,
    deps,
    next: null,
  };

  let componentUpdateQueue = currentlyRenderingFiber?.updateQueue as any;
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    if (currentlyRenderingFiber) {
      currentlyRenderingFiber.updateQueue = componentUpdateQueue;
    }
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

/**
 * 创建函数组件更新队列
 */
function createFunctionComponentUpdateQueue(): any {
  return {
    lastEffect: null,
  };
}

/**
 * 分发 Action
 */
function dispatchAction<A>(fiber: Fiber, queue: UpdateQueue<A>, action: A): void {
  if (__DEV__) {
    if (typeof arguments[3] === 'function') {
      console.error(
        "State updates from the useState() and useReducer() Hooks don't support the " +
        'second callback argument. To execute a side effect after ' +
        'rendering, declare it in the component body with useEffect().'
      );
    }
  }

  const eventTime = performance.now();
  const lane = 1; // 简化的 lane 选择
  const update = createUpdate(eventTime, lane);
  update.payload = action;

  enqueueUpdate(fiber, update, lane);
  // 这里应该调度更新，但为了简化，我们省略了
}

// React Context 接口
interface ReactContext<T> {
  $$typeof: symbol;
  _currentValue: T;
  Consumer: ReactContext<T>;
  Provider: any;
}

const __DEV__ = process.env.NODE_ENV !== 'production';