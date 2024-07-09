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
