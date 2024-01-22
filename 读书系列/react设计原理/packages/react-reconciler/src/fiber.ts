import { Container } from 'hostConfig';
import { CallbackNode } from 'scheduler';
import { Flags, NoFlags } from './fiberFlags';
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  type WorkTag,
} from './workTags';
import { Lane, Lanes, NoLane, NoLanes } from './fiberLanes';
import { Effect } from './fiberHooks';
import type { Key, Props, ReactElement, Ref } from 'shared/reactTypes';

interface PendingPassiveEffects {
  unmount: Effect[];
  update: Effect[];
}

class FiberNode {
  type: any;
  key: Key;
  tag: WorkTag;
  stateNode: any;
  ref: Ref | null;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  // 工作中的props
  pedingProps: Props;
  // 工作完成后的props
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
    // 保存真实DOM
    this.stateNode = null;
    // 保存类型 FunctionComponent
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
  current: FiberNode; // 指向hostRootFiber
  pendingLanes: Lanes;
  finishedLane: Lane;
  finishedWork: FiberNode | null;
  callbackNode: CallbackNode | null;
  callbackPriority: Lane;
  pendingPassiveEffect: PendingPassiveEffects;

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
    this.pendingLanes = NoLanes;
    this.finishedLane = NoLane;

    this.callbackNode = null;
    this.callbackPriority = NoLane;

    this.pendingPassiveEffect = {
      unmount: [],
      update: [],
    };
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
  wip.ref = current.ref;

  return wip;
};

function createFiberFromElement(element: ReactElement) {
  const { type, key, props, ref } = element;
  let flagTag: WorkTag = FunctionComponent;

  if (typeof type === 'string') {
    flagTag = HostComponent;
  } else if (typeof type !== 'function' && __DEV__) {
    console.warn('未定义的type类型', element);
  }

  const fiber = new FiberNode(flagTag, props, key);
  fiber.type = type;
  fiber.ref = ref;
  return fiber;
}

function createFiberFromFragment(elements: any[], key: Key): FiberNode {
  const fiber = new FiberNode(Fragment, elements, key);
  return fiber;
}

export {
  FiberNode,
  FiberRootNode,
  createWorkInProgress,
  createFiberFromElement,
  createFiberFromFragment,
};

export type { PendingPassiveEffects };
