import { 
  NoLanes, 
  NoLane, 
  Lanes, 
  Lane, 
  UpdateTag, 
  UpdateState, 
  ReplaceState, 
  ForceUpdate, 
  CaptureUpdate,
  Callback,
  DidCapture,
  StrictLegacyMode,
  HostRoot 
} from './constants.ts';
import { Fiber } from './Fiber.ts';

/**
 * 更新对象接口
 */
export interface Update<State = any> {
  eventTime: number;
  lane: Lane;
  tag: UpdateTag;
  payload: any;
  callback: (() => any) | null;
  next: Update<State> | null;
}

/**
 * 更新队列接口
 */
export interface UpdateQueue<State = any> {
  baseState: State;
  firstBaseUpdate: Update<State> | null;
  lastBaseUpdate: Update<State> | null;
  shared: {
    pending: Update<State> | null;
    interleaved: Update<State> | null;
    lanes: Lanes;
  };
  effects: Update<State>[] | null;
}

/**
 * 创建更新队列
 */
export function createUpdateQueue<State>(baseState: State): UpdateQueue<State> {
  const queue: UpdateQueue<State> = {
    baseState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      interleaved: null,
      lanes: NoLanes,
    },
    effects: null,
  };
  return queue;
}

/**
 * 创建更新对象
 */
export function createUpdate<State>(eventTime: number, lane: Lane): Update<State> {
  const update: Update<State> = {
    eventTime,
    lane,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
  };
  return update;
}

/**
 * 将更新加入队列
 */
export function enqueueUpdate<State>(
  fiber: Fiber, 
  update: Update<State>, 
  lane: Lane
): FiberRoot | null {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) {
    // 只有在卸载时才会发生
    return null;
  }

  const sharedQueue = updateQueue.shared;

  if (isInterleavedUpdate(fiber, lane)) {
    const interleaved = sharedQueue.interleaved;
    if (interleaved === null) {
      update.next = update;
      pushInterleavedQueue(sharedQueue);
    } else {
      update.next = interleaved.next;
      interleaved.next = update;
    }
    sharedQueue.interleaved = update;
  } else {
    const pending = sharedQueue.pending;
    if (pending === null) {
      update.next = update;
    } else {
      update.next = pending.next;
      pending.next = update;
    }
    sharedQueue.pending = update;
  }

  if (__DEV__) {
    if (
      currentlyProcessingQueue === sharedQueue &&
      !didWarnUpdateInsideUpdate
    ) {
      console.error(
        'An update (setState, replaceState, or forceUpdate) was scheduled ' +
          'from inside an update function. Update functions should be pure, ' +
          'with zero side-effects. Consider using componentDidUpdate or a ' +
          'callback.'
      );
      didWarnUpdateInsideUpdate = true;
    }
  }

  return getRootForUpdatedFiber(fiber);
}

/**
 * 处理更新队列
 */
export function processUpdateQueue<State>(
  workInProgress: Fiber,
  props: any,
  instance: any,
  renderLanes: Lanes
): void {
  const queue = workInProgress.updateQueue as UpdateQueue<State>;

  hasForceUpdate = false;

  if (__DEV__) {
    currentlyProcessingQueue = queue.shared;
  }

  let firstBaseUpdate = queue.firstBaseUpdate;
  let lastBaseUpdate = queue.lastBaseUpdate;

  // 检查是否有待处理的更新
  let pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;

    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next!;
    lastPendingUpdate.next = null;

    // 将待处理更新添加到基础队列
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    lastBaseUpdate = lastPendingUpdate;

    // 如果有current，也要更新它的队列
    const current = workInProgress.alternate;
    if (current !== null) {
      const currentQueue = current.updateQueue as UpdateQueue<State>;
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate;
      if (currentLastBaseUpdate !== lastBaseUpdate) {
        if (currentLastBaseUpdate === null) {
          currentQueue.firstBaseUpdate = firstPendingUpdate;
        } else {
          currentLastBaseUpdate.next = firstPendingUpdate;
        }
        currentQueue.lastBaseUpdate = lastPendingUpdate;
      }
    }
  }

  // 处理更新
  if (firstBaseUpdate !== null) {
    let newState = queue.baseState;
    let newLanes: Lanes = NoLanes;
    let newBaseState: State | null = null;
    let newFirstBaseUpdate: Update<State> | null = null;
    let newLastBaseUpdate: Update<State> | null = null;

    let update: Update<State> | null = firstBaseUpdate;
    do {
      const updateLane = update.lane;
      const updateEventTime = update.eventTime;

      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // 优先级不足，跳过此更新
        const clone: Update<State> = {
          eventTime: updateEventTime,
          lane: updateLane,
          tag: update.tag,
          payload: update.payload,
          callback: update.callback,
          next: null,
        };
        if (newLastBaseUpdate === null) {
          newFirstBaseUpdate = clone;
          newLastBaseUpdate = clone;
          newBaseState = newState;
        } else {
          newLastBaseUpdate.next = clone;
          newLastBaseUpdate = clone;
        }
        newLanes = mergeLanes(newLanes, updateLane);
      } else {
        // 处理更新
        if (newLastBaseUpdate !== null) {
          const clone: Update<State> = {
            eventTime: updateEventTime,
            lane: NoLane,
            tag: update.tag,
            payload: update.payload,
            callback: update.callback,
            next: null,
          };
          newLastBaseUpdate.next = clone;
          newLastBaseUpdate = clone;
        }

        // 处理更新
        newState = getStateFromUpdate(
          workInProgress,
          queue,
          update,
          newState,
          props,
          instance
        );

        const callback = update.callback;
        if (
          callback !== null &&
          update.lane !== NoLane
        ) {
          workInProgress.flags |= Callback;
          const effects = queue.effects;
          if (effects === null) {
            queue.effects = [update];
          } else {
            effects.push(update);
          }
        }
      }
      update = update.next;
      if (update === null) {
        pendingQueue = queue.shared.pending;
        if (pendingQueue === null) {
          break;
        } else {
          const lastPendingUpdate = pendingQueue;
          const firstPendingUpdate = lastPendingUpdate.next!;
          lastPendingUpdate.next = null;
          update = firstPendingUpdate;
          queue.lastBaseUpdate = lastPendingUpdate;
          queue.shared.pending = null;
        }
      }
    } while (true);

    if (newLastBaseUpdate === null) {
      newBaseState = newState;
    }

    queue.baseState = newBaseState!;
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate;

    if (firstBaseUpdate === null) {
      queue.shared.lanes = NoLanes;
    }

    markSkippedUpdateLanes(newLanes);
    workInProgress.lanes = newLanes;
    workInProgress.memoizedState = newState;
  }

  if (__DEV__) {
    currentlyProcessingQueue = null;
  }
}

