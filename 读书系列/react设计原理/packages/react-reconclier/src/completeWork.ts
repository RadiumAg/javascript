import { FiberNode } from './fiber';
import { NoFlags } from './fiberFlags';
import {
  appendInitialChild,
  createInstance,
  createTextInstance,
} from './hostConfig';
import { HostComponent, HostRoot, HostText } from './workTags';

const completeWork = (wip: FiberNode) => {
  const newProps = wip.pedingProps;
  const current = wip.alternate;

  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.alternate) {
        //  updated
      } else {
        // 1. 构建DOM
        const instance = createInstance(wip.type, newProps);
        // 2. 将DOM插入到DOM树中
        appendAllChildren(instance, wip);
        wip.stateNode = instance;
      }
      bubbleProperties(wip);
      return null;

    case HostText:
      if (current !== null && wip.alternate) {
        //  updated
      } else {
        // 1. 构建DOM
        const instance = createTextInstance(wip.type, newProps);
        // 2. 将DOM插入到DOM树中
        wip.stateNode = instance;
      }
      bubbleProperties(wip);
      return null;

    case HostRoot:
      bubbleProperties(wip);
      return null;

    default:
      if (__DEV__) {
        console.warn('未处理的completeWork情况', wip);
      }
      break;
  }
};

function appendAllChildren(parent: FiberNode, wip: FiberNode) {
  let node = wip.child;

  while (node !== null) {
    if (node?.tag === HostComponent || node?.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === wip) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }
      node = node?.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function bubbleProperties(wip: FiberNode) {
  let subTreeFlags = NoFlags;
  let child = wip.child;

  while (child !== null) {
    subTreeFlags |= child.subtreeFlags;
    subTreeFlags |= child.flags;

    child.return = wip;
    child = child.sibling;
  }

  wip.subtreeFlags |= subTreeFlags;
}

export { completeWork, appendAllChildren };
