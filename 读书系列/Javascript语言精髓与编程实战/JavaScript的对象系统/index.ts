(() => {
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
})();

// 成员的列举，以及可列举性
(() => {
  const obj = new Object();
  console.log(obj.propertyIsEnumerable('aCustomMember'));
  // 数组的.length属性是隐藏的
  console.log([].propertyIsEnumerable('length'));

  for (const key in []) {
    console.log(key);
  }
})();

// delete不能删除“继承自原型的成员”，如果修改了这个成员的值，仍然可以删除它（并使它恢复到原型的值）
(() => {
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
})();

// super对一般属性的意义
(() => {
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
})();
