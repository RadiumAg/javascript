import {
  scheduleCallback,
  cancelCallback,
  shouldYieldToHost,
  requestPaint,
  getCurrentPriorityLevel,
  runWithPriority,
} from '../scheduler/Scheduler.ts';

import {
  lanesToSchedulerPriority,
  schedulerPriorityToLanePriority,
  getCurrentUpdatePriority,
  setCurrentUpdatePriority,
  mergeLanes,
  removeLanes,
  getHighestPriorityLane,
  includesSomeLane,
  DefaultLane,
  shouldTimeSlice,
  markSkippedUpdateLanes,
  getSkippedLanes,
  resetSkippedLanes,
} from '../scheduler/SchedulerPriorities.ts';

import {
  createWorkInProgress,
} from '../types/Fiber.ts';

import {
  HostRoot,
  NoFlags,
  MutationMask,
  PassiveMask,
  LayoutMask,
  NoMode,
  ConcurrentMode,
  NormalPriority,
  NoLane,
  SyncLane,
  NoLanes
} from '../types/constants.ts';

// 全局状态
let workInProgressRoot = null;
let workInProgress = null;
let workInProgressRootRenderLanes = NoLane;

// 执行上下文
const NoContext = 0b000;
const BatchedContext = 0b001;
const RenderContext = 0b010;
const CommitContext = 0b100;
let executionContext = NoContext;

// 工作状态
const RootInProgress = 0;
const RootFatalErrored = 1;
const RootErrored = 2;
const RootSuspended = 3;
const RootSuspendedWithDelay = 4;
const RootCompleted = 5;
const RootDidNotComplete = 6;

let workInProgressRootExitStatus = RootInProgress;

// 调度回调
let rootDoesHavePassiveEffects = false;
let rootWithPendingPassiveEffects = null;
let pendingPassiveEffectsLanes = NoLanes;

// 中断状态
let workInProgressRootDidAttachPingListener = false;
let entangledRenderLanes = NoLanes;

/**
 * 调度根更新
 */
export function scheduleUpdateOnFiber(root, fiber, lane, eventTime) {
  // 标记根节点有待处理的更新
  markRootUpdated(root, lane, eventTime);

  if (
    (executionContext & RenderContext) !== NoLanes &&
    root === workInProgressRoot
  ) {
    // 我们正在渲染树，这是一个嵌套的更新
    // 跟踪嵌套的更新以便以后处理
    workInProgressRootDidAttachPingListener = true;
  } else {
    // 这是一个正常的更新，不是嵌套的
    warnIfUpdatesNotWrappedWithActDEV(fiber);

    if (root === workInProgressRoot) {
      // 收到了对当前正在渲染的树的更新
      if ((executionContext & RenderContext) === NoContext) {
        workInProgressRootInterleavedUpdatedLanes = mergeLanes(
          workInProgressRootInterleavedUpdatedLanes,
          lane
        );
      }
      if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        // 根节点已经暂停了，标记有挂起的更新
        markRootSuspended(root, workInProgressRootRenderLanes);
      }
    }

    ensureRootIsScheduled(root, eventTime);
  }

  return root;
}

/**
 * 确保根节点被调度
 */
