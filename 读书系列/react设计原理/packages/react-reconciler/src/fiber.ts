import { Container } from 'hostConfig';
import { Flags, NoFlags } from './fiberFlags';
import { FunctionComponent, HostComponent, type WorkTag } from './workTags';
import type { Key, Props, ReactElement, Ref } from 'shared/reactTypes';

class FiberNode {
  type: any;
  key: Key;
  tag: WorkTag;
  stateNode: any;
  ref: Ref;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  pedingProps: Props;
  memoizedProps: Props | null;
  memoizedState: any;
  alternate: FiberNode | null;
  flags: Flags;
  subtreeFlags: Flags;
  updateQueue: unknown;
  deletions: FiberNode[] | null;

  constructor(tag: WorkTag, pedingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key || null;
    this.stateNode = null;
    this.type = null;

    // 构成树状结构
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;

    this.ref = null;

    // 作为工作单元
    this.pedingProps = pedingProps;
    this.memoizedProps = null;
    this.alternate = null;
    this.updateQueue = null;
    this.memoizedState = null;

    // 副作用
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.deletions = null;
  }
}

class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props,
): FiberNode => {
  let wip = current.alternate;

  if (wip === null) {
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.type = current;
    wip.stateNode = current.stateNode;

    wip.alternate = current;
    current.alternate = wip;
  } else {
    wip.pedingProps = pendingProps;
    wip.flags = NoFlags;
    wip.subtreeFlags = NoFlags;
    wip.deletions = null;
  }

  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;

  return wip;
};

function createFiberFromElement(element: ReactElement) {
  const { type, key, props } = element;
  let flagTag: WorkTag = FunctionComponent;

  if (typeof type === 'string') {
    flagTag = HostComponent;
  } else if (typeof type !== 'function' && __DEV__) {
    console.warn('未定义的type类型', element);
  }

  const fiber = new FiberNode(flagTag, props, key);
  fiber.type = type;
  return fiber;
}

function createFiberFromFragment() {}

export {
  FiberNode,
  FiberRootNode,
  createWorkInProgress,
  createFiberFromElement,
  createFiberFromFragment,
};
