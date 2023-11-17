import { ReactElement } from 'shared/reactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/reactSymbols';
import { FiberNode } from './fiber';

function childReconciler(shouldTrackEffect: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement,
  ) {
    //
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
          return reconcileSingleElement(returnFiber, currentFiber, newChild);
          break;

        default:
          if (__DEV__) {
            console.warn('未实现的reconcile类型', newChild);
          }
          break;
      }
    }
    // TODO 多节点情况 ul > li*3

    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return reconcileSingleTextNode();
    }
  };
}

const reconcileChildFibers = childReconciler(true);
const mountChildFibers = childReconciler(false);

export { reconcileChildFibers, mountChildFibers };
