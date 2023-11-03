() => {
  const useThrottle = (fn: (...args: any[]) => any, duration: number) => {
    let lastTime = 0;

    return () => {
      if (Date.now() - lastTime > duration) {
        fn();
        lastTime = Date.now();
      }
    };
  };

  const useDebounce = (fn: (...args: any[]) => any, duration: number) => {
    let timer: undefined | NodeJS.Timeout;

    return () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        fn();
        clearTimeout(timer);
      }, duration);
    };
  };
};
