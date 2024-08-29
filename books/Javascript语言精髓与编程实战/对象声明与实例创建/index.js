() => {
  const obj = {
    get propName() {
      return 'propName';
    },
  };

  console.log(obj.propName);
};

/**
 *
 *
 *
 */
(() => {
  function MyObject() {}
  function MyObjectEx() {}

  MyObjectEx.prototype = new MyObject();
  MyObjectEx.prototype.constructor = MyObjectEx;

  function MyOObjectEx2() {}
  MyOObjectEx2.prototype = new MyObjectEx();
  MyOObjectEx2.prototype.constructor = MyOObjectEx2;

  const obj = new MyOObjectEx2();

  // 原型继承：遍历原型链
  const proto = Object.getPrototypeOf(obj);

  while (proto) {
    console.log(`>>${proto.constructor}`);
    proto = Object.getPrototypeOf(proto);
  }
  console.log(`>>${proto}`);
})();
