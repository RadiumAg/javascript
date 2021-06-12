
function create (par = function () { }, ...args) {
  const create = Object.create(par.prototype);
  const res = par.apply(create, args);
  return res instanceof Object ? res : create;
}
