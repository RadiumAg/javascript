// 在不给Date构造函数传参的情况下，创建对象保存当前日期和时间
// 要基于其他日期和时间创建对象，必须传入其毫秒表示
// 为此提供两个辅助方法，Date.parse 和 Date.UTC
() => {
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
};

(() => {
  () => {
    let text = 'cat, bat, sat, fat';
    let pattern = /.at/;

    let matches = pattern.exec(text);
    console.log(matches?.index);
    console.log(matches[0]);
    console.log(pattern.lastIndex);

    matches = pattern.exec(text);
    console.log(matches?.index);
    console.log(matches?.[0]);
    console.log(pattern.lastIndex);

    matches = pattern.exec(text);
    console.log(matches?.index);
    console.log(matches?.[0]);
    console.log(pattern.lastIndex);
  };

  (() => {
    let text = 'cat, bat, sat, fat';
    let pattern = /.at/y;
    let matches = pattern.exec(text);
    console.log(matches.index); // 0
    console.log(matches[0]); // cat
    console.log(pattern.lastIndex); // 3
    // 以索引3 对应的字符开头找不到匹配项，因此exec()返回null
    // exec()没找到匹配项，于是将lastIndex设置为0
    matches = pattern.exec(text);
    console.log(matches); // null
    console.log(pattern.lastIndex); // 0
    // 向前设置lastIndex可以让粘附的模式通过exec()找到下一个匹配项：
    pattern.lastIndex = 5;
    matches = pattern.exec(text);
    console.log(matches.index); // 5
    console.log(matches[0]); // bat
    console.log(pattern.lastIndex); // 8
  })();
})();
