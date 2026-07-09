import { ReactElement } from '../../shared/ReactTypes';
import { FiberNode, createWorkInProgress } from './fiber';
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
import { Lane, Lanes, NoLane, NoLanes, isSubsetOfLanes } from './fiberLanes';
import { Ref } from './fiberFlags';

/**
 * 递归中的递阶段，创建Fiber树
 * @param wip
 * @returns
 */
export const beginWork = (wip: FiberNode, renderLane: Lane) => {
  // 清除 lanes：本 fiber 的更新已在本次 render 中被处理
  // 如果还有未处理的子节点更新，会在 bailout 逻辑中保留 childLanes
  wip.lanes = NoLanes;
  wip.childLanes = NoLanes;

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
  // bailout 检查
  // 条件：1. 自身无待处理更新  2. props 引用未变化
  const current = wip.alternate;
  const pendingProps = wip.pendingProps;
  const memoizedProps = current?.memoizedProps;

  if (
    !isSubsetOfLanes(renderLane, wip.lanes) &&
    current !== null &&
    memoizedProps === pendingProps
  ) {
    // 满足 bailout 条件，跳过该组件的渲染
    return bailoutOnAlreadyFinishedWork(wip, renderLane);
  }

  const nextChildren = renderWithHooks(wip, renderLane);
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

/**
 * bailout 策略：跳过无更新的组件渲染
 *
 * 1. 子孙节点也无更新 → return null（整棵子树跳过）
 * 2. 子孙节点有更新 → clone 子 fiber，继续递归处理子孙
 */
function bailoutOnAlreadyFinishedWork(
  wip: FiberNode,
  renderLane: Lane,
): FiberNode | null {
  // 子孙节点也没有待处理的更新 → 整棵子树跳过
  if (!isSubsetOfLanes(renderLane, wip.childLanes)) {
    if (__DEV__) {
      console.log('bailout 跳过组件:', wip.type?.name || wip.type);
    }
    return null;
  }

  // 子孙节点有更新，但自身不需要更新 → 只 clone 子节点继续递归
  if (__DEV__) {
    console.log(
      'bailout 跳过自身，但继续处理子节点:',
      wip.type?.name || wip.type,
    );
  }
  cloneChildFibers(wip);
  return wip.child;
}

/**
 * 复用子 fiber：为每个子节点创建新的 workInProgress
 * 这样 workLoop 可以继续处理子孙节点，而不用重新 Diff
 */
function cloneChildFibers(wip: FiberNode) {
  const current = wip.alternate;
  let currentChild: FiberNode | null = current ? current.child : null;

  if (currentChild === null) {
    return;
  }

  let newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
  wip.child = newChild;
  newChild.return = wip;

  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    const newSibling = createWorkInProgress(
      currentChild,
      currentChild.pendingProps,
    );
    newSibling.return = wip;
    newChild.sibling = newSibling;
    newChild = newSibling;
  }
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
