import { Action } from 'shared/reactTypes';
import { Dispatch } from '../../react/src/currentDispatcher';
import { Lane } from './fiberLanes';

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
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };

  if (pendingUpdate !== null) {
    // 第一个update
    const first = pendingUpdate.next;
    let pending = pendingUpdate as Update<any>;

    do {
      // 第一个update
      const updateLane = pending.lane;
      if (updateLane === renderLane) {
        const action = pending.action;
        if (action instanceof Function) {
          baseState = action(baseState);
        } else {
          baseState = action;
        }
      } else if (__DEV__) {
        console.error('不应该进入updateLane !== renderLane的逻辑');
      }
      pending = pending?.next as Update<any>;
    } while (pending !== first);
  }

  result.memoizedState = baseState;
  return result;
};

export type { Update, UpdateQueue };
export { createUpdate, createUpdateQueue, enqueueUpdate, processUpdateQueue };