function ensureRootIsScheduled(root, currentTime) {
  const existingCallbackNode = root.callbackNode;

  // 检查是否有任何车道过期，将它们标记为已过期
  markStarvedLanesAsExpired(root, currentTime);

  // 确定下一个车道和它们的优先级
  const nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

  if (nextLanes === NoLanes) {
    // 特殊情况：什么都不需要工作
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }
    root.callbackNode = null;
    root.callbackPriority = NoLane;
    return;
  }

  // 我们使用最高优先级车道来表示回调的优先级
  const newCallbackPriority = getHighestPriorityLane(nextLanes);

  // 检查是否有现有任务。我们可能能够重用它
  const existingCallbackPriority = root.callbackPriority;
  if (
    existingCallbackPriority === newCallbackPriority &&
    // 特殊情况：React会同步刷新，但给它自己一个延续回调
    // 以便它可以在 act() 调用中切换到工作循环
    !(
      __DEV__ &&
      ReactCurrentActQueue.current !== null &&
      existingCallbackNode !== fakeActCallbackNode
    )
  ) {
    if (__DEV__) {
      // 如果我们将要重用现有任务，检查它是否有正确的优先级
      if (
        existingCallbackNode != null &&
        existingCallbackPriority !== newCallbackPriority
      ) {
        console.error('Expected the root callback priority to match the next lanes priority.');
      }
    }
    // 优先级没有改变。我们可以重用现有任务
    return;
  }

  if (existingCallbackNode != null) {
    // 取消现有回调
    cancelCallback(existingCallbackNode);
  }

  // 调度新回调
  let newCallbackNode;
  if (newCallbackPriority === SyncLane) {
    // 特殊情况：同步React回调使用特殊的内部实现来调度
    if (root.tag === LegacyRoot) {
      if (__DEV__ && ReactCurrentActQueue.current !== null) {
        ReactCurrentActQueue.didScheduleLegacyUpdate = true;
      }
      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root));
    } else {
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    }
    if (supportsMicrotasks) {
      // 如果支持微任务，刷新同步回调队列的微任务
      // 而不是下一个滴答声
      if (__DEV__ && ReactCurrentActQueue.current !== null) {
        // 内部act() 使用自己的调度器
        ReactCurrentActQueue.push(() => {
          flushSyncCallbacks();
          return null;
        });
      } else {
        scheduleMicrotask(() => {
          // 在微任务中，它不再异步，但它是批处理的
          if (
            (executionContext & (RenderContext | CommitContext)) ===
            NoContext
          ) {
            // 请注意，这将使用当前时间调用flushSyncCallbacks
            flushSyncCallbacks();
          }
        });
      }
    } else {
      // 刷新同步工作队列作为离散事件的一部分
      scheduleCallback(ImmediatePriority, flushSyncCallbacks);
    }
    newCallbackNode = null;
  } else {
    let schedulerPriorityLevel;
    switch (lanesToSchedulerPriority(nextLanes)) {
      case ImmediatePriority:
        schedulerPriorityLevel = ImmediatePriority;
        break;
      case UserBlockingPriority:
        schedulerPriorityLevel = UserBlockingPriority;
        break;
      case NormalPriority:
        schedulerPriorityLevel = NormalPriority;
        break;
      case LowPriority:
        schedulerPriorityLevel = LowPriority;
        break;
      case IdlePriority:
        schedulerPriorityLevel = IdlePriority;
        break;
      default:
        schedulerPriorityLevel = NormalPriority;
        break;
    }
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root)
    );
  }

  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
}

/**
 * 执行同步工作
 */
function performSyncWorkOnRoot(root) {
  if (__DEV__) {
    syncNestedUpdateFlag();
  }

  flushPassiveEffects();

  let lanes = getNextLanes(root, NoLanes);
  if (!includesSomeLane(lanes, SyncLane)) {
    // 没有同步工作要做
    ensureRootIsScheduled(root, now());
    return null;
  }

  let exitStatus = renderRootSync(root, lanes);

  if (root.tag !== LegacyRoot && exitStatus === RootErrored) {
    // 如果出现错误，尝试重新启动同步渲染
    const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);
    if (errorRetryLanes !== NoLanes) {
      lanes = errorRetryLanes;
      exitStatus = recoverFromConcurrentError(root, errorRetryLanes);
    }
  }

  if (exitStatus === RootFatalErrored) {
    const fatalError = workInProgressRootFatalError;
    prepareFreshStack(root, NoLanes);
    markRootSuspended(root, lanes);
    ensureRootIsScheduled(root, now());
    throw fatalError;
  }

  if (exitStatus === RootDidNotComplete) {
    throw new Error('Root did not complete. This is a bug in React.');
  }

  // 我们现在有一个一致的树。因为这是同步渲染，我们
  // 将提交它，即使出现暂停
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  root.finishedLanes = lanes;
  commitRoot(root, workInProgressRootRecoverableErrors, workInProgressTransitions);

  // 在退出之前，确保有下一个回调被调度
  ensureRootIsScheduled(root, now());

  return null;
}

