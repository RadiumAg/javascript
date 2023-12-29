import { scheduleMicroTask } from 'hostConfig';
import {
  unstable_NormalPriority as NormalPriority,
  unstable_scheduleCallback as scheduleCallback,
  unstable_cancelCallback,
  unstable_shouldYield,
} from 'scheduler';
import { beginWork } from './beginWork';
import { commitLayoutEffects, commitMutationEffect } from './commitWork';
import { completeWork } from './completeWork';
import {
  FiberNode,
  FiberRootNode,
  PendingPassiveEffects,
  createWorkInProgress,
} from './fiber';
import { Flags, MutationMask, NoFlags, PassiveMask } from './fiberFlags';
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
import { HostRoot } from './workTags';
import { Effect } from './fiberHooks';
import { HookHasEffect, Passive } from './hookEffectTag';

let workInProgress: FiberNode | null = null;
let wipRootRenderLane: Lane = NoLane;
let rootDoesHasPassiveEffect = false;

// 并发中间状态
const RootInComplete = 1;
// 完成状态
const RootCompleted = 2;

function prepareFreshStack(root: FiberRootNode, lane: Lane) {
  root.finishedLane = NoLane;
  root.finishedWork = null;
  workInProgress = createWorkInProgress(root.current, {});
  wipRootRenderLane = lane;
}

function scheduleUpdateOnFiber(fiber: FiberNode, lane: Lane) {
  // 调度功能
  const root = markUpdateFromFiberToRoot(fiber);
  markRootUpdated(root, lane);
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root: FiberRootNode) {
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
  let newCallbackNode = null;

  if (updateLane === SyncLane) {
    // 同步优先级 用微任务调度
    if (__DEV__) {
      console.log('在微任务中调度，优先级', updateLane);
    }
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root, updateLane));
    scheduleMicroTask(flushSyncCallbacks);
  } else {
    // 其它优先级 用宏任务调度
    const schedulePriority = lanesToSchedulePriority(updateLane);
    newCallbackNode = scheduleCallback(
      schedulePriority,
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
  // 保证useEffect已经执行
  const curCallback = root.callbackNode;
  const didFlushPassiveEffect = flushPassiveEffect(root.pendingPassiveEffect);
  if (didFlushPassiveEffect && root.callbackNode !== curCallback) {
    return null;
  }

  const lane = getHighestPriorityLane(root.pendingLanes);
  const curCallbackNode = root.callbackNode;
  if (lane === NoLane) {
    return null;
  }
  const needSync = lane === SyncLane || didTimeout;
  // render阶段
  const exitStatus = renderRoot(root, lane, !needSync) as unknown as number;
  ensureRootIsScheduled(root);
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
    console.error('还未实现并发更新结束状态');
  }
}

function renderRoot(root: FiberRootNode, lane: Lane, shouldTimeSlice: boolean) {
  if (__DEV__) {
    console.log(`开始${shouldTimeSlice ? '并发' : '同步'}更新`);
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
      if (__DEV__) {
        console.warn('workLoop发生错误', e);
      }
      workInProgress = null;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  return RootCompleted;
}

function markRootUpdated(root: FiberRootNode, lane: Lane) {
  root.pendingLanes = mergeLanes(root.pendingLanes, lane);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }

  if (node.tag === HostRoot) {
    return node.stateNode;
  }

  return null;
}

function performSyncWorkOnRoot(root: FiberRootNode, lane: Lane) {
  const nextLanes = getHighestPriorityLane(root.pendingLanes);
  if (nextLanes !== SyncLane) {
    // 其他比SyncLane低的优先级
    // NoLane
    ensureRootIsScheduled(root);
    return;
  }

  // 初始化
  prepareFreshStack(root, lane);

  const exitStatus = renderRoot(root, nextLanes, false) as unknown as number;

  if (exitStatus === RootCompleted) {
    const finishWork = root.current.alternate;
    root.finishedWork = finishWork;
    root.finishedLane = lane;
    wipRootRenderLane = NoLane;

    commitRoot(root);
  }
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }
  if (__DEV__) {
    console.log('commit阶段开始', finishedWork);
  }
  const lane = root.finishedLane;
  if (lane === NoLane && __DEV__) {
    console.error('commit阶段finishedLane不应该是NoLane');
  }
  // 重置
  root.finishedWork = null;
  root.finishedLane = NoLane;
  markRootFinished(root, lane);
  if (
    (finishedWork.flags & PassiveMask) !== NoFlags ||
    (finishedWork.subtreeFlags & PassiveMask) !== NoFlags
  ) {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (!rootDoesHasPassiveEffect) {
      rootDoesHasPassiveEffect = true;
      // 调度副作用
      scheduleCallback(NormalPriority, () => {
        // 执行副作用
        flushPassiveEffect(root.pendingPassiveEffect);
        return;
      });
    }
  }

  // 判断是否存在3个子阶段需要执行的操作
  const subtreeHasEffect =
    (finishedWork.subtreeFlags & (MutationMask | PassiveMask)) !== NoFlags;
  const rootHostEffect =
    (finishedWork.flags & (MutationMask | PassiveMask)) !== NoFlags;

  if (subtreeHasEffect || rootHostEffect) {
    // beforeMution
    // mutation Placement
    commitMutationEffect(finishedWork, root);
    root.current = finishedWork;
    commitLayoutEffects(finishedWork, root);
    // layout
  } else {
    root.current = finishedWork;
  }

  rootDoesHasPassiveEffect = false;
  ensureRootIsScheduled(root);
}

function commitHookEffectList(
  flags: Flags,
  lastEffect: Effect,
  callback: (effect: Effect) => void,
) {
  let effect = lastEffect.next as Effect;

  do {
    if ((effect.tag & flags) === flags) {
      callback(effect);
    }

    effect = effect.next as Effect;
  } while (effect !== lastEffect.next);
}

function commitHookEffectListUnmount(flags: Flags, lastEffect: Effect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const destory = effect.destory;

    if (typeof destory === 'function') {
      destory();
    }

    effect.tag &= ~HookHasEffect;
  });
}

function commitHookEffectListDestory(flags: Flags, lastEffect: Effect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const destory = effect.destory;

    if (typeof destory === 'function') {
      destory();
    }
  });
}

function commitHookEffectListCreate(flags: Flags, lastEffect: Effect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const create = effect.create;

    if (typeof create === 'function') {
      effect.destory = create();
    }
  });
}

function flushPassiveEffect(pendingPassiveEffects: PendingPassiveEffects) {
  let didFlushPassiveEffect = false;

  pendingPassiveEffects.unmount.forEach(effect => {
    didFlushPassiveEffect = true;
    commitHookEffectListUnmount(Passive, effect);
  });
  pendingPassiveEffects.unmount = [];

  pendingPassiveEffects.update.forEach(effect => {
    didFlushPassiveEffect = true;
    commitHookEffectListDestory(Passive | HookHasEffect, effect);
  });

  pendingPassiveEffects.update.forEach(effect => {
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

function workLoopConcurrent() {
  while (workInProgress !== null && !unstable_shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber, wipRootRenderLane);
  fiber.memoizedProps = fiber.pedingProps;
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  do {
    completeWork(node);
    const sibling = node.sibling;

    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return;
    workInProgress = null;
  } while (node !== null);
}

export { scheduleUpdateOnFiber };
