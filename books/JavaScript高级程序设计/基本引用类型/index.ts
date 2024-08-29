// 在不给Date构造函数传参的情况下，创建对象保存当前日期和时间
// 要基于其他日期和时间创建对象，必须传入其毫秒表示
// 为此提供两个辅助方法，Date.parse 和 Date.UTC
(() => {
  // Date.parse
  (() => {
    const someDate = new Date(Date.parse('May 23, 2019'));
    console.log(someDate);
  })();
  // 如果直接把表示日期的字符串传给Date构造函数，那么Date会在后台调用Date.parse();
  (() => {
    const someDate = new Date('May 23, 2019');
    console.log(someDate);
  })();

  // Date.UTC
  (() => {
    const y2k = new Date(Date.UTC(2000, 0));
    console.log(y2k);
  })();
})();
