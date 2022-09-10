let activeEffect: EffectFn;
// 是否正在刷新
let isFlushing = false;

type EffectFn = {
  (): any;
  deps: Set<EffectFn>[];
  options: Options;
}

type Options = {
  lazy?: boolean
  scheduler: (fn) => void
}


// 调度队列
const jobQueue = new Set<EffectFn>();
const p = Promise.resolve();
const effectStack: EffectFn[] = [];
const bucket = new WeakMap<Object, Map<string, Set<EffectFn>>>(); // { key: { key: Set(EffectFn) } }

function flushJob() {
  if (isFlushing) return;
  isFlushing = true;

  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  });
}


export const baseHandle = {
  // get的时候触发
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
    return true;
  }
}



// 取值get
function track(target, key) {
  if (!activeEffect) return target[key];
  let depsMap = bucket.get(target);

  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }

  let deps = depsMap.get(key);

  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  deps.add(activeEffect);
  // 将依赖集合set放到副作用函数当中去
  activeEffect.deps.push(deps);

  return target[key];
}

// 触发
function trigger(target, key: string) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);

  const effectsToRun = new Set(effects);
  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else { effectFn(); }
  });
}

// 相当于watch,options为调度配置
export function effect(fn: Function, options: Options) {
  const effectFn: EffectFn = () => {
    // 副作用执行时清除
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // 触发track
    const res = fn();
    // 恢复到上一个
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  // 赋予初始值
  effectFn.deps = [];
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

function cleanup(effectFn) {
  for (let i = 0; i > effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }

  effectFn.deps.length = 0;
}

export function computed(getter) {
  let value;
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(obj, 'value');
      }
    }
  });

  const obj = {
    get value() {
      value = effectFn();
      if (dirty) {
        value = effectFn();
        dirty = false;
        trigger(obj, 'value');
      }
      return value;
    }
  };

  return obj;
}

// seen避免循环引用
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has
    (value)) return

  seen
    .add(value);
  for (const k in value) {
    traverse(value[k], seen)
  }

  return value
}

type WatchOptions = {
  immediate: boolean
}

export function watch(source, cb, options: WatchOptions) {
  let getter;
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue

  const effectFn = effect(() => getter(), {
    scheduler() {
      newValue = effectFn()
      cb(newValue, oldValue)
      oldValue = newValue
    }
  })
}

// 收集依赖函数
export const useEffect = (fn) => {
  effect(fn, {
    scheduler(fn) {
      jobQueue.add(fn);
      flushJob();
    }
  });
}
