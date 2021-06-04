// let a = {
//     i: 1,
//     toString() {
//       return a.i++;
//     }
//   }

// if (a == 1 && a == 2 && a == 3) {
//     console.log(1);
// }
// async function b() {
//     console.log(3);
// }

// async function a() {
//     await new Promise((resove) => { console.log(3); resove(1); });
//     console.log(2);
// }

// a.call(this);
// // a();
// console.log(1);

// const arr1 = [1];
// const arr2 = [1];
// const flagList = [], map = new Map(), map1 = new Map();
// let flag;

// arr1.forEach((value, index) => {
//     map.set(value, value);
// });

// arr2.forEach((value, index) => {
//     map1.set(value, value);
// });

// Array.from(map).forEach((_value, index) => {
//     Array.from(map1).forEach((value, index) => {
//         if (value[0] === _value[1]) {
//             flagList.push(true);
//         }
//     })
// });

// if (map1.size === flagList.length) {
//     console.log(true);
// } else {
//     console.log(false);
// }

// async function a2() {
// }

// async function a1() {
//     await a2();  // then后边的事情
// }

// async function a3() {
// }

// async function a4() {
//     await a3();  // then后边的事情
// }

// Promise.all([a1,a4]).then(x=>{
//     console.log(x)
// });
// console.log(4);

// let a = [1, 2, 4];
// a.forEach((x, i, b) => {
//     console.log(b);
//     b.splice(x, 1);
// });

// let net = require('net');


// async function a(){
//   for (let index = 0; index <3; index++) {
//     console.log("执行");
//    let a =   await new Promise((resolve ,reject)=>{ 
//      setTimeout(()=>{
//       resolve(index);
//      },Math.random()*2000) });
//     console.log(a);
//     }
//   }

//   a();
