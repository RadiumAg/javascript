function a(){}

function create(par = function () { }, ...args) {
    let create = Object.create(par.prototype);
    let res = par.apply(create, args);
    return res instanceof Object ? res : create;
}

console.log(create(a,111));