function add(x) {
  let sum = x;

  function innerAdd(y) {
    sum += y;
    return innerAdd; // 返回自身以便链式调用
  }

  // 重写 valueOf 方法，使得在需要数字时返回累加值
  innerAdd.valueOf = function () {
    return sum;
  };

  // 也可以重写 toString 方法，使得在需要字符串时返回累加值
  innerAdd.toString = function () {
    return sum.toString();
  };

  return innerAdd;
}

// 测试
console.log(add(1)(2)); // 3
console.log(add(1)(2)(3)); // 6
console.log(add(1)(2)(3)(4)); // 10
