(() => {
  /**
   *  a 为对象时，先调用`Symbol.toPrimitive`,无法得到原始值，则调用valueOf,如果无法无法得到原始值，则调用toString()
   *  hint为"number"|"string"|"default" 表示原始值的预期类型
   */
  const a = {
    toString() {
      return 2;
    },
    valueOf() {
      return 1;
    },
    [Symbol.toPrimitive](hint) {
      console.log(hint);
      return 3;
    },
  };
  console.log(Object.prototype.toString.call(a));
})();
