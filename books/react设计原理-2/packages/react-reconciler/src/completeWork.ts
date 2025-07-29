import {
  Container,
  appendInitialChild,
  createInstance,
  createTextInstance,
} from 'hostConfig';
import { updateFiberProps } from '../../react-dom/src/SyntheticEvent';
import { FiberNode } from './fiber';
import {
  Fragment,
  FunctionComponent,
  HostComponent, 
  HostRoot,
  HostText,
} from './workTags';
import { NoFlags, Ref, Update } from './fiberFlags';

function markUpdate(fiber: FiberNode) {
  fiber.flags |= Update; 
}

function markRef(fiber: FiberNode) {
  fiber.flags |= Ref;
}

/**
 * 创建node并下一层
 *
 * @param workInProgress
 * @returns
 */
export const completeWork = (workInProgress: FiberNode) => {
  // 递归中的归
  const newProps = workInProgress.pendingProps;
  const current = workInProgress.alternate;

  switch (workInProgress.tag) {
    case HostComponent:
      if (current !== null && workInProgress.stateNode) {
        // update
        updateFiberProps(workInProgress.stateNode, newProps);
        // 标记Ref
        if (current.ref !== workInProgress.ref) {
          markRef(workInProgress);
        }
      } else {
        // 1. 构建DOM
        const instance = createInstance(workInProgress.type, newProps);
        // 2. 将DOM插入到DOM树中
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
        // 标记Ref
        if (workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      }
      bubbleProperties(workInProgress);
      return null;

    case HostText:
      if (current !== null && workInProgress.stateNode) {
        // update
        const oldText = current.memoizedProps?.content;
        const newText = newProps.content;
        if (oldText !== newText) {
          markUpdate(workInProgress);
        }
      } else {
        // 1. 构建DOM
        const instance = createTextInstance(newProps.content);
        workInProgress.stateNode = instance;
      }
      bubbleProperties(workInProgress);
      return null;

    case HostRoot:
    case Fragment:
    case FunctionComponent:
      bubbleProperties(workInProgress);
      return null;

    default:
      if (__DEV__) {
        console.warn('未处理的completeWork情况', workInProgress);
      }
      break;
  }
};

function appendAllChildren(parent: Container, workInProgress: FiberNode) {
  let node = workInProgress.child;

  while (node !== null) {
    if (node?.tag === HostComponent || node?.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node?.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

/**
 * 把下一层的flags冒泡到上一层
 *
 * @param {FiberNode} workInProgress
 */
function bubbleProperties(workInProgress: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = workInProgress.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child.return = workInProgress;
    child = child.sibling;
  }
  workInProgress.subtreeFlags |= subtreeFlags;
}
