// 声明变量会放到[[VarNames]]列表中，因此不能直接删除
// eslint-disable-next-line no-var
var x = 100;

// 泄漏的名字将导致全局创建了标识符y，但未添加到[[VarNames]]
y = '';

(() => {
  const canREmoveGlobalName = n => {
    console.log(global);
    return Object.getOwnPropertyDescriptor(global, n).configurable;
  };

  // 测试1
  console.log(canREmoveGlobalName('x')); // false
  console.log(canREmoveGlobalName('y')); // true
  console.log(canREmoveGlobalName('z')); // true

  // 测试2
  console.log(delete x);
  console.log(delete y);
  console.log(delete z);
})();
