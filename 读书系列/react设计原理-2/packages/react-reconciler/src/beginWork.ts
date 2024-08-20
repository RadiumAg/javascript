import { ReactElement } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
  Fragement,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { renderWithHooks } from './fiberHooks';
import { Lane } from './fiberLanes';

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
    case Fragement:
      return updateFragement(wip);
    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型');
      }
      return null;
  }
};

/**
 * 更新Fragement
 * @param wip
 * @returns
 */
function updateFragement(wip: FiberNode) {
  const nextChildren = wip.pendingProps;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateFunctionComponent(wip: FiberNode, renderLane: Lane) {
  const nextChildren = renderWithHooks(wip);
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostRoot(wip: FiberNode, renderLane: Lane) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
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
