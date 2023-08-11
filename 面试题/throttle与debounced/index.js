// 距离上次点击要经过during秒之后才能触发
const useThrottle = (fn, during) => {
  let lastTime = 0;

  return () => {
    if (Date.now() - lastTime > during) {
      lastTime = Date.now();
      fn();
    }
  };
};

// during秒内触发的时间都被取消
const useDebounced = (fn, during) => {
  let timer;

  return () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn();
    }, during);
  };
};

export { useThrottle, useDebounced };

type a = InstanceType<>;
