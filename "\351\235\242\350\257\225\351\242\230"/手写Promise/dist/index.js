var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _onFulFilledCallback, _onRejectedCallback;
function resolvePromise(result, self, resolve, reject) {
    if (result === self) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }
    if (typeof result === 'object' || typeof result === 'function') {
        if (result === null)
            return resolve(result);
        var then = void 0;
        try {
            then = result['then'];
        }
        catch (e) {
            return reject(e);
        }
        if (typeof then === 'function') {
            var called_1 = false;
            try {
                then.call(result, function (r) {
                    if (called_1)
                        return;
                    called_1 = true;
                    resolvePromise(result, r, resolve, reject);
                }, function (j) {
                    if (called_1)
                        return;
                    called_1 = true;
                    reject(j);
                });
            }
            catch (e) {
                if (called_1)
                    return;
                reject(e);
            }
        }
        else {
            resolve(result);
        }
    }
    else {
        resolve(result);
    }
}
var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        _onFulFilledCallback.set(this, []);
        _onRejectedCallback.set(this, []);
        this.PromiseState = 'pending';
        try {
            executor(this.resolve, this.reject);
        }
        catch (e) {
            this.reject(e);
        }
    }
    MyPromise.resolve = function (param) {
        if (param instanceof MyPromise) {
            return param;
        }
        return new MyPromise(function (resolve) {
            resolve(param);
        });
    };
    MyPromise.reject = function (param) {
        if (param instanceof MyPromise) {
            return param;
        }
        return new MyPromise(function (resolve, reject) {
            reject(param);
        });
    };
    MyPromise.prototype.resolve = function (result) {
        var _a;
        if (this.PromiseState !== 'pending')
            return;
        this.PromiseResult = result;
        this.PromiseState = 'fulfilled';
        // fetch resolve
        while (__classPrivateFieldGet(this, _onFulFilledCallback).length > 0) {
            (_a = __classPrivateFieldGet(this, _onFulFilledCallback).shift()) === null || _a === void 0 ? void 0 : _a(result);
        }
    };
    MyPromise.prototype.reject = function (reason) {
        var _a;
        if (this.PromiseState !== 'pending')
            return;
        this.PromiseResult = reason;
        this.PromiseState = 'rejected';
        // fetch reject
        while (__classPrivateFieldGet(this, _onFulFilledCallback).length > 0) {
            (_a = __classPrivateFieldGet(this, _onRejectedCallback).shift()) === null || _a === void 0 ? void 0 : _a(reason);
        }
    };
    // then之后返回一个新值
    MyPromise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (result) { return result; };
        onRejected = typeof onRejected === 'function' ? onFulfilled : function (reason) { throw reason; };
        if (onFulfilled === undefined) {
            console.log('1');
        }
        var newPromise = new MyPromise(function (resolve, reject) {
            var fullQueueMicrotask = function () {
                queueMicrotask(function () {
                    try {
                        var res = onFulfilled(_this.PromiseResult);
                        resolvePromise(res, newPromise, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            };
            var rejectedQueueMicrotask = function () {
                queueMicrotask(function () {
                    try {
                        var reason = onRejected(_this.PromiseResult);
                        resolvePromise(reason, newPromise, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            };
            if (_this.PromiseState === 'fulfilled') {
                fullQueueMicrotask();
            }
            else if (_this.PromiseState === 'rejected') {
                rejectedQueueMicrotask();
            }
            else if (_this.PromiseState === 'pending') {
                __classPrivateFieldGet(_this, _onFulFilledCallback).push(fullQueueMicrotask);
                __classPrivateFieldGet(_this, _onRejectedCallback).push(rejectedQueueMicrotask);
            }
        });
        return newPromise;
    };
    return MyPromise;
}());
_onFulFilledCallback = new WeakMap(), _onRejectedCallback = new WeakMap();
MyPromise.deferred = function () {
    var result = {};
    result.promise = new MyPromise(function (resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
};
module.exports = MyPromise;
