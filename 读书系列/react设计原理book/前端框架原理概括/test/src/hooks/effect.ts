// 保存effectStack调用栈
const effectStack = [];

function subscribe(effect, subs) {
  // 订阅关系建立
  subs.add(effect);
  // 依赖关系建立
  effect.deps.add(subs);
}

function cleanup(effect) {
  // 从该effect订阅的所有state对应的subs中移除该effect
  for (const subs of effect.deps) {
    subs.delete(effect);
  }

  effect.clear();
}

function useState(value) {
  const subs = new Set();

  const getter = () => {
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
      // 建立订阅发布关系
      subscribe(effect, subs);
    }
    return value;
  };

  const setter = nextValue => {
    value = nextValue;
    for (const effect of [...subs]) {
      effect.execute();
    }
  };

  return [getter, setter];
}

function useEffect(callback) {
  const execute = () => {
    cleanup(effect);
    effectStack.push(effect);

    try {
      callback();
    } finally {
      effectStack.pop();
    }
  };

  const effect = {
    execute,
    deps: new Set(),
  };

  execute();
}

function useMemo(callback) {
  const [s, set] = useState();
  useEffect(() => set(callback()));
  return s;
}

export { useEffect, useMemo, useState };
