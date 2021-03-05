const { toArray } = require('underscore');
// 柯里化函数：柯里化函数为每一个逻辑参数返回一个新函数

//手动柯里化
function rightAwayInvoker() {
    let args = toArray(arguments);
    let method = args.shift(); //删除第一个，并返回
    let target = args.shift();
    return method.apply(target, args);
}

console.log(rightAwayInvoker(Array.prototype.reverse, [1, 2, 3]));

//自动柯里化参数
function curry(fun) {
    return function (arg) {
        return fun(arg);
    }
}
// 接受有一个函数
// 返回一个只接受参数的函数