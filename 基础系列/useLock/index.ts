const useLock = (fn: (...args: any[]) => any) => {
  let isLock = false;

  return async (...args: any[]) => {
    if (isLock) return;

    isLock = true;
    await fn(...args);
    isLock = false;
  };
};

const lock = useLock(async () => {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, 1000);
  });

  console.log('end');
});

lock();
lock();
lock();
lock();
lock();
lock();
