import { scheduleMicorTask } from 'hostConfig';
import {
  unstable_NormalPriority as NormalPriority,
  unstable_scheduleCallback as scheduleCallback,
  unstable_shouldYield,
} from 'scheduler';
import { beginWork } from './beginWork';
import {
  commitHookEffectListCreate,
  commitHookEffectListDestory,
  commitHookEffectListUnmount,
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

type RootExitStatus = number;
const RootInComplete = 1;
const RootCompleted = 2;
// TODO 执行过程中报错了

function prepareFreshStack(root: FiberRootNode, lane: Lane) {
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

function ensureRootIsSchedule(root: FiberRootNode) {
  const updateLane = getHighestPriorityLane(root.pendingLanes);
  if (updateLane === NoLane) {
    return;
  }

  if (updateLane === SyncLane) {
    // 同步优先级 用微任务调度
    if (__DEV__) {
      console.log('在微任务中调度，优先级', updateLane);
    }
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root, updateLane));
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
}

function performConcurrentWorkOnRoot(
  root: FiberRootNode,
  didTimeout: boolean,
): any {
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

  // 初始化
  const exitStatus = renderRoot(root, nextLanes, false);

  if (exitStatus === RootCompleted) {
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    root.finishedLane = nextLanes;
    wipRootRenderLane = NoLane;

    // wip fiberNode树 中的flags
    commitRoot(root);
  } else if (__DEV__) {
    console.error('还未实现的同步更新结束状态');
  }
}

function renderRoot(root: FiberRootNode, lane: Lane, shouldTimeSlice: boolean) {
  if (__DEV__) {
    console.log(`开始${shouldTimeSlice ? '并发' : '同步'}更新`, root);
  }

  if (wipRootRenderLane !== lane) {
    // 初始化
    prepareFreshStack(root, lane);
  }

  do {
    try {
      shouldTimeSlice ? workLoopConcurrent() : workLoopSync();
      break;
    } catch (e) {
      if (__DEV__) console.warn('workLoo发生错误', e);
      workInProgress = null;
    }
  } while (true);

  // 中断执行
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

  // 执行useEffect回调
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

  /**
   * 执行useEffect
   * @param pendingPassiveEffects
   */
  function flushPassiveEffects(pendingPassiveEffects: PendingPassiveEffects) {
    pendingPassiveEffects.unmount.forEach(effect => {
      commitHookEffectListUnmount(Passive, effect);
    });
    pendingPassiveEffects.unmount = [];

    pendingPassiveEffects.update.forEach(effect => {
      commitHookEffectListDestory(Passive | HookHasEffect, effect);
    });
    pendingPassiveEffects.update.forEach(effect => {
      commitHookEffectListCreate(Passive | HookHasEffect, effect);
    });
    pendingPassiveEffects.update = [];
    flushSyncCallbacks();
  }

  // 判断是否存在3个子阶段需要执行的操作
  // root flags root subtreeFlags
  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

  if (subtreeHasEffect || rootHasEffect) {
    // beforeMutation
    // mutation Placement
    commitMutationEffect(finishedWork, root);
    root.current = finishedWork;
    // layout
  } else {
    root.current = finishedWork;
  }

  rootDoesHasPassiveEffect = false;
  ensureRootIsSchedule(root);
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopConcurrent() {
  while (workInProgress !== null && !unstable_shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
/**
 * 创建执行执行单元
 *
 * @param {FiberNode} fiber
 */
function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber, wipRootRenderLane);
  fiber.memoizedProps = fiber.pendingProps;

  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

/**
 * 遍历兄弟节点
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
    workInProgress = node;
  } while (node !== null);
}
