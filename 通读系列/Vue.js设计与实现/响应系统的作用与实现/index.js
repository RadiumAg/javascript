
let activeEffect;

const effectStack = [];
const bucket = new WeakMap(); // { key: { key: Set(EffectFn) } }

const data = { text: 'hello world' };

const obj = new Proxy(data, {
  // get的时候触发
  get (target, key) {
    track(target, key);
    return target[key];
  },
  set (target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
  }
});

function track (target, key) {
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

// 触发函数
function trigger (target, key) {
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
  effectsToRun.forEach(effectFn => effectFn());
}

// 相当于watch
function effect (fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // 假设是track，触发track
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn.deps = [];
  effectFn();
}

function cleanup (effectFn) {
  for (let i = 0; i > effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }

  effectFn.deps.length = 0;
}

let temp1, temp2;

// 收集以来函数
effect(function effectFn1 () {
  console.log('effectFn1 执行');

  effect(function effectFn2 () {
    console.log('effectFn2 执行');
    temp2 = obj.bar;
  });

  temp1 = obj.foo;
});

console.log(bucket);

setTimeout(() => {
  obj.foo = 'hello vue3';
}, 1000);