/**
 * 执行并发工作
 */
function performConcurrentWorkOnRoot(root, didTimeout) {
  if (__DEV__) {
    resetNestedUpdateFlag();
  }

  // 由于我们知道我们正在处理并发渲染，我们可以删除
  // 现有的被动效果回调(如果有的话)，因为我们知道它们不会
  // 火，直到工作循环结束
  if (rootDoesHavePassiveEffects) {
    flushPassiveEffects();
  }

  const originalCallbackNode = root.callbackNode;
  const didFlushPassiveEffects = flushPassiveEffects();
  if (didFlushPassiveEffects) {
    // 刷新被动效果可能导致额外的工作被调度在同一根目录
    if (root.callbackNode !== originalCallbackNode) {
      // 调度新回调
      return null;
    }
    // 否则，继续渲染
  }

  let lanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
  );
  if (lanes === NoLanes) {
    // 防御性编码。这通常不应该发生
    return null;
  }

  // 我们在并发模式下禁用时间切片如果有任何车道过期
  const shouldTimeSlice =
    !includesBlockingLane(root, lanes) &&
    !includesExpiredLane(root, lanes) &&
    (disableSchedulerTimeoutInWorkLoop || !didTimeout);

  let exitStatus = shouldTimeSlice
    ? renderRootConcurrent(root, lanes)
    : renderRootSync(root, lanes);

  if (exitStatus !== RootInProgress) {
    if (exitStatus === RootErrored) {
      // 如果出现错误，尝试重新启动并发渲染
      const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);
      if (errorRetryLanes !== NoLanes) {
        lanes = errorRetryLanes;
        exitStatus = recoverFromConcurrentError(root, errorRetryLanes);
        // 我们假设当我们恢复时，我们将使用同步车道
        // 这将确保我们不会再次时间切片
      }
    }

    if (exitStatus === RootFatalErrored) {
      const fatalError = workInProgressRootFatalError;
      prepareFreshStack(root, NoLanes);
      markRootSuspended(root, lanes);
      ensureRootIsScheduled(root, now());
      throw fatalError;
    }

    if (exitStatus === RootDidNotComplete) {
      // 渲染没有完成
      markRootSuspended(root, lanes);
    } else {
      // 渲染完成了
      const renderWasConcurrent = !includesBlockingLane(root, lanes);
      const finishedWork = root.current.alternate;
      if (
        renderWasConcurrent &&
        !isRenderConsistentWithExternalStores(finishedWork)
      ) {
        // 一个store在渲染阶段被突变。这打破了store的约定
        // 重新开始并再次同步渲染。因为我们中断了当前
        // 渲染，我们需要标记它被暂停，以便它不会提交
        exitStatus = renderRootSync(root, lanes);

        // 我们需要检查错误，因为渲染可能会抛出
        if (exitStatus === RootErrored) {
          const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);
          if (errorRetryLanes !== NoLanes) {
            lanes = errorRetryLanes;
            exitStatus = recoverFromConcurrentError(root, errorRetryLanes);
          }
        }
        if (exitStatus === RootFatalErrored) {
          const fatalError = workInProgressRootFatalError;
          prepareFreshStack(root, NoLanes);
          markRootSuspended(root, lanes);
          ensureRootIsScheduled(root, now());
          throw fatalError;
        }
      }

      // 我们现在有一个一致的树
      root.finishedWork = finishedWork;
      root.finishedLanes = lanes;
      finishConcurrentRender(root, exitStatus, lanes);
    }
  }

  ensureRootIsScheduled(root, now());
  if (root.callbackNode === originalCallbackNode) {
    // 任务没有完成。返回继续函数
    return performConcurrentWorkOnRoot.bind(null, root);
  }
  return null;
}

