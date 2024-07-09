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
