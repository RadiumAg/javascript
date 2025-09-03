import { scheduleMicorTask } from 'hostConfig';
import {
  unstable_NormalPriority as NormalPriority,
  unstable_scheduleCallback as scheduleCallback,
  unstable_cancelCallback,
  unstable_shouldYield,
} from 'scheduler';
import { beginWork } from './beginWork';
import {
  commitHookEffectListCreate,
  commitHookEffectListDestory,
  commitHookEffectListUnmount,
  commitLayoutEffect,
  commitMutationEffect,
} from './commitWork';
import { completeWork } from './completeWork';
import { MutationMask, NoFlags, PassiveMask } from './fiberFlags';
import {
  FiberNode,
  FiberRootNode,
  PendingPassiveEffects,
  createWorkInProgress,
} from './fiber';
import { HostRoot } from './workTags';
import {
  Lane,
  NoLane,
  SyncLane,
  getHighestPriorityLane,
  lanesToSchedulePriority,
  markRootFinished,
  mergeLanes,
} from './fiberLanes';
import { flushSyncCallbacks, scheduleSyncCallback } from './syncTaskQueue';
import { HookHasEffect, Passive } from './hookEffectTags';

let workInProgress: FiberNode | null = null;
let wipRootRenderLane: Lane = NoLane;
let rootDoesHasPassiveEffect = false;

const RootInComplete = 1;
const RootCompleted = 2;
// TODO 执行过程中报错了

function prepareFreshStack(root: FiberRootNode, lane: Lane) {
  root.finishedLane = NoLane;
  root.finishedWork = null;
  // current指向hostRootFiber
  workInProgress = createWorkInProgress(root.current, {});
  wipRootRenderLane = lane;
}

export function scheduleUpdateOnFiber(fiber: FiberNode, lane: Lane) {
  // 调度功能
  const root = markUpdateFromFiberToRoot(fiber);
  markRootUpdated(root, lane);
  ensureRootIsSchedule(root);
}

/**
 * 将本次更新的lane记录在FiberRoot上
 *
 * @param {FiberRootNode} root
 * @param {Lane} lane
 */
function markRootUpdated(root: FiberRootNode, lane: Lane) {
  root.pendingLanes = mergeLanes(root.pendingLanes, lane);
}

/**
 * 开始工作
 *
 * @param {FiberRootNode} root
 * @return {*}
 */
function ensureRootIsSchedule(root: FiberRootNode) {
  const updateLane = getHighestPriorityLane(root.pendingLanes);
  const existingCallback = root.callbackNode;

  if (updateLane === NoLane) {
    if (existingCallback !== null) {
      unstable_cancelCallback(existingCallback);
    }
    root.callbackNode = null;
    root.callbackPriority = NoLane;
    return;
  }

  const curPriority = updateLane;
  const prevPriority = root.callbackPriority;

  if (curPriority === prevPriority) {
    return;
  }

  if (existingCallback !== null) {
    unstable_cancelCallback(existingCallback);
  }

  const newCallbackNode = null;
  if (__DEV__) {
    console.log(
      `在${updateLane === SyncLane ? '微' : '宏'}任务中调度，优先级`,
      updateLane,
    );
  }

  if (updateLane === SyncLane) {
    // 同步优先级 用微任务调度
    // 推入到syncQueue
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    scheduleMicorTask(flushSyncCallbacks);
  } else {
    // 其它优先级 用宏任务调度
    const schedulePriority = lanesToSchedulePriority(updateLane);

    scheduleCallback(
      schedulePriority,
      // @ts-ignore
      performConcurrentWorkOnRoot.bind(null, root),
    );
  }

  root.callbackNode = newCallbackNode;
  root.callbackPriority = curPriority;
}

function performConcurrentWorkOnRoot(
  root: FiberRootNode,
  didTimeout: boolean,
): any {
  //  保证useEffect回调执行
  const curCallback = root.callbackNode;
  const didFlushPassiveEffect = flushPassiveEffects(root.pendingPassiveEffects);
  if (didFlushPassiveEffect && root.callbackNode !== curCallback) {
    return null;
  }

  const lane = getHighestPriorityLane(root.pendingLanes);
  const curCallbackNode = root.callbackNode;

  if (lane === NoLane) {
    return null;
  }
  const needSync = lane === SyncLane || didTimeout;
  // render 阶段
  const exitStatus = renderRoot(root, lane, !needSync);

  ensureRootIsSchedule(root);

  if (exitStatus === RootInComplete) {
    // 中断
    // eslint-disable-next-line unicorn/no-lonely-if
    if (root.callbackNode !== curCallbackNode) {
      return null;
    }
    return performConcurrentWorkOnRoot.bind(null, root);
  }

  if (exitStatus === RootCompleted) {
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    root.finishedLane = lane;
    wipRootRenderLane = NoLane;

    commitRoot(root);
  } else if (__DEV__) {
    console.error('还未实现的并发更新结束状态');
  }
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }

  // 一直向上遍历到FiberRootNode
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}

