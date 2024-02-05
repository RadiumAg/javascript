() => {
  function Person() {}
  Person.prototype.name = 'Nicholas';
  Person.prototype.age = 29;
  Person.prototype.job = 'Software Engineer';
  Person.prototype.sayName = function () {
    console.log(this.name);
  };

  const person1 = new Person();
  person1.sayName(); //"Nicholas"

  const person2 = new Person();
  person2.sayName(); //"Nicholas"

  console.log(person1.sayName == person2.sayName); //true
};

() => {
  // ECMA-262使用一些内部特性来描述属性的特征来描述属性的特征。
  // 这些特性是由为JavaScript实现引擎的规范定义的。因此，开发者不能在JavaScript中直接访问这些特性
  // 为了将某个特性标识为内部特性，规范会用两个中阔号把名称括起来，比如[[[Enumerable]]]

  // 1. 数据属性
  // 数据属性包含一个保存数据值的位置。值会从这个位置读取，也会写入到这个位置。数据属性有4个特征描述它们的行为
  // 1.[[Configurable]]：表示属性是否可以通过delte删除并重写定义
  // 2.[[Enumerable]：表示属性是否可以通过for in循环返回。默认情况下，所有直接定义在对象上的属性的这个特性都是true，如前面的例子所示
  // 3.[[Writable]]: 表示属性的值是否可以呗修改.默认情况下,所有直接定义在对象上的属性的这个特性都是true,如前面的例子所示
  // 4.[[Value]]: 包含属性实际的值.这就是前面提到的那个读取和写入属性值的位置.这个特性的默认值为undefined.
  const person = {};
  Object.defineProperty(person, 'name', {
    writable: false,
    value: 'Nicholas',
  });

  console.log(person.name);
  person.name = 'Greg';
  console.log(person.name);
};

() => {
  const person = {};
  Object.defineProperty(person, 'name', {
    configurable: false,
    value: 'Nicholas',
  });

  Object.defineProperty(person, 'name', {
    configurable: true,
    value: 'Nicholas',
  });
};

// 2. 属性访问器
() => {
  const book = {
    year_: 2017,
    edition: 1,
  };

  Object.defineProperty(book, 'year', {
    get() {
      return this.year_;
    },
    set(newValue) {
      if (newValue > 2017) {
        this.year_ = newValue;
        this.edition += newValue - 2017;
      }
    },
  });

  book.year = 2018;
};

// 合并对象
(() => {
  let dest, src, result;
  dest = {};
  src = { id: 'src' };
  result = Object.assign(dest, src);

  console.log(dest === result);
  console.log(dest !== src);
  console.log(result);
  console.log(dest);

  dest = {};
  src = { id: 'src' };
  result = Object.assign(dest, { a: 'foo' });
  console.log(result);

  // 获取函数与设置函数

  dest = {
    set a(val) {
      console.log(`Invoked dest setter with param ${val}`);
    },
  };

  src = {
    get a() {
      console.log(`Invoked src getter`);
      return 'fpp';
    },
  };

  Object.assign(dest, src);
})();

// 对象表示以及相等判定
(() => {
  console.log(true === 1); //false
  console.log({} === {});
  console.log('2' === 2);
  console.log(+0 === -0); //true
  console.log(+0 === 0); // true
  console.log(-0 === 0); // true
  console.log(NaN === NaN);
  console.log(isNaN(NaN));
})();
