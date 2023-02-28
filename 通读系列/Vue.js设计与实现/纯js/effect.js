const bucket = new WeakMap();

const data = { text: 'hellow world' };

let activeEffect;
function effect(fn) {
  activeEffect = fn;
  fn();
}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
  },
});

effect(() => {
  document.body.textContent = obj.text;
});

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
  return target[key];
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  effects && effects.forEach(fn => fn());
}
