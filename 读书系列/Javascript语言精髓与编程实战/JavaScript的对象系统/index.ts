() => {
  function Bird() {
    this.wing = 2;
    this.tweet = function () {};
    this.fly = function () {
      console.log('I can fly');
    };
  }

  function isBird(instance) {
    return instance instanceof Bird;
  }

  function doFlay(me) {
    if (!isBird(me)) {
      throw new Error('对象不是Bird或其子类的实例.');
    }

    me.fly();
  }

  doFlay(new Bird());
};

// 成员的列举，以及可列举性
() => {
  const obj = new Object();
  console.log(obj.propertyIsEnumerable('aCustomMember'));
  // 数组的.length属性是隐藏的
  console.log([].propertyIsEnumerable('length'));

  for (const key in []) {
    console.log(key);
  }
};

// delete不能删除“继承自原型的成员”，如果修改了这个成员的值，仍然可以删除它（并使它恢复到原型的值）
() => {
  function MyObject() {
    this.name = "instance's name";
  }

  MyObject.prototype.name = "prototype's name";
  const obj = new MyObject();
  console.log(obj.name);

  // 删除该成员
  delete obj.name;
  console.log('name' in obj);
  // 并且恢复到原型的值“prototype”'s name
  console.log(obj.name);
};

// super对一般属性的意义
() => {
  // 父类和父类的.prototype原型中的属性
  class MyObject {}
  MyObject.prototype.x = 100;

  class MyObjectEx extends MyObject {
    foo() {
      console.log(super.x);
    }
  }
  const obj = new MyObjectEx();

  // 示例1
  // - obj.foo()通过super访问到x值
  obj.foo();
  // obj 通过原型继承访问到的 x 值
  console.log(obj.x); // 100

  // 示例2
  // - 修改对象实例的x值
  obj.x = 200;
  console.log(obj.x); // 200
  // - 通过super访问到的原型值是不变化的
  obj.foo();

  // 示例3
  // - 修改原型的x值
  MyObject.prototype.x = 300;
  // - 通过super访问到的原型值是变化的
  obj.foo();
  // - 对象的自由属性（这里是覆盖了继承属性）不受影响
  console.log(obj.x);
};

// setPrototypeOf
() => {
  const obj = {
    foo() {
      console.log(super.x);
    },
  };

  obj.foo(); // undefined

  Object.setPrototypeOf(obj, { x: 100 }); // rewrite prototype
  obj.foo(); // 100
};

// super在两种继承关系中的矛盾
() => {
  class MyObject {
    get defaultCount() {
      return 10;
    }
  }

  class MyObjectEx extends MyObject {
    get defaultCount() {
      // 使用super.defaultCount 会访问到什么呢？
      return super.defaultCount + 3;
    }
  }
};

// 类静态属性
(() => {
  class MyObject {
    static get defaultCount() {
      return 10;
    }
  }

  // 子类实现父类defaultCount + 3
  class MyObjectEx extends MyObject {
    static get defaultCount() {
      return super.defaultCount + 3;
    }
  }

  console.log(MyObjectEx.defaultCount);
})();

// super指向什么
(() => {
  class MyObject {
    static showMe() {
      console.log(`我是：${super.toString()}`);
    }
  }

  // 类声明
  class MyObjectEx extends MyObject {
    constructor() {
      // 语义1：在类的构造方法声明中，super指向父类构造器，this指向new创建的新实例
      // super = MyObject.bind(this);
      super();

      // 语义2：在预发 super.xxx 中,super指向父类原型，在构造过程中 this 指向创建的新实例
      // 相当于 super.toString = MyObject.prototype.toString.bind(this)
      super.toString();
    }

    foo() {
      // 语义2：（同上，this指向调用本方法时的this对象）
      // 相当于super.foo = MyObject.prototype.foo.bind(this)
      super.foo();
    }

    static doSomething() {
      // 语义3：在静态类方法中使用预发 super.xxx，其super指向父类，this指向
      // 调用当前方法的类（构造器函数，在本示例中是MyObjectEx）
      // 相当于MyObject.do.bind(this)
      super.do();
    }

    static get aName() {
      // 语义3：（在类静态成员的存取方法中，同上）
      super.do();
    }
  }

  const obj = {
    foo() {
      // 语义1：在对象方法中使用预发 super.xxx，其super指向父类，this指向调用本方法的对象
      // 相当于super.toString = Object.prototype.toString.bind(this)
      super.toString();
    },
    bar() {
      // 不能引用 super
    },
  };
})();

// 封装与多态
(() => {
  function MyObject() {
    // 私有(private)变量
    const data = 100;

    function _run(v) {
      console.log(v);
    }

    // 公开 {public} 属性
    this.value = 'The data is:';

    //公开{public} 方法
    this.run = function () {
      _run(this.value + data);
    };
  }

  // 演示，最终调用到_run()函数
  const obj = new MyObject();
  obj.run();
})();
