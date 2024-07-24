import { ReactElement } from 'shared/ReactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { FiberNode, createFiberFromElement } from './fiber';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

function childReconciler(shouldTrackEffects: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement,
  ) {
    // 根据element创建fiber
    const filber = createFiberFromElement(element);
    filber.return = returnFiber;
    return filber;
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number,
  ) {
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }

  /**
   * 打标记
   * @param fiber
   * @returns
   */
  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement;
    }

    return fiber;
  }

  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild: ReactElement,
  ) {
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
          break;
      }
    }

    // 多节点情况 ul > li*3
    // HostText

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild),
      );
    }

    if (__DEV__) {
      console.warn('未实现的reconcile类型', newChild);
    }

    return null;
  };
}

export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);
