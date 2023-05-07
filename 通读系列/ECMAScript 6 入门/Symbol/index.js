// 作为属性名的Symbol ,所以说属性名可以是symbol 和 string
(() => {
  const mySymbol = Symbol();
  const a = {
    [mySymbol]: 'Hello!',
  };
})();

// 消除魔术字符串
(() => {
  const shapeType = {
    triangle: Symbol(),
  };

  function getArea(shape, options) {
    let area = 0;

    switch (shape) {
      case shapeType.triangle:
        area = 0.5 * options.width * options.height;
        break;
    }

    return area;
  }

  getArea(shapeType.triangle, { width: 100, height: 100 });
})();