function performSyncWorkOnRoot(root: FiberRootNode) {
  const nextLanes = getHighestPriorityLane(root.pendingLanes);

  if (nextLanes !== SyncLane) {
    // 其它比SyncLane低的优先级
    // NoLane
    ensureRootIsSchedule(root);
    return;
  }

  // 退出状态
  const exitStatus = renderRoot(root, nextLanes, false);

  if (exitStatus === RootCompleted) {
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    root.finishedLane = nextLanes;
    wipRootRenderLane = NoLane;

    // commit 阶段
    // wip fiberNode树 中的flags
    commitRoot(root);
  } else if (__DEV__) {
    console.error('还未实现的同步更新结束状态');
  }
}

/**
 * 开始workloop
 *
 * @param {FiberRootNode} root
 * @param {Lane} lane
 * @param {boolean} shouldTimeSlice
 * @return {*}
 */
function renderRoot(root: FiberRootNode, lane: Lane, shouldTimeSlice: boolean) {
  if (__DEV__) {
    console.log(`开始${shouldTimeSlice ? '并发' : '同步'}更新`, root);
  }

  if (wipRootRenderLane !== lane) {
    // 初始化第一个workInProgress
    prepareFreshStack(root, lane);
  }

  // 第一个循环
  do {
    try {
      shouldTimeSlice ? workLoopConcurrent() : workLoopSync();
      break;
    } catch (e) {
      if (__DEV__) console.warn('workLoo发生错误', e);
      workInProgress = null;
    }
  } while (true);

  // 并发更新中断执行，没有执行完，时间到了
  if (shouldTimeSlice && workInProgress !== null) {
    return RootInComplete;
  }

  // render阶段执行完
  if (!shouldTimeSlice && workInProgress !== null && __DEV__) {
    console.error('render阶段结束时wip不应该不是null');
  }

  // TODO 报错
  return RootCompleted;
}

/**
 * 开始更改操作
 *
 * @param {FiberRootNode} root
 * @return {*}
 */
function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }
  if (__DEV__) {
    console.warn('commit阶段开始', finishedWork);
  }
  const lane = root.finishedLane;

  if (lane === NoLane && __DEV__) {
    console.error('commit阶段finishedLane不应该是NoLane');
  }
  // 重置
  root.finishedWork = null;
  root.finishedLane = NoLane;

  markRootFinished(root, lane);

  // 执行useEffect回调，是异步的，会在commitMutationEffect完成后执行
  if (
    ((finishedWork.flags & PassiveMask) !== NoFlags ||
      (finishedWork.subtreeFlags & PassiveMask) !== NoFlags) &&
    !rootDoesHasPassiveEffect
  ) {
    rootDoesHasPassiveEffect = true;
    // 调度副作用
    scheduleCallback(NormalPriority, () => {
      // 执行副作用
      flushPassiveEffects(root.pendingPassiveEffects);
      return;
    });
  }

  // 判断是否存在3个子阶段需要执行的操作
  // root flags root subtreeFlags
  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

  if (subtreeHasEffect || rootHasEffect) {
    // beforeMutation

    // mutation
    // 更新 dom
    commitMutationEffect(finishedWork, root);
 
    // Fiber Tree切换
    root.current = finishedWork;

    // 阶段3 layout
    // 更新Ref Dom
    commitLayoutEffect(finishedWork, root);
  } else {
    root.current = finishedWork;
  }

  rootDoesHasPassiveEffect = false;
  ensureRootIsSchedule(root);
}

/**
 * 执行useEffect
 * @param pendingPassiveEffects
 */
export function flushPassiveEffects(
  pendingPassiveEffects: PendingPassiveEffects,
) {
  let didFlushPassiveEffect = false;
  pendingPassiveEffects.unmount.forEach((effect) => {
    didFlushPassiveEffect = true;
    commitHookEffectListUnmount(Passive, effect);
  });
  pendingPassiveEffects.unmount = [];

  pendingPassiveEffects.update.forEach((effect) => {
    didFlushPassiveEffect = true;
    commitHookEffectListDestory(Passive | HookHasEffect, effect);
  });
  pendingPassiveEffects.update.forEach((effect) => {
    didFlushPassiveEffect = true;
    commitHookEffectListCreate(Passive | HookHasEffect, effect);
  });
  pendingPassiveEffects.update = [];
  flushSyncCallbacks();
  return didFlushPassiveEffect;
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 并发更行，如果时间到了就退出
 *
 */
function workLoopConcurrent() {
  while (workInProgress !== null && !unstable_shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 创建执行执行单元，mount时递归创建子Fiber
 *
 * @param {FiberNode} fiber
 */
function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber, wipRootRenderLane);
  fiber.memoizedProps = fiber.pendingProps;

  if (next === null) {
    // 最终是子Fiber
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

/**
 * 每次构造一条链，然后处理completeWork
 *
 * @param fiber
 */
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  do {
    completeWork(node);
    const sibing = node.sibling;

    if (sibing !== null) {
      workInProgress = sibing;
      return;
    }
    node = node.return;
    // 再次赋值，遵从child, sibling, return 的顺序
    workInProgress = node;
  } while (node !== null);
}
