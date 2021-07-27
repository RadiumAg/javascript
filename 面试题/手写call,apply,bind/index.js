// call
/* eslint-disable no-extend-native */
(() => {
  Function.prototype._call = function (context, ...args) {
    let result = null;
    context = Object(context) || window;
    context.fn = this;
    result = context.fn(...args);
    Reflect.deleteProperty(context, 'fn');
    return result;
  };
  function a(a, b) {
  }
  a._call({}, 1, 2, 3);
})();

// apply
/* eslint-disable no-extend-native */
(() => {
  Function.prototype._apply = function (context, args = []) {
    let result = null;
    context = Object(context) || window;
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
/* eslint-disable no-extend-native */
(() => {
  function a() {
    console.log(this);
  }

  //   const d = a.bind({});
  //   new d();
  //   d();

  Function.prototype._bind = function (context, ...args) {
    const _this = this;
    context = Object(context) || window;
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

  const self = a._bind({});
  // eslint-disable-next-line new-cap
  new self();
  self();
})();
