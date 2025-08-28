import {
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  Priority,
} from '../types/constants.ts';

const __DEV__ = process.env.NODE_ENV !== 'production';

// 时间切片相关常量
const IMMEDIATE_PRIORITY_TIMEOUT = -1;
const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
const NORMAL_PRIORITY_TIMEOUT = 5000;
const LOW_PRIORITY_TIMEOUT = 10000;
const IDLE_PRIORITY_TIMEOUT = 1073741823; // Never times out

// 最大时间切片
const maxYieldInterval = 5;
const maxEventLoopYield = 300;
let deadline = 0;

// 任务类型定义
export interface Task {
  id: number;
  callback: TaskCallback | null;
  priorityLevel: Priority;
  startTime: number;
  expirationTime: number;
  sortIndex: number;
  isQueued?: boolean;
}

export type TaskCallback = (didTimeout: boolean) => TaskCallback | null | void;

interface ScheduleOptions {
  delay?: number;
}

// 任务队列
let taskQueue: Task[] = [];
let timerQueue: Task[] = [];
let taskIdCounter = 1;

// 调度器状态
let isSchedulerPaused = false;
let currentTask: Task | null = null;
let currentPriorityLevel: Priority = NormalPriority;
let isPerformingWork = false;
let isHostCallbackScheduled = false;
let isHostTimeoutScheduled = false;

// 性能API
const getCurrentTime = (() => {
  if (typeof performance === 'object' && typeof performance.now === 'function') {
    return (): number => performance.now();
  } else {
    const initialTime = Date.now();
    return (): number => Date.now() - initialTime;
  }
})();

/**
 * 调度回调函数
 */
export function scheduleCallback(
  priorityLevel: Priority, 
  callback: TaskCallback, 
  options?: ScheduleOptions
): Task {
  const currentTime = getCurrentTime();

  let startTime: number;
  if (typeof options === 'object' && options !== null) {
    const delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  let timeout: number;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  const expirationTime = startTime + timeout;

  const newTask: Task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };

  if (__DEV__) {
    newTask.isQueued = false;
  }

  if (startTime > currentTime) {
    // 这是一个延迟任务
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // 所有任务都被延迟，这是最早的任务
      if (isHostTimeoutScheduled) {
        // 取消现有的超时
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // 安排超时
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    if (__DEV__) {
      newTask.isQueued = true;
    }
    // 安排主机回调
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

/**
 * 取消回调
 */
export function cancelCallback(task: Task): void {
  if (__DEV__) {
    if (task.isQueued) {
      task.isQueued = false;
    }
  }
  // 通过将回调设为null来取消任务
  task.callback = null;
}

/**
 * 获取当前优先级
 */
export function getCurrentPriorityLevel(): Priority {
  return currentPriorityLevel;
}

/**
 * 应该让出控制权
 */
export function shouldYieldToHost(): boolean {
  const timeElapsed = getCurrentTime() - deadline;
  if (timeElapsed < maxYieldInterval) {
    return false;
  }

  return true;
}

/**
 * 请求绘制
 */
export function requestPaint(): void {
  // 由于我们已经让出了主线程，画笔将在下一个事件循环中执行
}

/**
 * 以优先级运行
 */
export function runWithPriority<T>(priorityLevel: Priority, eventHandler: () => T): T {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }

  const previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

/**
 * 刷新工作
 */
function flushWork(hasTimeRemaining: boolean, initialTime: number): boolean {
  if (__DEV__) {
    if (isHostCallbackScheduled) {
      isHostCallbackScheduled = false;
    } else {
      console.error(
        'flushWork was called when isHostCallbackScheduled was false. This ' +
          'is a bug in Scheduler.'
      );
    }
  }

  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
    if (__DEV__) {
      const currentTime = getCurrentTime();
      advanceTimers(currentTime);
      if (peek(taskQueue) !== null) {
        console.error(
          'Work stopped but there are still tasks in the queue. ' +
            'This is a bug in Scheduler.'
        );
      }
    }
  }
}

/**
 * 工作循环
 */
function workLoop(hasTimeRemaining: boolean, initialTime: number): boolean {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);
  
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 当前任务还未过期，但我们已经用完了时间切片
      break;
    }
    
    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      
      if (__DEV__) {
        markTaskStart(currentTask, currentTime);
      }
      
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      
      if (__DEV__) {
        markTaskCompleted(currentTask, currentTime);
        currentTask.isQueued = false;
      }
      
      if (typeof continuationCallback === 'function') {
        // 产生了一个延续回调
        currentTask.callback = continuationCallback;
        if (__DEV__) {
          currentTask.isQueued = true;
          if (enableProfiling) {
            markTaskYield(currentTask, currentTime);
          }
        }
      } else {
        if (__DEV__) {
          if (currentTask === peek(taskQueue)) {
            console.error(
              'A task function returned but the task queue did not advance. ' +
                'This is a bug in Scheduler.'
            );
          }
        }
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  
  // 返回是否还有更多工作
  if (currentTask !== null) {
    return true;
  } else {
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}

/**
 * 推进计时器
 */
function advanceTimers(currentTime: number): void {
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      // 定时器被取消了
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // 定时器启动了，添加到任务队列
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
      if (__DEV__) {
        if (isHostCallbackScheduled && peek(taskQueue) === timer) {
          timer.isQueued = true;
        }
      }
    } else {
      // 剩余的定时器都还未启动
      return;
    }
    timer = peek(timerQueue);
  }
}

