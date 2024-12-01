import { Dispatch } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';
import { Lane, NoLane, isSubsetOfLanes } from './fiberLanes';

export interface Update<State> {
  action: Action<State>;
  lane: Lane;
  next: Update<any> | null;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
  dispatch: Dispatch<State> | null;
}

/**
 * 创建更新队列
 * @param action
 * @param lane
 * @returns
 */
export const createUpdate = <State>(
  action: Action<State>,
  lane: Lane,
): Update<State> => {
  return {
    lane,
    action,
    next: null,
  };
};

export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQueue<State>;
};

/**
 * 插入形成环状列表
 * @param updateQueue
 * @param update
 */

export const enqueueUpdate = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>,
) => {
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    // pending 是最后一个update
    // update.next指向第一个update
    // 如果更新队列不为空的话，去除第一个更新 pending.next
    update.next = pending.next;
    // 然后让原来队列的最后一个upcate指向新的update
    // 新的update就变成了最后一个update
    // pending.next指向第一个update
    pending.next = update;
  }
  updateQueue.shared.pending = update;
};

/**
 * 消费update
 * @param baseState
 * @param pendingUpdate
 * @returns
 */
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null,
  renderLane: Lane,
): {
  memoizedState: State;
  baseState: State;
  baseQueue: Update<State> | null;
} => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
    baseState,
    baseQueue: null,
  };
  if (pendingUpdate !== null) {
    const first = pendingUpdate.next;
    let pending = pendingUpdate.next as Update<any>;

    let newBaseState = baseState;
    let newBaseQueueFirst: Update<State> | null = null;
    let newBaseQueueLast: Update<State> | null = null;
    let newState = baseState;

    do {
      const updateLane = pending?.lane;

      if (!isSubsetOfLanes(renderLane, updateLane)) {
        // 优先级不够，被跳过
        const clone = createUpdate(pending.action, pending.lane);
        // 是不是第一个被跳过的
        if (newBaseQueueFirst === null) {
          // first u0 last = u0
          newBaseQueueFirst = clone;
          newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          // first u0 -> u1
          // last u2
          (newBaseQueueLast as Update<State>).next = clone;
          newBaseQueueLast = clone;
        }
        // if (__DEV__) {
        //   console.error('不应该进入updateLane !== renderLane逻辑');
        //   break;
        // }
      } else {
        // 优先级足够
        if (newBaseQueueLast !== null) {
          const clone = createUpdate(pending.action, NoLane);
          newBaseQueueLast.next = clone;
          newBaseQueueLast = clone;
        }

        const action = pendingUpdate.action;

        if (action instanceof Function) {
          // baseState 1 update2 => memoizedState 2
          newState = action(baseState);
        } else {
          // baseState 1 update (x) => memoizedState 2
          newState = action;
        }
      }

      pending = pending?.next as Update<any>;
    } while (pending !== first);

    if (newBaseQueueLast === null) {
      // 本次计算没有update被跳过
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }

    result.memoizedState = newState;
    result.baseState = newBaseState;
    result.baseQueue = newBaseQueueLast;
  }
  return result;
};
