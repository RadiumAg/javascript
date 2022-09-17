(() => {
  const regex = /(\d{4})-(\d{2})-(\d{2})/;
  console.log('2017-06-01'.match(regex));
  console.log(RegExp.$1);
})();

// 反向引用
(() => {
  const regex1 = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
  const string1 = '2017-06-12';
  const string2 = '2017/06/12';
  const string3 = '2017.06.12';
  const string4 = '2016-06/12';

  console.log(regex1.test(string1));
})();

// 非捕获组
(() => {
  const regex = /(?:ab)+/g;
  const string = 'ababa abbb ababab';
  console.log(string.match(regex));
})();
