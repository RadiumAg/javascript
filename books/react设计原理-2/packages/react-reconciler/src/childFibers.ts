import { Key, Props, ReactElement } from 'shared/ReactTypes';
import { REACT_ELEMENT_TYPE, REACT_FRAGEMENT_TYPE } from 'shared/ReactSymbols';
import {
  FiberNode,
  createFiberFromElement,
  createFiberFromFragement,
  createWorkInProgress,
} from './fiber';
import { Fragement, HostText } from './workTags';
import { ChildDeletion, Placement } from './fiberFlags';

type existingChildren = Map<string | number, FiberNode>;

/**
 * 创建子Fiber
 * @param {boolean} shouldTrackEffects
 * @return {*}
 */
function childReconciler(shouldTrackEffects: boolean) {
  function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
    if (!shouldTrackEffects) {
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
    if (!shouldTrackEffects) {
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
            let props = element.props;
            if (element.type === REACT_FRAGEMENT_TYPE) {
              props = element.props.chidlren;
            }
            // type 相同
            const existing = useFiber(currentFiber, props);
            existing.return = returnFiber;
            // 当前节点可复用，标记剩下的节点删除
            deleteRemainingChildren(returnFiber, currentFiber.sibling);
            return existing;
          }
          // key相同，删掉旧的
          deleteRemainingChildren(returnFiber, currentFiber);
          break;
        } else if (__DEV__) {
          console.warn('还未实现的react类型', element);
          break;
        }
      } else {
        // key不同， 删掉旧的
        deleteChild(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
      }
    }

    // 根据element创建fiber
    let fiber;
    if (element.type === REACT_FRAGEMENT_TYPE) {
      fiber = createFiberFromFragement(element.props.chidlren, key);
    } else {
      fiber = createFiberFromElement(element);
    }
    fiber.return = returnFiber;
    return fiber;
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number,
  ) {
    while (currentFiber !== null) {
      // update
      // eslint-disable-next-line unicorn/no-lonely-if
      if (currentFiber.tag === HostText) {
        // 类型没变，可以复用
        const existing = useFiber(currentFiber, { content });
        existing.return = returnFiber;
        deleteRemainingChildren(returnFiber, currentFiber.sibling);
        return existing;
      }
      deleteChild(returnFiber, currentFiber);
      currentFiber = currentFiber.sibling;
    }

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

  /**
   * 处理子节点是数组的情况
   *
   * @param {FiberNode} returnFiber
   * @param {(FiberNode | null)} currentFirstChild
   * @param {any[]} newChild
   * @return {*}
   */
  function reconcileChildrenArray(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChild: any[],
  ) {
    // 最后一个可复用fiber在current的index
    let lastPlacedIndex = 0;
    // 创建最后一个fiber
    let lastNewFiber: FiberNode | null = null;
    //创建的第一个fiber
    let firstNewFiber: FiberNode | null = null;

    // 1.将current保存在map中
    const existingChildren: existingChildren = new Map();

    let current = currentFirstChild;
    while (current !== null) {
      const keyToUse = current.key !== null ? current.key : current.index;
      existingChildren.set(keyToUse, current);
      current = current.sibling;
    }
    for (const [i, after] of newChild.entries()) {
      // 2.遍历newChild，寻找是否可复用
      const newFiber = updateFromMap(returnFiber, existingChildren, i, after);

      if (newFiber === null) {
        continue;
      }

      // 3.标记移动还是插入
      newFiber.index = i;
      newFiber.return = returnFiber;

      if (lastNewFiber === null) {
        lastNewFiber = newFiber;
        firstNewFiber = newFiber;
      } else {
        lastNewFiber.sibling = newFiber;
        lastNewFiber = lastNewFiber.sibling;
      }

      if (!shouldTrackEffects) {
        continue;
      }

      const current = newFiber.alternate;
      if (current !== null) {
        const oldIndex = current.index;
        if (oldIndex < lastPlacedIndex) {
          // 移动
          newFiber.flags |= Placement;
          continue;
        } else {
          // 不移动
          lastPlacedIndex = oldIndex;
        }
      } else {
        // mount
        newFiber.flags |= Placement;
      }
    }

    // 4.将Map中剩下的标记为删除
    existingChildren.forEach(fiber => {
      deleteChild(returnFiber, fiber);
    });

    return firstNewFiber;
  }

  /**
   * 寻找是否有复用的Fiber
   *
   * @param {FiberNode} returnFiber
   * @param {existingChildren} existingChildren
   * @param {number} index
   * @param {*} element
   * @return {*}  {(FiberNode | null)}
   */
  function updateFromMap(
    returnFiber: FiberNode,
    existingChildren: existingChildren,
    index: number,
    element: any,
  ): FiberNode | null {
    const keyToUse = element.key !== null ? element.key : index;
    const before = existingChildren.get(keyToUse);

    if (typeof element === 'string' || typeof element === 'number') {
      // HostText
      if (before) {
        // eslint-disable-next-line unicorn/no-lonely-if
        if (before.tag === HostText) {
          existingChildren.delete(keyToUse);
          return useFiber(before, { content: `${element}` });
        }
      }
      return new FiberNode(HostText, { content: `${element}` }, null);
    }

    // ReactElement
    if (typeof element === 'object' && element !== null) {
      switch (element.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (element.type === REACT_FRAGEMENT_TYPE) {
            return updateFragement(
              returnFiber,
              before,
              element,
              keyToUse,
              existingChildren,
            );
          }
          if (before && before.type === element.type) {
            existingChildren.delete(keyToUse);
            return useFiber(before, element.props);
          }

          return createFiberFromElement(element);
      }

      // TODO 数组类型
      if (Array.isArray(element) && __DEV__) {
        console.warn('还未实现数组类型的child');
        return null;
      }
    }

    if (Array.isArray(element)) {
      return updateFragement(
        returnFiber,
        before,
        element,
        keyToUse,
        existingChildren,
      );
    }

    return null;
  }

  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild: ReactElement,
  ) {
    const isUnkeyedTopLevelFragement =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGEMENT_TYPE &&
      newChild.key === null;

    if (isUnkeyedTopLevelFragement) {
      newChild = newChild.props.children;
    }

    // 判断当前fiber的类型
    if (typeof newChild === 'object' && newChild !== null) {
      // 多节点情况 ul > li * 3
      if (Array.isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFiber, newChild);
      }

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

    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild),
      );
    }

    if (currentFiber !== null) {
      deleteRemainingChildren(returnFiber, currentFiber);
    }

    if (__DEV__) {
      console.warn('未实现的reconcile类型', newChild);
    }

    return null;
  };
}

/**
 * fiber 复用
 * @param fiber
 * @param pendingProps
 * @returns
 */
function useFiber(fiber: FiberNode, pendingProps: Props): FiberNode {
  const clone = createWorkInProgress(fiber, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

function updateFragement(
  returnFiber: FiberNode,
  current: FiberNode | undefined,
  elements: any[],
  key: Key,
  existingChildren: existingChildren,
) {
  let fiber;

  if (!current || current.tag !== Fragement) {
    fiber = createFiberFromFragement(elements, key);
  } else {
    existingChildren.delete(key);
    fiber = useFiber(current, elements);
  }
  fiber.return = returnFiber;
  return fiber;
}

export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);
