import { ReactElement } from '../../shared/ReactTypes';
import { FiberNode, createWorkInProgress } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  MemoComponent,
  ContextProvider,
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { renderWithHooks } from './fiberHooks';
import { Lane, NoLanes, isSubsetOfLanes } from './fiberLanes';
import { Ref } from './fiberFlags';
import {
  prepareToReadContext,
  propagateContextChange,
  pushProvider,
} from './fiberContext';

/**
 * 递归中的递阶段，创建Fiber树
 * @param wip
 * @returns
 */
export const beginWork = (wip: FiberNode, renderLane: Lane) => {
  // bailout 策略：在进入具体更新逻辑前，先判断能否复用 current
  const current = wip.alternate;
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = wip.pendingProps;

    // 四要素之 props、type：只要 props 引用变化或 type 变化，就无法 bailout
    if (oldProps === newProps && current.type === wip.type) {
      // 四要素之 state：自身没有待处理的更新
      if (!checkScheduledUpdateOrContext(current, renderLane)) {
        // ContextProvider 需要 push/pop 值栈配对，不能在此提前 bailout，
        // 交给 updateContextProvider（内部 push 后再决定是否 bailout）
        if (wip.tag !== ContextProvider) {
          // 命中 bailout，尝试跳过
          return bailoutOnAlreadyFinishedWork(wip, renderLane);
        }
      }
    }
  }

  // 未命中 bailout：清除自身 lanes（本次 render 会处理它）
  // 注意：childLanes 不在此清除，completeWork 的 bubbleProperties 会重新计算
  wip.lanes = NoLanes;

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
      return updateFunctionComponent(wip, wip.type, renderLane);
    case Fragment:
      return updateFragment(wip);
    case MemoComponent:
      return updateMemoComponent(wip, renderLane);
    case ContextProvider:
      return updateContextProvider(wip, renderLane);
    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型');
      }
      return null;
  }
};

/**
 * 检查 current 上是否有本次 renderLane 优先级的待处理更新
 * （读 current.lanes 而非 wip.lanes，因为 wip.lanes 即将在下方被清零）
 */
function checkScheduledUpdateOrContext(
  current: FiberNode,
  renderLane: Lane,
): boolean {
  const updateLanes = current.lanes;
  return isSubsetOfLanes(updateLanes, renderLane);
}

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

/**
 * 更新 ContextProvider（Context.Provider）
 * 1. push 新值到 context 值栈
 * 2. value 未变 + children 未变 → bailout
 * 3. value 变化 → propagateContextChange 向下标记消费者
 */
function updateContextProvider(wip: FiberNode, renderLane: Lane) {
  const providerType = wip.type;
  const context = providerType._context;
  const newProps = wip.pendingProps;
  const oldProps = wip.memoizedProps;
  const newValue = newProps.value;

  // 进入 Provider：把新值压入 context 值栈
  pushProvider(context, newValue);

  if (oldProps !== null) {
    const oldValue = oldProps.value;
    if (
      Object.is(oldValue, newValue) &&
      oldProps.children === newProps.children
    ) {
      // value 和 children 都没变 → bailout（push 已完成，completeWork 会 pop）
      return bailoutOnAlreadyFinishedWork(wip, renderLane);
    } else if (!Object.is(oldValue, newValue)) {
      // value 变了 → 向下传播，标记消费该 context 的后代
      propagateContextChange(wip, context, renderLane);
    }
  }

  const nextChildren = newProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateFunctionComponent(
  wip: FiberNode,
  Component: FiberNode['type'],
  renderLane: Lane,
) {
  // 渲染前重置 context 依赖收集
  prepareToReadContext(wip);
  const nextChildren = renderWithHooks(wip, Component, renderLane);
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

/**
 * 更新 MemoComponent（React.memo 包裹的组件）
 * 与 FunctionComponent 的区别：对 props 做浅比较（而非引用比较）
 * 父组件重渲染时，memo 组件的 element 每次都是新的（props 引用变了），
 * 所以顶部 bailout 会 miss，进入这里通过浅比较再次尝试 bailout
 */
function updateMemoComponent(wip: FiberNode, renderLane: Lane) {
  const current = wip.alternate;
  const nextProps = wip.pendingProps;
  // wip.type 是 memo 对象 { $$typeof, type, compare }
  const Component = wip.type.type;
  const compare = wip.type.compare || shallowEqual;

  if (current !== null) {
    const prevProps = current.memoizedProps;
    // props 浅比较 + ref 未变化
    if (compare(prevProps, nextProps) && current.ref === wip.ref) {
      // 复用旧 props
      wip.pendingProps = prevProps;
      // 自身没有待处理的更新 → bailout
      if (!checkScheduledUpdateOrContext(current, renderLane)) {
        // 恢复 wip.lanes（顶部已清零），保留可能存在的低优先级 lane
        wip.lanes = current.lanes;
        return bailoutOnAlreadyFinishedWork(wip, renderLane);
      }
    }
  }
  return updateFunctionComponent(wip, Component, renderLane);
}

/**
 * props 浅比较：memo 默认的比较策略
 */
function shallowEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !Object.is(a[key], b[key])
    ) {
      return false;
    }
  }
  return true;
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
  if (!isSubsetOfLanes(wip.childLanes, renderLane)) {
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
