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
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };

  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      result.memoizedState = action(baseState);
    } else {
      result.memoizedState = action;
    }
  }

  return result;
};

export type { Update, UpdateQueue };
export { createUpdate, createUpdateQueue, enqueueUpdate, processUpdateQueue };
