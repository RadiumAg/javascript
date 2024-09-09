import { useSyncExternalStore } from 'react';

const createStore = (createState) => {
  let state;
  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;

    if (!Object.is(nextState, state)) {
      const previousState = state;

      if (!replace) {
        state = nextState;
      }
      listeners.forEach((listener) => listener(nextState, previousState));
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const destory = () => {
    listeners.clear();
  };

  const api = { setState, getState, subscribe, destory };
  state = createState(api);
  return api;
};

function useStore(api, selector) {
  function getState() {
    return selector(api.getState());
  }

  return useSyncExternalStore(api.subscribe, getState);
}

export const create = (createState) => {
  const api = createState(createStore);

  const useBoundStore = (selector) => useStore(api, selector);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};
