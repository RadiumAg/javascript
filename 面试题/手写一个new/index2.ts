/* eslint-disable prefer-arrow-callback */
// new
interface Func {
  new (...args: any[]): any;
}
function create1(fun: Func, ...params: any[]) {
  // 用构造函数的prototype属性创建对象
  const target = Object.create(fun.prototype);
  const result = fun.call(target, ...params);

  return typeof result === 'object' || typeof result === 'function'
    ? result
    : target;
}

const p1 = create1(function a() {}, 1212, 12121);

console.log(p1);
