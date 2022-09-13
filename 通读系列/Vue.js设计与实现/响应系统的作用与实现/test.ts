import { baseHandle, computed, effect, reactive, useEffect } from '.';

const data = { text: 'hello world', foo: 1, bar: 2 };

useEffect(() => {
  console.log(data.foo);
});

const obj = new Proxy(data, baseHandle);

// computed
const sumRes = computed(() => obj.foo + obj.bar);

useEffect(() => {
  console.log(sumRes.value);
});

obj.foo++;

// forin
useEffect(() => {
  for (const key in obj) {
    console.log(key);
  }
});

// reactive
const test1 = {};
const proto = { bar: 1 };
const child = reactive(test1);
const parent = reactive(proto);

Object.setPrototypeOf(child, parent);

useEffect(() => {
  console.log(child.bar);
});

console.log(child.raw === test1);
console.log(parent.raw === proto);

// deep
const test = reactive({ foo: { bar: 1 } });

useEffect(() => {
  console.log(test.foo.bar);
});

test.foo.bar = 2;

// shallowReactive 函数创建了一个浅响应的代理对象obj

const arr = reactive([data]);
console.log(arr.includes(obj)); // true