/**
 * 同步渲染根节点
 */
function renderRootSync(root, lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher();

  // 如果根或车道已更改，请丢弃现有堆栈
  // 并准备一个新的。否则我们会继续在哪里
  // 我们停止了
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    if (__DEV__) {
      if (isDevToolsPresent) {
        const memoizedUpdaters = root.memoizedUpdaters;
        if (memoizedUpdaters.size > 0) {
          restorePendingUpdaters(root, workInProgressRootRenderLanes);
          memoizedUpdaters.clear();
        }

        // 在根节点开始时，我们可以报告被调度的更新程序
        movePendingFibersToMemoized(root, lanes);
      }
    }

    workInProgressTransitions = getTransitionsForLanes(root, lanes);
    prepareFreshStack(root, lanes);
  }

  if (__DEV__) {
    if (enableDebugTracing) {
      logRenderStarted(lanes);
    }
  }

  do {
    try {
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);
  resetContextDependencies();

  executionContext = prevExecutionContext;
  popDispatcher(prevDispatcher);

  if (workInProgress !== null) {
    // 这是同步渲染，所以我们应该完成整个树
    throw new Error(
      'Cannot commit an incomplete root. This error is likely caused by a ' +
        'bug in React. Please file an issue.'
    );
  }

  if (__DEV__) {
    if (enableDebugTracing) {
      logRenderStopped();
    }
  }

  // 设置为完成状态
  workInProgressRoot = null;
  workInProgressRootRenderLanes = NoLanes;

  return workInProgressRootExitStatus;
}

/**
 * 并发渲染根节点
 */
function renderRootConcurrent(root, lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher();

  // 如果根或车道已更改，请丢弃现有堆栈
  // 并准备一个新的。否则我们会继续在哪里
  // 我们停止了
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    if (__DEV__) {
      if (isDevToolsPresent) {
        const memoizedUpdaters = root.memoizedUpdaters;
        if (memoizedUpdaters.size > 0) {
          restorePendingUpdaters(root, workInProgressRootRenderLanes);
          memoizedUpdaters.clear();
        }

        // 在根节点开始时，我们可以报告被调度的更新程序
        movePendingFibersToMemoized(root, lanes);
      }
    }

    workInProgressTransitions = getTransitionsForLanes(root, lanes);
    resetRenderTimer();
    prepareFreshStack(root, lanes);
  }

  if (__DEV__) {
    if (enableDebugTracing) {
      logRenderStarted(lanes);
    }
  }

  do {
    try {
      workLoopConcurrent();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);

  resetContextDependencies();
  popDispatcher(prevDispatcher);
  executionContext = prevExecutionContext;

  if (__DEV__) {
    if (enableDebugTracing) {
      logRenderStopped();
    }
  }

  // 检查树是否完成
  if (workInProgress !== null) {
    // 仍然有工作要做
    if (__DEV__) {
      if (enableDebugTracing) {
        logRenderYielded();
      }
    }
    return RootInProgress;
  } else {
    // 完成根
    if (__DEV__) {
      if (enableDebugTracing) {
        logRenderCompleted(lanes);
      }
    }

    // 设置为完成状态
    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes;

    // 返回最终的退出状态
    return workInProgressRootExitStatus;
  }
}

/**
 * 同步工作循环
 */
