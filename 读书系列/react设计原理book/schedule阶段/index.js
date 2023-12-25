"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scheduler_1 = require("scheduler");
var priority2UseList = [
    scheduler_1.unstable_ImmediatePriority,
    scheduler_1.unstable_UserBlockingPriority,
    scheduler_1.unstable_NormalPriority,
    scheduler_1.unstable_LowPriority,
];
var priority2Name = [
    'noop',
    'ImmediatePriority',
    'UserBlockingPriority',
    'NormalPriority',
    'LowPriority',
    'IdlePriority',
];
var workList = [];
var prevPriority = scheduler_1.unstable_IdlePriority;
var currentCallback;
var root = document.querySelector('#root');
var contentBox = document.querySelector('#content');
priority2UseList.forEach(function (priority) {
    var btn = document.createElement('button');
    root.append(btn);
    btn.textContent = priority2Name[priority];
    btn.addEventListener('click', function () {
        // 插入work
        workList.push({ priority: priority, count: 100 });
        schedule();
    });
});
function schedule() {
    var cbNode = (0, scheduler_1.unstable_getFirstCallbackNode)();
    var curWork = workList.sort(function (w1, w2) {
        return w1.priority - w2.priority;
    })[0];
    var curPriority = curWork.priority;
    if (curPriority === prevPriority) {
        // 有work在进行，比较该work与正在进行的work的优先级
        // 如果优先级相同，则退出调度
        return;
    }
    // 准备调度当前优先级最高的work
    // 调度之前，如果有work正在进行，则中断它
    cbNode && (0, scheduler_1.unstable_cancelCallback)(cbNode);
    // 调度当前优先级最高的work
    currentCallback = (0, scheduler_1.unstable_scheduleCallback)(curPriority, perform.bind(null, curWork));
}
// 执行具体的work
function perform(work, didTimeout) {
    // 是否需要同步执行，满足 1.work是同步优先级， 2. 当前调度的任务已过期，需要同步执行
    var needSync = work.priority === scheduler_1.unstable_ImmediatePriority || didTimeout;
    while ((needSync || !(0, scheduler_1.unstable_shouldYield)()) && work.count) {
        work.count--;
        // 执行具体的工作
        insertItem(work.priority.toString());
    }
    prevPriority = work.priority;
    if (!work.count) {
        // 从workList中删除已经完成的work
        var workIndex = workList.indexOf(work);
        workList.splice(workIndex, 1);
        // 重置优先级
        prevPriority = scheduler_1.unstable_IdlePriority;
    }
    var prevCallback = currentCallback;
    // 调度完成后，如果callback变化，代表这是新的work
    schedule();
    var newCallback = currentCallback;
    if (newCallback && prevCallback === newCallback) {
        // callback没变，代表是同一个work，只不过时间切片用尽
        // 返回的函数会被scheduler继续调用
        return perform.bind(null, work);
    }
}
var insertItem = function (content) {
    var ele = document.createElement('span');
    ele.textContent = "".concat(content);
    ele.className = "pri-".concat(content);
    doSomeBusyWork(10000000);
    contentBox.append(ele);
};
var doSomeBusyWork = function (len) {
    var result = 0;
    while (len--) {
        result += len;
    }
};
