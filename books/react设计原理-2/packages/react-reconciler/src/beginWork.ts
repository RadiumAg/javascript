import { ReactElement } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { renderWithHooks } from './fiberHooks';
import { Lane } from './fiberLanes';
import { Ref } from './fiberFlags';

/**
 * 递归中的递阶段
 * @param wip
 * @returns
 */
export const beginWork = (wip: FiberNode, renderLane: Lane) => {
  // 比较，返回子fiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip, renderLane);
    // App
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    case FunctionComponent:
      return updateFunctionComponent(wip, renderLane);
    case Fragment:
      return updateFragment(wip);
    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型');
      }
      return null;
  }
};

/**
 * 更新Fragment
 * @param wip
 * @returns
 */
function updateFragment(wip: FiberNode) {
  const nextChildren = wip.pendingProps;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateFunctionComponent(wip: FiberNode, renderLane: Lane) {
  const nextChildren = renderWithHooks(wip, renderLane);
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

/**
 * 更新FiberRootNode
 *
 * @param wip
 * @param renderLane
 * @returns
 */
function updateHostRoot(wip: FiberNode, renderLane: Lane) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending, renderLane);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

/**
 * 更新HostComponent
 *
 * @param workInProgress
 * @returns
 */
function updateHostComponent(workInProgress: FiberNode) {
  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;
  markRef(workInProgress.alternate, workInProgress);
  reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 协调子fiber
 *
 * @param {FiberNode} wip
 * @param {ReactElement} children
 */
function reconcileChildren(wip: FiberNode, children: ReactElement) {
  const current = wip.alternate;

  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current?.child, children);
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children);
  }
}

/**
 * 该函数 markRef 用于标记 FiberNode 的引用状态。具体功能如下：
   比较 current 和 workInProgress 节点的引用（ref）。
   如果 current 为空且 workInProgress 的引用不为空，或两者引用不同，则标记 workInProgress 的 flags 添加 Ref 标志。
 *
 * @param {(FiberNode | null)} current
 * @param {FiberNode} workInProgress
 */
function markRef(current: FiberNode | null, workInProgress: FiberNode) {
  const ref = workInProgress.ref;

  if (
    (current === null && ref !== null) ||
    (current !== null && current.ref !== ref)
  ) {
    workInProgress.flags |= Ref;
  }
}
