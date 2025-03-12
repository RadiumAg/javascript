let activeEffect = null;
// 存储副作用函数的桶
const bucket = new WeakMap();
// effect 栈
const effectStack = [];
// 定义一个任务队列
const jobQueue = new Set();
// 使用 Promise.resolve() 创建一个 promise 实例，，我们用它将一个任务添加到微任务队列
const p = Promise.resolve();
// 一个标志，代表是否正在刷新队列
let isFlushing = false;
// 原始数据
const data = { text: 'hello', foo: 1, bar: 1 };

window.bucket = bucket;

function flushJobs() {
  // 如果正在刷新队列，直接 return
  if (isFlushing) return;
  isFlushing = true;
  // 在微任务队列中刷新 jobQueue 队列
  p.then(() => {
    for (const job of jobQueue) {
      job();
    }
  }).finally(() => {
    isFlushing = false;
  });
}

/**
 * 清理副作用函数
 *
 * @param {*} effect
 */
function cleanup(effect) {
  // 遍历 effectFn.deps 数组
  for (const deps of effect.deps) {
    // 删除 dep 中的 effectFn
    deps.delete(effect);
  }

  // 最后需要重置 effect.deps 数组
  effect.deps.length = 0;
}

/**
 * 包装副作用函数
 *
 * @param {*} fn
 * @param {*} options
 */
function effect(fn, options = {}) {
  const effectFn = () => {
    // 当 effectFn 执行时，将其设置为当前激活的副作用函数
    cleanup(effectFn);

    activeEffect = effectFn;
    // 在调用副作用函数之前将当前副作用函数压入栈中
    effectStack.push(effectFn);

    const res = fn();
    // 在当前副作用按时执行完毕后，将其从 effectStack 中移除
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    // 将 res 作为 effectFn 的返回值
    return res;
  };

  // 将 options 挂载到 effectFn 上
  effectFn.options = options;
  effectFn.deps = [];
  // 只有非 lazy 的时候，才执行
  if (!options.lazy) {
    // 执行副作用函数
    effectFn();
  }
  return effectFn;
}

/**
 * 在 get 拦截函数内调用 track 函数追踪变化
 *
 * @param {*} target
 * @param {*} key
 * @returns
 */
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  // 根据 target 从""桶""中取出 depsMap, 它也是一个 Map 类型：k --> effect
  let depsMap = bucket.get(target);
  // 如果不存在 depsMap， 那么新建一个 Map 并与 target 关联
  if (!depsMap) {
    depsMap = new Map();
    bucket.set(target, depsMap);
  }
  // 再根据 key 从 depsMap 中取出 deps, 它是一个 Set 类型：effect
  // 里面存储着所有与当前 key 相关联的副作用函数：effects
  let deps = depsMap.get(key);
  // 如果 deps 不存在，同样新建一个 Set 并与 key 关联
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  // 最后将当前激活的副作用函数添加到 桶 中
  deps.add(activeEffect);

  // deps 就是一个当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 中
  activeEffect.deps.push(deps);
}

// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  // 根据 target 从桶中取出 depsMap, 它是 key --> effects
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  // 根据 key 取得所有副作用函数 effects
  const effects = depsMap.get(key);

  const effectsToRun = new Set();

  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  // 执行副作用函数
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      // 否则直接执行副作用函数
      effectFn();
    }
  });
}

/**
 * 计算属性
 *
 * @param {*} getter
 * @returns
 */
function computed(getter) {
  let value;
  // dirty 标志，用来标志是否需要重新计算值，为 true 时需要重新计算
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        // 当计算属性依赖的响应式数据发生变化的时候，手动调用 trigger 函数触发响应
        trigger(obj, 'value');
      }
    },
  });

  const obj = {
    // 读取 value 时才执行 effectFn
    get value() {
      // 只有 脏 时才计算值，并将得到的值缓存到value 中
      if (dirty) {
        value = effectFn();
        dirty = false;
      }

      // 当读取 value 时，手动调用 track 函数进行追踪
      track(obj, 'value');
      return value;
    },
  };

  return obj;
}

function traverse(value, seen = new Set()) {
  // 如果要要读取的是原始值，或者已经被读取过了，那么什么都不做
  if (typeof value !== 'object' || value === null || seen.has(value)) return;

  // 将数据添加到seen中，，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value);

  // eslint-disable-next-line no-restricted-syntax
  for (const k in value) {
    traverse(value[k], seen);
  }

  return value;
}

/**
 * watch 函数接收两个参数
 *
 * @param {*} source
 * @param {*} cb
 */
function watch(source, cb) {
  // 定义 getter
  let getter;

  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
  // 定义旧值和新值
  let oldValue, newValue;
  // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到 effectFn 中以便后续手动调用

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler() {
      newValue = effectFn();
      // 将旧值和新
      cb(newValue, oldValue);
      // 更新旧值，不然下次会得到错误的值
      oldValue = newValue;
    },
  });
}

// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },

  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶中取出来并执行
    trigger(target, key);
    return true;
  },
});

// 副作用函数
() => {
  effect(() => {
    document.body.textContent = obj.text;
  });

  setTimeout(() => {
    obj.text = 'world';
  }, 1000);
};

// 分支切换与cleanup
() => {
  const data = { ok: true, text: 'hello world' };

  effect(() => {
    document.body.textContent = data.ok ? data.text : 'nothing';
  });
};

// 嵌套副作用函数
() => {
  // 全局变量
  let temp1, temp2;

  // effectFn1 嵌套了 effectFn2
  effect(() => {
    console.log('effectFn1 执行');

    effect(() => {
      console.log('effectFn2 执行');
      // 在 effectFn2 中读取 obj.bar 属性
      temp2 = obj.bar;
    });

    // 在 effectFn1 中读取 obj.foo 属性
    temp1 = obj.foo;
  });

  obj.bar = 'foo';
};

// 无限嵌套
() => {
  effect(() => {
    obj.foo = obj.foo + 1;
  });
};

// 调度器
() => {
  effect(
    () => {
      console.log(obj.foo);
    },
    {
      scheduler: effect => {
        // 每次调度时，将副作用函数添加到 jobQueue 中
        jobQueue.add(effect);
        // 调用flushJob 刷新队列
        flushJobs();
      },
    }
  );

  obj.foo++;
  obj.foo++;
  obj.foo++;
};

// 计算属性 computed 与 lazy
() => {
  effect(
    () => {
      console.log(obj.foo);
    },
    {
      lazy: true,
    }
  );
};

// 计算属性 computed
() => {
  const sumsRes = computed(() => obj.foo + obj.bar);

  effect(() => {
    console.log(sumsRes.value);
  });

  obj.foo++;
};
