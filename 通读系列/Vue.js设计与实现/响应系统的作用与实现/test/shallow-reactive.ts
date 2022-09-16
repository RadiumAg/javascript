//shallowReactive 函数创建了一个浅响应的代理对象obj
import { reactive } from '..';

const data = reactive({ text: 'hello world', foo: 1, bar: 2 });

const arr = reactive([data]);
console.log(arr.includes(data)); // true
