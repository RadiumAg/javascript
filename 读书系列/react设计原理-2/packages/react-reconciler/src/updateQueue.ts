import { Dispatch } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';
import { Lane } from './fiberLanes';

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
    pending.next = update;
    update.next = pending.next;
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
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };
  if (pendingUpdate !== null) {
    const first = pendingUpdate.next;
    let pending = pendingUpdate.next as Update<any>;

    do {
      const updateLane = pending?.lane;

      if (updateLane === renderLane) {
        const action = pendingUpdate.action;

        if (action instanceof Function) {
          // baseState 1 update2 => memoizedState 2
          baseState = action(baseState);
        } else {
          // baseState 1 update (x) => memoizedState 2
          baseState = action;
        }
      } else if (__DEV__) {
        console.error('不应该进入updateLane !== renderLane逻辑');
      }
      pending = pending?.next as Update<any>;
    } while (pending !== first);
  }
  result.memoizedState = baseState;

  return result;
};