/**
 * 从更新计算新状态
 */
function getStateFromUpdate<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>,
  update: Update<State>,
  prevState: State,
  nextProps: any,
  instance: any
): State {
  switch (update.tag) {
    case ReplaceState: {
      const payload = update.payload;
      if (typeof payload === 'function') {
        if (__DEV__) {
          enterDisallowedContextReadInDEV();
        }
        const nextState = payload.call(instance, prevState, nextProps);
        if (__DEV__) {
          if (workInProgress.mode & StrictLegacyMode) {
            setIsStrictModeForDevtools(true);
            try {
              payload.call(instance, prevState, nextProps);
            } finally {
              setIsStrictModeForDevtools(false);
            }
          }
          exitDisallowedContextReadInDEV();
        }
        return nextState;
      }
      return payload;
    }
    case CaptureUpdate: {
      workInProgress.flags =
        (workInProgress.flags & ~0b00000000000000010000000000) | DidCapture;
    }
    // fall through
    case UpdateState: {
      const payload = update.payload;
      let partialState: Partial<State> | State;
      if (typeof payload === 'function') {
        if (__DEV__) {
          enterDisallowedContextReadInDEV();
        }
        partialState = payload.call(instance, prevState, nextProps);
        if (__DEV__) {
          if (workInProgress.mode & StrictLegacyMode) {
            setIsStrictModeForDevtools(true);
            try {
              payload.call(instance, prevState, nextProps);
            } finally {
              setIsStrictModeForDevtools(false);
            }
          }
          exitDisallowedContextReadInDEV();
        }
      } else {
        partialState = payload;
      }
      if (partialState === null || partialState === undefined) {
        return prevState;
      }
      return Object.assign({}, prevState, partialState);
    }
    case ForceUpdate: {
      hasForceUpdate = true;
      return prevState;
    }
  }
  return prevState;
}

// 辅助类型定义
interface FiberRoot {
  current: Fiber;
  containerInfo: any;
  pendingLanes: Lanes;
  suspendedLanes: Lanes;
  pingedLanes: Lanes;
  expiredLanes: Lanes;
  mutableReadLanes: Lanes;
  finishedLanes: Lanes;
  entangledLanes: Lanes;
  entanglements: number[];
}

// 辅助函数和变量
let hasForceUpdate = false;
let didWarnUpdateInsideUpdate = false;
let currentlyProcessingQueue: UpdateQueue['shared'] | null = null;

// 简化的辅助函数
function isInterleavedUpdate(fiber: Fiber, lane: Lane): boolean {
  return false; // 简化实现
}

function pushInterleavedQueue(queue: UpdateQueue['shared']): void {
  // 简化实现
}

function getRootForUpdatedFiber(fiber: Fiber): FiberRoot | null {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  return node.tag === HostRoot ? (node.stateNode as FiberRoot) : null;
}

function isSubsetOfLanes(set: Lanes, subset: Lanes): boolean {
  return (set & subset) === subset;
}

function mergeLanes(a: Lanes, b: Lanes): Lanes {
  return a | b;
}

function markSkippedUpdateLanes(lanes: Lanes): void {
  // 简化实现
}

function enterDisallowedContextReadInDEV(): void {}
function exitDisallowedContextReadInDEV(): void {}
function setIsStrictModeForDevtools(enabled: boolean): void {}

const __DEV__ = process.env.NODE_ENV !== 'production';