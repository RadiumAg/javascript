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


const arr1 = [1];
const arr2 = [1];
const flagList = [],map = new Map(),map1 = new Map();
let flag;

arr1.forEach((value,index)=>{
    map.set(value,value);
});

arr2.forEach((value,index)=>{
    map1.set(value,value);
});

Array.from(map).forEach((_value, index) => {
    Array.from(map1).forEach((value, index) => {
        if (value[0] === _value[1]) {
            flagList.push(true);
        }
    })
});

if (map1.size === flagList.length) {
    console.log(true);
} else {
    console.log(false);
}
