import { Props, ReactElement } from 'shared/reactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/reactSymbols';
import {
  FiberNode,
  createFiberFromElement,
  createWorkInProgress,
} from './fiber';
import { HostText } from './workTags';
import { ChildDeletion, Placement } from './fiberFlags';

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
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement,
  ) {
    const key = element.key;

    // eslint-disable-next-line no-restricted-syntax
    work: if (currentFiber !== null) {
      // update
      if (currentFiber.key === key) {
        // key 相同

        if (element.$$typeof === REACT_ELEMENT_TYPE) {
          if (currentFiber.type === element.type) {
            // type 相同
            const existing = useFiber(currentFiber, element.props);
            existing.return = returnFiber;
            return existing;
          }
          // 删掉旧的
          deleteChild(returnFiber, currentFiber);
          break work;
        } else if (__DEV__) {
          console.warn('还未实现的react类型', element);
          break work;
        }
      } else {
        // 删掉旧的
        deleteChild(returnFiber, currentFiber);
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

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number,
  ) {
    if (currentFiber !== null) {
      // update
      if (currentFiber.tag === HostText) {
        // 类型没变
        const existing = useFiber(currentFiber, { content });
        existing.return = returnFiber;
        return existing;
      } else {
        deleteChild(returnFiber, currentFiber);
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
          return null;
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
