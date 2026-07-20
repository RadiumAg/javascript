import {
  Container,
  appendInitialChild,
  createInstance,
  createTextInstance,
} from 'hostConfig';
import { Props } from '../../shared/ReactTypes';
import { updateFiberProps } from '../../react-dom/src/SyntheticEvent';
import { FiberNode } from './fiber';
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  ContextProvider,
  MemoComponent,
} from './workTags';
import { NoFlags, Ref, Update } from './fiberFlags';
import { NoLanes, mergeLanes } from './fiberLanes';
import { popProvider } from './fiberContext';

/**
 * Diff 新旧 props，返回 updatePayload
 * updatePayload 格式: [propKey1, propValue1, propKey2, propValue2, ...]
 * 如果无差异返回 null
 */
function diffProperties(oldProps: Props | null, newProps: Props): any[] | null {
  const updatePayload: any[] = [];

  // 检查被删除或变化的属性
  for (const propKey in oldProps) {
    if (
      propKey === 'children' ||
      !Object.prototype.hasOwnProperty.call(oldProps, propKey)
    ) {
      continue;
    }
    if (
      !Object.prototype.hasOwnProperty.call(newProps, propKey) ||
      !Object.is(oldProps[propKey], newProps[propKey])
    ) {
      updatePayload.push(propKey, null);
    }
  }

  // 检查新增或变化的属性
  for (const propKey in newProps) {
    if (
      propKey === 'children' ||
      !Object.prototype.hasOwnProperty.call(newProps, propKey)
    ) {
      continue;
    }
    const nextValue = newProps[propKey];
    if (
      !Object.prototype.hasOwnProperty.call(oldProps ?? {}, propKey) ||
      !Object.is(oldProps?.[propKey], nextValue)
    ) {
      updatePayload.push(propKey, nextValue);
    }
  }

  return updatePayload.length > 0 ? updatePayload : null;
}

function markUpdate(fiber: FiberNode) {
  fiber.flags |= Update;
}

function markRef(fiber: FiberNode) {
  fiber.flags |= Ref;
}

/**
 *  创建stateNode并且构建根据fiber构建fiber树
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
        const oldProps = current.memoizedProps;
        const updatePayload = diffProperties(oldProps, newProps);
        if (updatePayload !== null) {
          workInProgress.updateQueue = updatePayload;
          markUpdate(workInProgress);
        }
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
    case MemoComponent:
      bubbleProperties(workInProgress);
      return null;

    case ContextProvider:
      // 离开 Provider：恢复 context 值栈
      popProvider(workInProgress.type._context);
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
  let newChildLanes = NoLanes;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    // 收集子节点的 lanes 与 childLanes，重新冒泡到父节点的 childLanes
    // 这样 childLanes 每次 completeWork 都会重算，能自动清除已处理的更新
    newChildLanes = mergeLanes(
      newChildLanes,
      mergeLanes(child.lanes, child.childLanes),
    );

    child.return = workInProgress;
    child = child.sibling;
  }
  workInProgress.subtreeFlags |= subtreeFlags;
  workInProgress.childLanes = newChildLanes;
}
