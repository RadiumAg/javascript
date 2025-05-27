var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Context = /** @class */ (function () {
    function Context(state) {
    }
    Context.prototype.transistionTo = function (state) {
        console.log("Context: Transition to " + state.constructor.name);
        this.state = state;
        this.state.setContext(this);
    };
    /**
     * The Context delegates part of its behavior to the current State object
     *
     */
    Context.prototype.request1 = function () {
        this.state.handle1();
    };
    Context.prototype.request2 = function () {
        this.state.handle2();
    };
    return Context;
}());
var State = /** @class */ (function () {
    function State() {
    }
    State.prototype.setContext = function (context) {
        this.context = context;
    };
    return State;
}());
var CooncreteState = /** @class */ (function (_super) {
    __extends(CooncreteState, _super);
    function CooncreteState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CooncreteState.prototype.handle1 = function () {
        throw new Error('Method not implemented.');
    };
    CooncreteState.prototype.handle2 = function () {
        throw new Error('Method not implemented.');
    };
    return CooncreteState;
}(State));
