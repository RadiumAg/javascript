import { bucket, computed, reactive } from './effect.js';

// const p = reactive(new Map([[{ key: 1 }, { value: 1 }]]));

// effect(() => {
//   p.forEach((value, key) => {
//     console.log(value); // { value: 1 }
//     console.log(key); // { key: 1 }
//   });
// });

// // 能够触发响应
// p.set({ key: 2 }, { value: 2 });

const a = reactive({ a: 1 });

const p = computed(() => a.a);

// effect(() => {
//   // TypeError: p is not iterable
//   for (const [key, value] of p) {
//     console.log(key, value);
//   }
// });

console.log(p.value);
a.a = 1;
console.log(bucket);
