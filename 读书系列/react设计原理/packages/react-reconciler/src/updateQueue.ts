import { Action } from 'shared/reactTypes';
import { Dispatch } from '../../react/src/currentDispatcher';
import { Lane, NoLane, isSubseOfLanes } from './fiberLanes';

interface Update<State> {
  action: Action<State>;
  next: Update<any> | null;
  lane: Lane;
}

interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
  dispatch: Dispatch<State> | null;
}

const createUpdate = <State>(
  action: Action<State>,
  lane: Lane,
): Update<State> => {
  return { action, next: null, lane };
};

const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null,
    },
    dispatch: null,
  } as UpdateQueue<State>;
};

const enqueueUpdate = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>,
) => {
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;
};

const processUpdateQueue = <State>(
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
    // 第一个update
    const first = pendingUpdate.next;
    let pending = pendingUpdate.next as Update<any>;

    let newBaseState = baseState;
    let newBaseQueueFirst: Update<State> | null = null;
    let newBaseQueueLast: Update<State> | null = null;
    const newState = baseState;

    do {
      // 第一个update
      const updateLane = pending.lane;
      if (!isSubseOfLanes(renderLane, updateLane)) {
        // 优先级不够 被跳过
        const clone = createUpdate(pending.action, pending.lane);
        if (newBaseQueueFirst === null) {
          newBaseQueueFirst = clone;
          newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          (newBaseQueueLast as Update<State>).next = clone;
          newBaseQueueLast = clone;
        }
        //
      } else {
        // 优先级足够
        if (newBaseQueueLast !== null) {
          const clone = createUpdate(pending.action, NoLane);
          newBaseQueueLast.next = clone;
          newBaseQueueLast = clone;
        }

        const action = pending.action;
        if (action instanceof Function) {
          baseState = action(baseState);
        } else {
          baseState = action;
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

export type { Update, UpdateQueue };
export { createUpdate, createUpdateQueue, enqueueUpdate, processUpdateQueue };
