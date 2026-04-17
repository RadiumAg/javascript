(() => {
  function sayHi() {
    console.log(arguments); // arguments对象是类array数组，类array必须要有length属性
    console.log(Array.from(arguments));
  }

  sayHi(1, 2, 3, 3, 4, 4, 5, 12312, 56, 6);
})();

(() => {
  function doAdd() {
    if (arguments.length === 1) {
      console.log(arguments[0] + 10);
    } else if (arguments.length === 2) {
      console.log(arguments[0] + arguments[1]);
    }
  }

  doAdd(10);
  doAdd(30, 20);
})();
