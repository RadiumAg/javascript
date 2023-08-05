// call
(() => {
  Function.prototype._call = function (context, ...args) {
    let result = null;
    context = new Object(context) || window;
    context.fn = this;
    result = context.fn(...args);
    Reflect.deleteProperty(context, 'fn');
    return result;
  };

  function a(a, b) {}
  a._call({}, 1, 2, 3);
})();

// apply
(() => {
  Function.prototype._apply = function (context, args = []) {
    let result = null;
    context = new Object(context) || window;
    context.fn = this;
    result = context.fn(...args);
    Reflect.deleteProperty(context, 'fn');
    return result;
  };

  function a(a, b) {
    console.log(this);
    this.a = 1;
  }

  a._apply({ a: 1, b: 2 }, [1, 3]);
})();

// bind
(() => {
  Function.prototype._bind = function (context, ...args) {
    const _this = this;
    context = new Object(context) || window;
    context.fn = this;
    return function F(...otherArgs) {
      let result = null;
      if (new.target) {
        return new _this(...args.concat(otherArgs));
      } else {
        result = context.fn(...args.concat(otherArgs));
      }
      Reflect.deleteProperty(context, 'fn');
      return result;
    };
  };
  function a() {
    console.log(this);
  }

  const self = a._bind({});
  new self();
  self();
})();
