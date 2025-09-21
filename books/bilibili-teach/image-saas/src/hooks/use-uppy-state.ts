import Uppy, { Body } from '@uppy/core';
import { useEffect, useMemo, useSyncExternalStore } from 'react';

const useUppyState = <T extends Body, TMeta extends Body>(
  uppy: Uppy<TMeta>,
  selector: (state: ReturnType<Uppy<TMeta>['getState']>) => T,
) => {
  const store = uppy.store;
  console.log(store.getState());

  const subscribe = useMemo(() => store.subscribe.bind(store), [store]);
  // const getSnapshot = useMemo(() => store.getState.bind(store), [store]);

  return useSyncExternalStore(
    subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
};

export { useUppyState };
