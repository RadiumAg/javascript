// 有七种原始类型：string,number,bigint,boolean,symbol,null,undefined
(() => {
  const str = 'Hello';
  console.log(str.toUpperCase());
})();

// 数组方法
(() => {
  // splice
  const arr = ['1', 'go', 'home'];
  delete arr[1];
  console.log(arr[1]);
  console.log(arr.length);
})();
