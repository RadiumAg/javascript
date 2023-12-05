let syncQueue: ((...args: any) => void)[] | null = null;
let isFlushingSyncQueue = false;

function scheduleSyncCallback(callback: (...args: any[]) => void) {
  if (syncQueue === null) {
    syncQueue = [callback];
  } else {
    syncQueue.push(callback);
  }
}

function flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncQueue) {
    isFlushingSyncQueue = true;
    try {
      syncQueue.forEach(callback => callback());
    } catch (e) {
      if (__DEV__) {
        console.error('flushSyncCallbacks报错', e);
      }
    } finally {
      isFlushingSyncQueue = false;
    }
  }
}

export { flushSyncCallbacks, scheduleSyncCallback };
