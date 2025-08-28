import { createFiberFromElement, createFiberFromText, createWorkInProgress } from '../types/Fiber.ts';
import { REACT_ELEMENT_TYPE } from '../types/ReactElement.ts';
import { Placement, Deletion, ChildDeletion, NoFlags, HostText } from '../types/constants.ts';

/**
 * 创建子Fiber协调器
 */
export function ChildReconciler(shouldTrackSideEffects) {
  
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) return;
    
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
    const key = element.key;
    let child = currentFirstChild;
    
    while (child !== null) {
      if (child.key === key && child.elementType === element.type) {
        // 可以复用
        const existing = createWorkInProgress(child, element.props);
        existing.ref = element.ref;
        existing.return = returnFiber;
        existing.sibling = null;
        return existing;
      }
      deleteChild(returnFiber, child);
      child = child.sibling;
    }

    // 创建新fiber
    const created = createFiberFromElement(element, returnFiber.mode, lanes);
    created.ref = element.ref;
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, lanes) {
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      const existing = createWorkInProgress(currentFirstChild, textContent);
      existing.return = returnFiber;
      existing.sibling = null;
      return existing;
    }
    
    const created = createFiberFromText(textContent, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let oldFiber = currentFirstChild;
    let newIdx = 0;

    // 处理新子节点
    for (; newIdx < newChildren.length; newIdx++) {
      const newChild = newChildren[newIdx];
      let newFiber = null;

      if (typeof newChild === 'object' && newChild !== null) {
        if (newChild.$$typeof === REACT_ELEMENT_TYPE) {
          newFiber = createFiberFromElement(newChild, returnFiber.mode, lanes);
          newFiber.ref = newChild.ref;
        }
      } else if (typeof newChild === 'string' || typeof newChild === 'number') {
        newFiber = createFiberFromText('' + newChild, returnFiber.mode, lanes);
      }

      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          newFiber.flags |= Placement;
        }
        newFiber.return = returnFiber;
        newFiber.index = newIdx;

        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }

    // 删除剩余的旧子节点
    while (oldFiber !== null) {
      deleteChild(returnFiber, oldFiber);
      oldFiber = oldFiber.sibling;
    }

    return resultingFirstChild;
  }

  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes);
      }

      if (Array.isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
      }
    }

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, lanes);
    }

    // 删除剩余子节点
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  return reconcileChildFibers;
}

// 导出协调函数
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);