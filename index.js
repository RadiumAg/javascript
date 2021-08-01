// setTimeout(() => {
//   new Promise((resolve, reject) => {
//     resolve(2);
//   }).then(x => {
//     console.log(2);
//   });
// });

// new Promise((resolve, reject) => {
//   resolve(1);
// }).then(x => {
//   console.log(1);
// });

function Person () {
  const obj = new Object();
  obj.name = '我是object';
  obj.obj = '我是object';
  obj.getName = () => {
    console.log(this);
  };
  obj.getName();
}
new Person();