function workLoopSync() {
  // 已经超时，所以执行工作而不检查时间
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 并发工作循环
 */
function workLoopConcurrent() {
  // 执行工作直到调度器要求我们让出
  while (workInProgress !== null && !shouldYieldToHost()) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行单元工作
 */
function performUnitOfWork(unitOfWork) {
  // 当前，刷新的fiber，我们称之为current
  const current = unitOfWork.alternate;
  setCurrentDebugFiberInDEV(unitOfWork);

  let next;
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork(current, unitOfWork, subtreeRenderLanes);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork(current, unitOfWork, subtreeRenderLanes);
  }

  resetCurrentDebugFiberInDEV();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // 如果这没有产生新的工作，完成这个单位
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner.current = null;
}

// 简化的辅助函数和变量
let workInProgressRootInterleavedUpdatedLanes = NoLanes;
let workInProgressRootFatalError = null;
let workInProgressRootRecoverableErrors = null;
let workInProgressTransitions = null;
let subtreeRenderLanes = NoLanes;

// 简化的开发工具相关
const __DEV__ = process.env.NODE_ENV !== 'production';
const isDevToolsPresent = false;
const enableDebugTracing = false;
const enableProfilerTimer = false;
const ProfileMode = 0;
const disableSchedulerTimeoutInWorkLoop = false;
const supportsMicrotasks = typeof queueMicrotask === 'function';

// 简化的Act相关
const ReactCurrentActQueue = { current: null };
const fakeActCallbackNode = {};

// 简化的调度相关
const LegacyRoot = 0;
const { ImmediatePriority, UserBlockingPriority, LowPriority, IdlePriority } = {
  ImmediatePriority: 1,
  UserBlockingPriority: 2,
  LowPriority: 4,
  IdlePriority: 5,
};

// React所有者
const ReactCurrentOwner = { current: null };

// 简化的函数实现
function now() { return performance.now(); }
function prepareFreshStack(root, lanes) { /* 简化实现 */ }
function markRootUpdated(root, lane, eventTime) { /* 简化实现 */ }
function markRootSuspended(root, lanes) { /* 简化实现 */ }
function markStarvedLanesAsExpired(root, currentTime) { /* 简化实现 */ }
function getNextLanes(root, wipLanes) { return NoLanes; }
function getLanesToRetrySynchronouslyOnError(root) { return NoLanes; }
function recoverFromConcurrentError(root, errorRetryLanes) { return RootCompleted; }
function commitRoot(root, recoverableErrors, transitions) { /* 简化实现 */ }
function finishConcurrentRender(root, exitStatus, lanes) { /* 简化实现 */ }
function isRenderConsistentWithExternalStores(finishedWork) { return true; }
function flushPassiveEffects() { return false; }
function handleError(root, thrownValue) { /* 简化实现 */ }
function beginWork(current, workInProgress, renderLanes) { return null; }
function completeUnitOfWork(unitOfWork) { /* 简化实现 */ }
function pushDispatcher() { return null; }
function popDispatcher(prevDispatcher) { /* 简化实现 */ }
function resetContextDependencies() { /* 简化实现 */ }
function getTransitionsForLanes(root, lanes) { return null; }
function resetRenderTimer() { /* 简化实现 */ }
function scheduleSyncCallback(callback) { /* 简化实现 */ }
function scheduleLegacySyncCallback(callback) { /* 简化实现 */ }
function flushSyncCallbacks() { /* 简化实现 */ }
function scheduleMicrotask(callback) { queueMicrotask(callback); }
function syncNestedUpdateFlag() { /* 简化实现 */ }
function resetNestedUpdateFlag() { /* 简化实现 */ }
function warnIfUpdatesNotWrappedWithActDEV(fiber) { /* 简化实现 */ }

// 调试相关
function setCurrentDebugFiberInDEV() {}
function resetCurrentDebugFiberInDEV() {}
function startProfilerTimer() {}
function stopProfilerTimerIfRunningAndRecordDelta() {}
function logRenderStarted() {}
function logRenderStopped() {}
function logRenderYielded() {}
function logRenderCompleted() {}
function restorePendingUpdaters() {}
function movePendingFibersToMemoized() {}

// 导入Lane相关函数
function includesBlockingLane(root, lanes) { return false; }
function includesExpiredLane(root, lanes) { return false; }