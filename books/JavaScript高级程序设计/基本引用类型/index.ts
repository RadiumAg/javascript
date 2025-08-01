// 在不给Date构造函数传参的情况下，创建对象保存当前日期和时间
// 要基于其他日期和时间创建对象，必须传入其毫秒表示
// 为此提供两个辅助方法，Date.parse 和 Date.UTC
() => {
  // 构造函数传参
  (() => {
    console.log(new Date(123123123132));
  })();

  // Date.parse
  (() => {
    const parseTime = Date.parse('May 23, 2019');
    const someDate = new Date(parseTime);
    console.log('parseTime', parseTime);
    console.log(new Date('5/23/2019')); // 会在后台调用Date.parese
  })();
  // 如果直接把表示日期的字符串传给Date构造函数，那么Date会在后台调用Date.parse();
  (() => {
    const someDate = new Date('May 23, 2019');
    console.log(someDate);
  })();

  // Date.UTC
  /**
   *
   *  new Date(year, monthIndex)
      new Date(year, monthIndex, day)
      new Date(year, monthIndex, day, hours)
      new Date(year, monthIndex, day, hours, minutes)
      new Date(year, monthIndex, day, hours, minutes, seconds)
      new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
   *
   */
  (() => {
    const y2k = new Date(2000, 1, 2);
    console.log('Date.UTC', y2k);
  })();
};

() => {
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

  () => {
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
  };
};

// Number
() => {
  // toFixed,保留小数位的位数，存在四舍五入
  (() => {
    console.log((1.2222222).toFixed(2));
  })();

  // toExponential
  // toExponential()也接收一个参数，表示结果中小数的位数,科学计数法
  (() => {
    const num = 10;
    console.log(num.toExponential(1));
    console.log(num.toExponential(2));
    console.log(num.toExponential(3));
  })();

  // toPrecision()
  // 会根据情况返回最合理的输出结果，有效数字的位数
  (() => {
    let num = 99;
    console.log(num.toPrecision(1)); //"1e+2"
    console.log(num.toPrecision(2)); //"99"
    console.log(num.toPrecision(3)); //"99.0"
  })();

  // isInterger()
  (() => {
    console.log(Number.isInteger(1));
    console.log(Number.isInteger(1.0));
    console.log(Number.isInteger(1.01));
  })();
};

// 字符串操作方法
(() => {
  (() => {
    let stringValue = 'hello ';
    let result = stringValue.concat('hello world');
    console.log(result);
    console.log(stringValue);
  })();

  //
})();
