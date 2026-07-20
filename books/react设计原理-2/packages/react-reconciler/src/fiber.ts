import {
  Key,
  Props,
  ReactContext,
  ReactElement,
  Ref,
} from '../../shared/ReactTypes';
import { Container } from 'hostConfig';
import { CallbackNode } from 'scheduler';
import {
  ContextProvider,
  Fragment,
  FunctionComponent,
  HostComponent,
  MemoComponent,
  SuspenseComponent,
  WorkTag,
} from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Lane, Lanes, NoLane, NoLanes } from './fiberLanes';
import { Effect } from './fiberHooks';
import {
  REACT_MEMO_TYPE,
  REACT_PROVIDER_TYPE,
  REACT_SUSPENSE_TYPE,
} from '../../shared/ReactSymbols';

export interface PendingPassiveEffects {
  unmount: Effect[];
  update: Effect[];
}

// useContext 依赖项：记录一个 fiber 消费了哪些 context
export interface ContextItem<T> {
  context: ReactContext<T>;
  memoizedState: T;
  next: ContextItem<T> | null;
}

export interface FiberDependencies {
  firstContext: ContextItem<any> | null;
}

export class FiberNode {
  type: any;
  tag: WorkTag;
  // 新属性，等待处理
  pendingProps: Props;
  key: Key;
  // 真实dom
  stateNode: any;
  ref: Ref | null;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  // 最终确定状态, 已经生效的属性
  memoizedProps: Props | null;

  // 每个fiber还有自己的状态，用在hook上
  // 每一种fiber的状态类型不一样
  // 类组件的状态对应的fiber 存的就是类的实例状态，HostRoot村的就是要渲染的元素
  memoizedState: any;

  // 替身，进行dom-differ的时候会用到
  alternate: FiberNode | null;

  // fiber自身的副作用
  flags: Flags;

  // 子节点的副作用，一个优化，如果没值，代表子节点没有更新
  subtreeFlags: Flags;

  // 每个fiber身上还有更新队列，例如setState产生的更新
  updateQueue: unknown;
  deletions: FiberNode[] | null;

  // 该 fiber 自身待处理的更新优先级
  lanes: Lanes;
  // 子孙节点待处理的更新优先级（向上冒泡汇总）
  childLanes: Lanes;

  // useContext 消费的 context 依赖链表
  dependencies: FiberDependencies | null;

  constructor(tag: WorkTag, pendingPorps: Props, key: Key) {
    this.tag = tag;
    this.key = key ?? null;
    this.stateNode = null;
    this.type = null;

    // 构成树状结构
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;

    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingPorps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedProps = null;
    this.alternate = null;

    // 副作用
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.deletions = null;

    // lanes
    this.lanes = NoLanes;
    this.childLanes = NoLanes;

    // context 依赖
    this.dependencies = null;
  }
}

export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;
  pendingLanes: Lanes;
  finishedLane: Lane;
  pendingPassiveEffects: PendingPassiveEffects;

  callbackNode: CallbackNode | null;
  callbackPriority: Lane;

  // Suspense：缓存 thenable 已绑定的 ping 监听，避免重复绑定
  pingCache: WeakMap<any, Set<Lane>> | null;

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
    this.pendingLanes = NoLane;
    this.finishedLane = NoLane;

    this.callbackNode = null;
    this.callbackPriority = NoLane;

    this.pendingPassiveEffects = {
      unmount: [],
      update: [],
    };

    this.pingCache = null;
  }
}

/**
 * 创建新的workInProgress Fiber，把alternate指向旧Fiber,
 * 旧Fiber的alternate指向新Fiber
 *
 * @param current
 * @param pendingProps
 * @returns
 */
export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props,
): FiberNode => {
  let wip = current.alternate;

  if (wip === null) {
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.type = current.type;
    wip.stateNode = current.stateNode;
    wip.alternate = current;
    current.alternate = wip;
  } else {
    // update
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
    wip.subtreeFlags = NoFlags;
    wip.deletions = null;
  }

  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  wip.ref = current.ref;
  wip.lanes = current.lanes;
  wip.childLanes = current.childLanes;
  wip.dependencies = current.dependencies;

  return wip;
};

/**
 *
 * 创建fiber
 *
 * @param element
 * @returns
 */
export function createFiberFromElement(element: ReactElement): FiberNode {
  const { type, key, ref, props } = element;
  let fiberTag: WorkTag = FunctionComponent;

  if (typeof type === 'string') {
    fiberTag = HostComponent;
  } else if (type === REACT_SUSPENSE_TYPE) {
    // <Suspense>
    fiberTag = SuspenseComponent;
  } else if (
    typeof type === 'object' &&
    type !== null &&
    type.$$typeof === REACT_PROVIDER_TYPE
  ) {
    // Context.Provider
    fiberTag = ContextProvider;
  } else if (
    typeof type === 'object' &&
    type !== null &&
    type.$$typeof === REACT_MEMO_TYPE
  ) {
    // React.memo 包裹的组件
    fiberTag = MemoComponent;
  } else if (typeof type !== 'function' && __DEV__) {
    console.warn('未定义的type类型', element);
  }

  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  fiber.ref = ref;
  return fiber;
}

export function createFiberFromFragment(elements: any[], key: Key): FiberNode {
  const fiber = new FiberNode(Fragment, elements, key);
  return fiber;
}
