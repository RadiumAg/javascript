var _a;
var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        this.PromiseState = 'pending';
        executor(this.resolve.bind(this), this.reject.bind(this));
    }
    MyPromise.prototype.resolve = function (result) {
        this.PromiseResult = result;
        this.PromiseState = 'fulfilled';
    };
    MyPromise.prototype.reject = function (reason) {
        this.PromiseResult = reason;
        this.PromiseState = 'fulfilled';
    };
    MyPromise.prototype.then = function (successFn, failFn) {
        if (this.PromiseState === 'fulfilled') {
            var res_1 = successFn(this.PromiseResult);
            return new MyPromise(function (resolve) {
                resolve(res_1);
            });
        }
        else if (this.PromiseState === 'rejected') {
            var reason_1 = failFn === null || failFn === void 0 ? void 0 : failFn(this.PromiseResult);
            return new MyPromise(function (resolve, reject) {
                reject(reason_1);
            });
        }
    };
    MyPromise.prototype["catch"] = function (fn) { };
    return MyPromise;
}());
console.log((_a = new MyPromise(function (resolve) {
    resolve(2);
})
    .then(function (result) {
    return 1;
})) === null || _a === void 0 ? void 0 : _a.then(function () { }));
MyPromise.deferred = function () {
    var result = {
        promise: undefined,
        resolve: undefined,
        reject: undefined
    };
    result.promise = new MyPromise(function (resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
};
module.exports = MyPromise;
