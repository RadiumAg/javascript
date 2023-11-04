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

(() => {
  const myInstanceOf = (
    instance: Record<string, ay>,
    constructor: new (...args: any[]) => any,
  ) => {
    let flag = false;
    let leftPrototype = Object.getPrototypeOf(instance);

    while (leftPrototype) {
      if (leftPrototype === constructor.prototype) {
        flag = true;
        break;
      }

      leftPrototype = Object.getPrototypeOf(leftPrototype);
    }

    return flag;
  };

  class a {}

  console.log(myInstanceOf(new a(), a));
})();
