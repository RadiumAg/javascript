// 十六进制
(() => {
  console.log(0xff);
})();

// 布尔值
// falsy value，下面这些值会转换成false
(() => {
  console.log(!!undefined);
  console.log(!!null);
  console.log(!!0);
  console.log(!!-0);
  console.log(!!Number.NaN);
  console.log(!!'');
})();

// null认为是一个特殊的对象值，含义是“非对象”
(() => {
  console.log(typeof null);
})();

// undefined 是全局变量，它不是关键字

// 包装对象
// 通过String,Number,Boolean构造函数来显式创建包装对象
(() => {
  const s = 'test';
  const n = 1;
  const b = true;
  const S = new String(s);
  const N = new Number(n);
  const B = new Boolean(b);
})();

// 类型转换
(() => {
  // eslint-disable-next-line prefer-template
  console.log(10 + `object`); // "10 objects"， 数字10转换成字符串
  console.log('7' * '4'); // 28
  console.log(1 - 'x'); // NaN
})();

// 转换和相等性
(() => {
  console.log(null == undefined);
  console.log('0' == 0);
  console.log(0 == false);
  console.log('0' == false);
})();

// 显式类型转换
(() => {
  Number('3');
  String(false);
  Boolean([]);
  new Object(3);

  const x = 1;
  // eslint-disable-next-line prefer-template, prettier/prettier
  console.log(x + '');
  console.log(+x);
  console.log(!!x);

  // toFixed，toExponential，toPrecision 都会适当的四舍五入
  const n = 123456.789;
  n.toFixed(0); // 1234567
  n.toFixed(2); // 123456.79
  n.toFixed(5); // 123456.78900
  n.toExponential(1); // 1.2e+5
  n.toExponential(3); // 1.235e+5
  n.toPrecision(4); // 1.235e+5
  n.toPrecision(7); // 123456.8
  n.toPrecision(10); // 123456.7890
})();

// parseInt 只能解析函数
(() => {
  console.log(Number.parseInt('3 bind mice'));
  console.log(Number.parseInt(' 3.14 meters')); // 3.14
  console.log(Number.parseInt('-12.34')); // -12
  console.log(Number.parseInt('0xFF')); //255
  console.log(Number.parseInt('0xff')); // 255
  console.log(Number.parseInt('-0xff')); // -255
  console.log(Number.parseInt('.1')); // 0.1
  console.log(Number.parseInt('0.1')); // 0
  console.log(Number.parseInt('.1')); // NaN: 整数不能以"."开始
  console.log(Number.parseInt('$72.47')); // NaN: 整数不能以"$"开始
})();

// 对象到布尔值的转化非常简单：所有的对象（包括数组和函数）都转换成true
(() => {
  const a = {
    toString() {
      return a;
    },

    valueOf() {
      return a;
    },
  };

  // console.log(a == 1); // 会报错，因为toString 和 valueOf 没能返回原始值
})();

// 文本
(() => {
  console.log('\u030C0');
  console.log('\u0000');
  console.log('\u0008');
  console.log('\u0009');
})()(
  // 原始表达式
  // 最简单的表达式是原始表达式。JavaScript中的原始表达式包含常量，直接量，关键字和变量

  // 对象创建表达式
  () => {
    console.log(new Object());
  },
)();

// 类数组
(() => {
  const a = {
    length: 0,
  };

  let i = 0;

  while (i < 10) {
    a[i] = i * i;
    i++;
  }
  a.length = i;

  let total = 0;
  for (let j = 0; j < a.length; j++) {
    total += a[j];
  }

  console.log(Array.from(a));
})();
