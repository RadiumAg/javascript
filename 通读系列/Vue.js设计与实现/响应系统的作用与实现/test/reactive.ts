import { reactive, useEffect } from 'index';

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
