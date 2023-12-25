import {
  CallbackNode,
  unstable_IdlePriority as IdlePriority,
  unstable_ImmediatePriority as ImmediatePriority,
  unstable_LowPriority as LowPriority,
  unstable_NormalPriority as NormalPriority,
  unstable_UserBlockingPriority as UserBlockingPriority,
  unstable_cancelCallback as cancelCallback,
  unstable_getFirstCallbackNode as getFirstCallbackNode,
  unstable_scheduleCallback as scheduleCallback,
  unstable_shouldYield as shouldYield,
} from 'scheduler';

type Priority =
  | typeof IdlePriority
  | typeof ImmediatePriority
  | typeof LowPriority
  | typeof NormalPriority
  | typeof UserBlockingPriority;

interface Work {
  priority: Priority;
  count: number;
}

const priority2UseList: Priority[] = [
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
];

const priority2Name = [
  'noop',
  'ImmediatePriority',
  'UserBlockingPriority',
  'NormalPriority',
  'LowPriority',
  'IdlePriority',
];

const workList: Work[] = [];
let prevPriority: Priority = IdlePriority;
let currentCallback: CallbackNode | null;
const root = document.querySelector('#root') as Element;
const contentBox = document.querySelector('#content') as Element;

priority2UseList.forEach(priority => {
  const btn = document.createElement('button');
  root.append(btn);
  btn.textContent = priority2Name[priority];

  btn.addEventListener('click', () => {
    // 插入work
    workList.push({ priority, count: 100 });
    schedule();
  });
});

function schedule() {
  const cbNode = getFirstCallbackNode();
  const curWork = workList.sort((w1, w2) => {
    return w1.priority - w2.priority;
  })[0];
  const { priority: curPriority } = curWork;

  if (curPriority === prevPriority) {
    // 有work在进行，比较该work与症状进行的work的优先级
    // 如果优先级相同，则退出调度
    return;
  }

  // 准备调度当前优先级最高的work
  // 调度之前，如果有work症状进行，则中断它
  cbNode && cancelCallback(cbNode);

  // 调度当前优先级最高的work
  currentCallback = scheduleCallback(curPriority, perform.bind(null, curWork));
}

// 执行具体的work
function perform(work: Work, didTimeout?: boolean): any {
  // 是否需要同步执行，满足 1.work是同步优先级， 2. 当前调度的任务已过期，需要同步执行
  const needSync = work.priority === ImmediatePriority || didTimeout;
  while ((needSync || !shouldYield()) && work.count) {
    work.count--;
    // 执行具体的工作
    insertItem(work.priority.toString());
  }

  prevPriority = work.priority;

  if (!work.count) {
    // 从workList中删除已经完成的work
    const workIndex = workList.indexOf(work);
    workList.splice(workIndex, 1);
    // 重置优先级
    prevPriority = IdlePriority;
  }

  const prevCallback = currentCallback;
  // 调度完成后，如果callback变化，代表这是新的work
  schedule();

  const newCallback = currentCallback;
  if (newCallback && prevCallback === newCallback) {
    // callback没变，代表是同一个work，只不过时间切片用尽
    // 返回的函数会被scheduler继续调用
    return perform.bind(null, work);
  }
}

const insertItem = (content: string) => {
  const ele = document.createElement('span');
  ele.innerText = `${content}`;
  ele.className = `pri-${content}`;
  doSomeBuzyWork(10000000);
  contentBox.append(ele);
};

const doSomeBuzyWork = (len: number) => {
  let result = 0;
  while (len--) {
    result += len;
  }
};
