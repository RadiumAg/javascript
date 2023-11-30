import { Props, ReactElement } from 'shared/reactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/reactSymbols';
import {
  FiberNode,
  createFiberFromElement,
  createWorkInProgress,
} from './fiber';
import { HostText } from './workTags';
import { ChildDeletion, Placement } from './fiberFlags';

type ExistingChildren = Map<string | number, FiberNode>;

function childReconciler(shouldTrackEffect: boolean) {
  function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
    if (!shouldTrackEffect) {
      return;
    }

    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  function deleteRemainingChildren(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
  ) {
    if (!shouldTrackEffect) {
      return;
    }

    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
  }

  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement,
  ) {
    const key = element.key;

    // eslint-disable-next-line no-restricted-syntax
    while (currentFiber !== null) {
      // update
      if (currentFiber.key === key) {
        // key 相同

        if (element.$$typeof === REACT_ELEMENT_TYPE) {
          if (currentFiber.type === element.type) {
            // type 相同
            const existing = useFiber(currentFiber, element.props);
            existing.return = returnFiber;
            // 当前节点可复用，标记剩下的节点删除
            deleteRemainingChildren(returnFiber, currentFiber);
            return existing;
          }
          // key相同，type不同 删掉所有旧的
          deleteRemainingChildren(returnFiber, currentFiber);
          break;
        } else if (__DEV__) {
          console.warn('还未实现的react类型', element);
          break;
        }
      } else {
        // key不同，删掉旧的
        deleteChild(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
      }
    }
    const fiber = createFiberFromElement(element);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffect && fiber.alternate === null) {
      fiber.flags = Placement;
    }

    return fiber;
  }

  function reconcileChildrenArray(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newCHild: any[],
  ) {
    //1. 将current保存在map中
    const existingChildren: ExistingChildren = new Map();
    let current = currentFirstChild;
    while (current !== null) {
      const keyToUse = current.key !== null ? current.key : current?.index;
      existingChildren.set(keyToUse, current);
      current = current.sibling;
    } 
    //2. 遍历newChild,选中是否可复用
    //3. 标记移动还是插入
    //4. 将Map中剩下的标记为删除
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number,
  ) {
    while (currentFiber !== null) {
      // update
      if (currentFiber.tag === HostText) {
        // 类型没变, 可以复用
        const existing = useFiber(currentFiber, { content });
        existing.return = returnFiber;
        deleteRemainingChildren(returnFiber, currentFiber.sibling);
        return existing;
      } else {
        deleteChild(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
      }
    }
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }

  return (
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElement,
  ) => {
    // 判断当前fiber的类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild),
          );

        default:
          if (__DEV__) {
            console.warn('未实现的reconcile类型', newChild);
          }
      }

      if (Array.isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFiber, newChild);
      }
    }
    // TODO 多节点情况 ul > li*3

    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild),
      );
    }

    if (currentFiber) deleteChild(returnFiber, currentFiber);

    return null;
  };
}

function useFiber(fiber: FiberNode, pendingProps: Props): FiberNode {
  const clone = createWorkInProgress(fiber, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

const reconcileChildFibers = childReconciler(true);
const mountChildFibers = childReconciler(false);

export { reconcileChildFibers, mountChildFibers };