/**
 * 处理超时
 */
function handleTimeout(currentTime: number): void {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      const firstTimer = peek(timerQueue);
      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

// 最小堆实现
function push(heap: Task[], node: Task): void {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

function peek(heap: Task[]): Task | null {
  return heap.length === 0 ? null : heap[0];
}

function pop(heap: Task[]): Task | null {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop()!;
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
}

function siftUp(heap: Task[], node: Task, i: number): void {
  let index = i;
  while (index > 0) {
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // 父节点比较大，交换
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // 父节点比较小，停止
      return;
    }
  }
}

function siftDown(heap: Task[], node: Task, i: number): void {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // 如果左子节点小于父节点
    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // 都不小于父节点
      return;
    }
  }
}

function compare(a: Task, b: Task): number {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

let requestHostCallback: (callback: HostCallback) => void;
let requestHostTimeout: (callback: TimeoutCallback, ms: number) => void;
let cancelHostTimeout: () => void;

if (typeof globalThis !== 'undefined' && typeof globalThis.MessageChannel !== 'undefined') {
  // DOM和Web Worker环境
  const channel = new globalThis.MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;

  requestHostCallback = function(callback: HostCallback) {
    scheduledHostCallback = callback;
    if (!isMessageLoopRunning) {
      isMessageLoopRunning = true;
      port.postMessage(null);
    }
  };

  requestHostTimeout = function(callback: TimeoutCallback, ms: number) {
    taskTimeoutID = setTimeout(() => {
      callback(getCurrentTime());
    }, ms) as any;
  };

  cancelHostTimeout = function() {
    clearTimeout(taskTimeoutID as any);
    taskTimeoutID = -1;
  };
} else {
  // Node.js环境
  requestHostCallback = function(callback: HostCallback) {
    if (scheduledHostCallback !== null) {
      setTimeout(requestHostCallback, 0, callback);
    } else {
      scheduledHostCallback = callback;
      setTimeout(performWorkUntilDeadline, 0);
    }
  };

  requestHostTimeout = function(callback: TimeoutCallback, ms: number) {
    taskTimeoutID = setTimeout(() => {
      callback(getCurrentTime());
    }, ms) as any;
  };

  cancelHostTimeout = function() {
    clearTimeout(taskTimeoutID as any);
    taskTimeoutID = -1;
  };
}

// 主机回调调度
type HostCallback = (hasTimeRemaining: boolean, currentTime: number) => boolean;
type TimeoutCallback = (currentTime: number) => void;

let scheduledHostCallback: HostCallback | null = null;
let isMessageLoopRunning = false;
let taskTimeoutID: any = -1;

function performWorkUntilDeadline(): void {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    deadline = currentTime + maxYieldInterval;
    const hasTimeRemaining = true;

    let hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        // 如果还有工作要做，继续调度
        if (typeof globalThis !== 'undefined' && typeof globalThis.MessageChannel !== 'undefined') {
          const channel = new globalThis.MessageChannel();
          const port = channel.port2;
          port.postMessage(null);
        } else {
          setTimeout(performWorkUntilDeadline, 0);
        }
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
}

// 调试相关
const enableSchedulerDebugging = false;
const enableProfiling = __DEV__;

function markTaskStart(task: Task, ms: number): void {}
function markTaskCompleted(task: Task, ms: number): void {}
function markTaskYield(task: Task, ms: number): void {}