'use strict';

// next() 迭代
// let arr = [1, 2, 3];
// let it = arr[Symbol.iterator]();
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());

// let greeting = "hello world";
// let it = greeting[Symbol.iterator]();
// console.log(it.next());
// console.log(it.next());

// 迭代器循环
// var it ={
//     [Symbol.iterator](){
//         return this;
//     },
//     next(){
//         return { value: 0, done:false }
//     },
// }
// console.log(it[Symbol.iterator]() === it);

// for (var v of it) {
//     console.log(v);
// }

// 自定义迭代器
// var Fib = {
//     [Symbol.iterator]() {
//         var n1 = 1,
//             n2 = 1;
//         return {
//             [Symbol.iterator]() {
//                 return this;
//             },

//             next() {
//                 var current = n2;
//                 n2 = n1;
//                 n1 = n1 + current;
//                 return { value: current, done: false };
//             },
//             return(v) {
//                 console.log('Fibonacci sequence abandoned.');
//                 return { value: v, done: true };
//             }
//         };
//     }
// };

// for (const v of Fib) {
//     console.log(v);
//     if (v > 50) break;
// }

const task = {
  [Symbol.iterator]() {
    const steps = this.actions.slice();

    return {
      // 使迭代器称为iterable
      [Symbol.iterator]() {
        return this;
      },
      next(...args) {
        if (steps.length > 0) {
          const res = steps.shift()(...args);
          return { value: res, done: false };
        } else {
          return { done: true };
        }
      },
      return(v) {
        steps.length = 0;
        return { value: v, done: true };
      },
    };
  },
  actions: [],
};

task.actions.push(
  x => {
    console.log('step 1:', x);
    return x * 2;
  },
  (x, y) => {
    console.log('step 2:', x, y);
    return x + y * 2;
  },
  (x, y, z) => {
    console.log('step 3:', x, y, z);
    return x * y + z;
  },
);

const it = task[Symbol.iterator]();
console.log(it.next(10));
console.log(it.next(20, 50));
console.log(it.next(20, 50, 120));
console.log(it.next());
