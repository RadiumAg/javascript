import type { Key, Props, Ref } from 'shared/reactTypes';
import type { WorkTag } from './workTags';
import type { Flags, NoFlags } from './fiberFlags';

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
  }
}

export { FiberNode };
