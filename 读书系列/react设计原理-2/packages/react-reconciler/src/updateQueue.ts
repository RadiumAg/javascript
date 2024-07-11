import { Action } from 'shared/ReactTypes';

export interface Update<State> {
  action: Action<State>;
}

export interface UpdateQueue<State> {
  shred: {
    pending: Update<State> | null;
  };
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  };
};

export const createUpdateQueue = <Action>() => {
  return {
    shred: {
      pending: null,
    },
  } as UpdateQueue<Action>;
};

export const enqueueUpdate = <Action>(
  updateQueue: UpdateQueue<Action>,
  update: Update<Action>,
) => {
  updateQueue.shred.pending = update;
};

/**
 * 消费update
 * @param baseState
 * @param pendingUpdate
 * @returns
 */
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State>,
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };
  if (pendingUpdate !== null) {
    // baseState 1 update2 => memoizedState 2
    const action = pendingUpdate.action;

    if (action instanceof Function) {
      result.memoizedState = action(baseState);
    } else {
      // baseState 1 update (x) => memoizedState 2
      result.memoizedState = action;
    }
  }

  return result;
};
