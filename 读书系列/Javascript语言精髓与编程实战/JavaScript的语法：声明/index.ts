(() => {
  const str = 'abcde';
  const obj = new String(str);

  function newToString() {
    return 'hello,world!';
  }

  function func(val) {
    val.toString = newToString;
  }

  func(str);
  console.log(str);

  func(obj);
  console.log(String(obj));
})();
