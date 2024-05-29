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

  // 样本：添加符号作为特例（不支持字面量）
  samples.push(Symbol());

  // 取特性
  const getAttr = (v, v2, cls) => {
    return [typeof v, v2.getTypeof(), v instanceof cls, v2.getInstanceof()];
  };

  // 检测
  samples
    .map(v => [typeof v, getAttr(v, v.getSelf(), v.getClass())])
    .forEach(([metaName, attr]) => {
      console.log(metaName, ':', attr);
    });
})();

// 到undefined值的显式处理
(() => {
  console.log(void 0);
})();
