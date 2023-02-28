const bucket = new Set();

const data = { text: 'hellow world' };

function effect() {
  document.body.textContent = obj.text;
}

const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach(fn => fn());
  },
});
