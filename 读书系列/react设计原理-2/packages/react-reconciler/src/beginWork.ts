import { ReactElement } from 'shared/ReactTypes';
import { FiberNode } from './filber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
// 递归中的递阶段

export const beginWork = (wip: FiberNode) => {
  // 比较，返回子fiberNode

  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);

    case HostComponent:
      return updateHostComponent(wip);

    case HostText:
      return null;

    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型');
      }
      return null;
  }
};

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shred.pending;
  updateQueue.shred.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.chidlren;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function reconcileChildren(wip: FiberNode, chidlren: ReactElement) {
  const current = wip.alternate;

  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current?.child, chidlren);
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, chidlren);
  }
}
