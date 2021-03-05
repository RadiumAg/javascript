const { toArray, size, rest, invoke } = require("underscore");

// 函数组合的精华
function dispatch() {
    let funs = toArray(arguments);
    let size = funs.length;

    return function (target) {
        let ret = undefined;
        let args = rest(arguments);

        for (let funIndex = 0; funIndex < size; funIndex++) {
            let fun = funs[funIndex];
            ret = fun.apply(fun, constuct (target, args));
            if (existy(ret)) return ret;
        }
        return ret;
    }
}

dispatch(invoke('toString',Array.prototype.toString))();