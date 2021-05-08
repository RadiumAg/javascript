function a () {}

function create (par = function () { }, ...args) {
  const create = Object.create(par.prototype);
  const res = par.apply(create, args);
  return res instanceof Object ? res : create;
}

console.log(create(a, 111));
