import { Action } from 'shared/reactTypes';

interface Update<State> {
  action: Action<State>;
}

interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
}

const createUpdate = <State>(action: Action<State>) => {
  return { action };
};

const createUpdateQueue = <Action>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQueue<Action>;
};

const enqueueUpdate = <Action>(
  updateQueue: UpdateQueue<Action>,
  update: Update<Action>
) => {
  updateQueue.shared.pending = update;
};

const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
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
