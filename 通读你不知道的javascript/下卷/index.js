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
var it ={
    [Symbol.iterator](){ return this; },
    next(){
        return { value: 0, done:false }
    },
}
console.log(it[Symbol.iterator]() === it);

for (var v of it) {
    console.log(v);
}


