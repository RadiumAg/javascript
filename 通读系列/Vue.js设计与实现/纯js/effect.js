const bucket = new WeakMap();

const data = { text: 'hellow world' };

let activeEffect;

function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = fn;
    fn();
  };

  effectFn.deps = [];
  effectFn();
}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);

    return true;
  },
});

// 收集依赖
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
  activeEffect.deps.push(deps);
  return target[key];
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  const effectsToRun = new Set(effects);
  effectsToRun.forEach(effectFn => effectFn());
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    // 移除依赖中的副作用
    deps.delete(effectFn);
  }
  // 重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

effect(() => {
  document.body.textContent = obj.ok ? obj.text : 'not';
});

obj.ok = false;
obj.text = 12;
