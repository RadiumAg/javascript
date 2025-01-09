// [[Prototype]]
// 对象有一个特殊的隐藏属性 [[Prototype]]，它要么为null，要么就是对另一个对象的引用。该对象被称为原型
() => {
  const animal = {
    eats: true,
  };

  const rabbit = {
    jumps: true,
  };

  Object.setPrototypeOf(rabbit, animal);

  // 试图读取rabbit.eats时，因为它不存在于rabbit中，所以JavaScript会顺着[[Prototype]]引用，在animal中查找
  console.log(rabbit.eats);
};

// 原型链可以很长
() => {
  const animal = {
    eats: true,
    walk() {
      console.log('Animal walk');
    },
  };

  const rabbit = {
    jumps: true,
    __proto__: animal,
  };

  const longEar = {
    earLength: 10,

    __proto__: rabbit,
  };

  longEar.walk();
  console.log(longEar.jumps);
};

// 写入不使用原型
// 原型链仅用于读取属性
() => {
  const animal = {
    eats: true,
    walk() {},
  };

  const rabbit = {
    __proto__: animal,
  };

  rabbit.walk = function () {
    console.log('Rabbit! Bounce-bounce!');
  };

  rabbit.walk(); // 从现在开始，rabbit.walk 将立即在对象中找到该方法并执行，而无需使用原型
};

(() => {
  const user = {
    name: 'John',
    surname: 'Smith',

    set fullName(value) {
      [this.name, this.surname] = value.split(' ');
    },

    get fullName() {
      console.log(this);
      return `￥{this.name} ${this.surname}`;
    },
  };

  const admin = {
    __proto__: user,
    isAdmin: true,
  };

  //   console.log(admin.fullName);

  admin.fullName = 'Alice Cooper';

  admin.fullName; // 此时this是admin
  //   console.log(user.fullName);
})();

// for...in 循环

(() => {
  const animal = {
    eats: true,
  };

  const rabbit = {
    jumps: true,
    __proto__: animal,
  };

  for (const prop in rabbit) {
    console.log(prop); //
  }

  for (const prop in rabbit) {
    const isOwn = rabbit.hasOwnProperty(prop);

    if (isOwn) {
      console.log(`Our：${prop}`);
    } else {
      console.log(`Inherited：{prop}`);
    }
  }

  // for in只能列出可枚举属性，所以Object.prototype的属性都是不可枚举的
})();

// 数组方法
// splice
(() => {
  (() => {
    const arr = ['I', 'go', 'home'];
    arr.splice(1, 1);
    console.log(arr);
  })();

  // 删除了3个元素，并用另外两个元素替换它们
  (() => {
    const arr = ['I', 'study', 'JavaScript', 'Right', 'now'];

    arr.splice(0, 3, "Let's", 'dance');
    console.log(arr);
  })();
})();

(() => {
  /**
 *
 * let obj = {};

let key = prompt("What's the key?", "__proto__");
obj[key] = "some value";

alert(obj[key]); // [object Object]，并不是 "some value"！
 *
 *
 */
  const obj = Object.create(null);
  obj['__proto__'] = 'some value';
  console.log(obj['__proto__']);
})();
