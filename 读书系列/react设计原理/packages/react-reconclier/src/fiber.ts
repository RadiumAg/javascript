import { Container } from 'hostConfig';
import { Flags, NoFlags } from './fiberFlags';
import type { Key, Props, Ref } from 'shared/reactTypes';
import type { WorkTag } from './workTags';

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
  alternate: FiberNode | null;
  flags: Flags;
  updateQueue: unknown;

  constructor(tag: WorkTag, pedingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key;
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
    this.flags = NoFlags;
    this.updateQueue = null;
  }
}

class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    this.finishedWork = null;
  }
}

export { FiberNode, FiberRootNode };
