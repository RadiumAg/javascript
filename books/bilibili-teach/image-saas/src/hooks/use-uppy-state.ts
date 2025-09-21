import Uppy, { Body } from '@uppy/core';
import { useMemo, useSyncExternalStore } from 'react';

const useUppyState = <T extends any, TMeta extends Body>(
  uppy: Uppy<TMeta>,
  selector: (state: ReturnType<Uppy<TMeta>['getState']>) => T,
) => {
  const store = uppy.store;
  console.log(store.getState());
  const getSnapshot = () => selector(store.getState());

  const subscribe = useMemo(() => store.subscribe.bind(store), [store]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

export { useUppyState };
