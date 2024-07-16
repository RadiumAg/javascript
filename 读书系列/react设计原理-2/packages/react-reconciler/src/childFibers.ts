import { ReactElement } from 'shared/ReactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { FiberNode } from './filber';

function childReconciler(shouldTrackEffects: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement,
  ) {
    // 根据element创建fiber
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
          return reconcileSingleElement();

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
      return reconcileSingleTextNode();
    }

    if (__DEV__) {
      console.warn('未实现的reconcile类型', newChild);
    }
    break;
  };
}

export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);
