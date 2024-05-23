() => {
  const x = 100;
  x.constructor;
  x['constructor'];
};

// 检测值类型数据，字面量与包装类的性质
(() => {
  Object.prototype.getSelf = function () {
    return this;
  };

  Object.prototype.getClass = function () {
    return this.constructor;
  };

  Object.prototype.getTypeof = function () {
    return typeof this;
  };

  Object.prototype.getInstanceof = function () {
    return this instanceof this.getClass();
  };

  const samples = ['', 100, true, function () {}, {}, [], /./];
})();
