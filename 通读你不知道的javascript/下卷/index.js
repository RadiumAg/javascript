'use strict';

// next() 迭代
let arr = [1, 2, 3];
let it = arr[Symbol.iterator]();
console.log(it.next());
console.log(it.next());
console.log(it.next());

let greeting = "";



