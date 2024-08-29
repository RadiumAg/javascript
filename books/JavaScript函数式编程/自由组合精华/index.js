const { toArray, size, rest, invoke } = require('underscore');

// 函数组合的精华
function dispatch() {
  const funs = toArray(arguments);
  const size = funs.length;

  return function (target) {
    let ret = undefined;
    const args = rest(arguments);

    for (let funIndex = 0; funIndex < size; funIndex++) {
      const fun = funs[funIndex];
      ret = fun.apply(fun, constuct(target, args));
      if (existy(ret)) return ret;
    }
    return ret;
  };
}

dispatch(invoke('toString', Array.prototype.toString))();
