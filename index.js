// let a = {
//     i: 1,
//     toString() {
//       return a.i++;
//     }
//   }

// if (a == 1 && a == 2 && a == 3) {
//     console.log(1);
// }    
async function b() {
    console.log(3);
}

async function a() {
    await b();
    console.log(2);
}

a();
console.log(1);