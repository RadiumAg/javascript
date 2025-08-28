import { HostComponent, HostText, HostRoot, FunctionComponent, NoFlags, Update, Ref } from '../types/constants.js';

/**
 * 完成工作 - Fiber完成阶段
 */
export function completeWork(current, workInProgress, renderLanes) {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case FunctionComponent:
    case HostRoot:
      bubbleProperties(workInProgress);
      return null;
      
    case HostComponent: {
      if (current !== null && workInProgress.stateNode != null) {
        // 更新现有DOM元素
        if (current.ref !== workInProgress.ref) {
          markRef(workInProgress);
        }
      } else {
        // 创建新DOM元素
        const instance = document.createElement(workInProgress.type);
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;

        if (workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      }
      bubbleProperties(workInProgress);
      return null;
    }
    
    case HostText: {
      const newText = newProps;
      if (current && workInProgress.stateNode != null) {
        const oldText = current.memoizedProps;
        if (oldText !== newText) {
          markUpdate(workInProgress);
        }
      } else {
        workInProgress.stateNode = document.createTextNode(newText);
      }
      bubbleProperties(workInProgress);
      return null;
    }
    
    default:
      bubbleProperties(workInProgress);
      return null;
  }
}

/**
 * 冒泡属性
 */
function bubbleProperties(workInProgress) {
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

/**
 * 添加所有子元素到父元素
 */
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      parent.appendChild(node.stateNode);
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
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function markUpdate(workInProgress) {
  workInProgress.flags |= Update;
}

function markRef(workInProgress) {
  workInProgress.flags |= Ref;
}