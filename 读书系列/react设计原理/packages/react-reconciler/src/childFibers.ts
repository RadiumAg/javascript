import { Key, Props, ReactElement } from 'shared/reactTypes';
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from 'shared/reactSymbols';
import {
  FiberNode,
  createFiberFromElement,
  createFiberFromFragment,
  createWorkInProgress,
} from './fiber';
import { Fragment, HostText } from './workTags';
import { ChildDeletion, Placement } from './fiberFlags';

type ExistingChildren = Map<string | number, FiberNode>;

function childReconciler(shouldTrackEffect: boolean) {
  function deleteRemainChildren(
    returnFiber: FiberNode,
    childToDelete: FiberNode,
  ) {
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
      deleteRemainChildren(returnFiber, childToDelete);
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
            if (element.type === REACT_FRAGMENT_TYPE) {
              props = element.props.children;
            }

            // type 相同
            const existing = useFiber(currentFiber, props);
            existing.return = returnFiber;
            // 当前节点可复用，标记剩下的节点删除
            deleteRemainingChildren(returnFiber, currentFiber.sibling);
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
        deleteRemainChildren(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
      }
    }
    let fiber;
    if (element.type === REACT_FRAGMENT_TYPE) {
      fiber = createFiberFromFragment(element.props.children, key);
    } else {
      fiber = createFiberFromElement(element);
    }
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffect && fiber.alternate === null) {
      fiber.flags = Placement;
    }

    return fiber;
  }

  /**
   * 协调List
   * @param returnFiber
   * @param currentFirstChild
   * @param newChild
   * @returns
   */
  function reconcileChildrenArray(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChild: any[],
  ) {
    let lastPlacedIndex = 0;
    let lastNewFiber: FiberNode | null = null;
    let firstNewFiber: FiberNode | null = null;

    //1. 将current保存在map中
    const existingChildren: ExistingChildren = new Map();
    let current = currentFirstChild;
    while (current !== null) {
      const keyToUse = current.key !== null ? current.key : current?.index;
      existingChildren.set(keyToUse, current);
      current = current.sibling;
    }

    for (const [i, after] of newChild.entries()) {
      //2. 遍历newChild,选中是否可复用
      const newFiber = updateFromMap(returnFiber, existingChildren, i, after);

      if (newFiber === null) {
        continue;
      }

      //3. 标记移动还是插入
      newFiber.index = i;
      newFiber.return = returnFiber;

      if (lastNewFiber === null) {
        lastNewFiber = newFiber;
        firstNewFiber = newFiber;
      } else {
        lastNewFiber.sibling = newFiber;
        lastNewFiber = lastNewFiber.sibling;
      }

      if (!shouldTrackEffect) {
        continue;
      }

      const current = newFiber.alternate;
      if (current !== null) {
        const oldIndex = current.index;

        if (oldIndex < lastPlacedIndex) {
          // 移动
          newFiber.flags |= Placement;
        } else {
          // 不移动
          lastPlacedIndex = oldIndex;
        }
      } else {
        // mount
        newFiber.flags |= Placement;
      }
    }

    //4. 将Map中剩下的标记为删除
    existingChildren.forEach(fiber => {
      deleteRemainChildren(returnFiber, fiber);
    });

    return firstNewFiber;
  }

  function updateFromMap(
    returnFiber: FiberNode,
    existingChildren: ExistingChildren,
    index: number,
    element: any,
  ): FiberNode | null {
    const keyToUse = element.key !== null ? element.key : index;
    const before = existingChildren.get(keyToUse);

    //HostText
    if (typeof element === 'string' || typeof element === 'number') {
      if (before) {
        if (before.tag === HostText) {
          existingChildren.delete(keyToUse);
          return useFiber(before, { content: `${element}` });
        }
      } else {
        return new FiberNode(HostText, { content: `${element}` }, null);
      }
    }

    // ReactElement
    if (typeof element === 'object' && element !== null) {
      switch (element.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (element.type === REACT_FRAGMENT_TYPE) {
            return updateFragment(
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

      // TODO数组类型
      if (Array.isArray(element) && __DEV__) {
        console.warn('还未处理数组的实现');
      }
    }

    if (Array.isArray(element)) {
      return updateFragment(
        returnFiber,
        before,
        element,
        keyToUse,
        existingChildren,
      );
    }

    return null;
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
        deleteRemainChildren(returnFiber, currentFiber);
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
    newChild?: any,
  ) => {
    // 判断Fragment
    const isUnkeyedTolLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_ELEMENT_TYPE &&
      newChild.key === null;

    if (isUnkeyedTolLevelFragment) {
      newChild = newChild.props.children;
    }
    // 判断当前fiber的类型
    if (typeof newChild === 'object' && newChild !== null) {
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
            return null;
          }
      }
    }
    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild),
      );
    }

    if (currentFiber) deleteRemainChildren(returnFiber, currentFiber);

    return null;
  };
}

function useFiber(fiber: FiberNode, pendingProps: Props): FiberNode {
  const clone = createWorkInProgress(fiber, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

function updateFragment(
  returnFiber: FiberNode,
  current: FiberNode | undefined,
  elements: any[],
  key: Key,
  existingChildren: ExistingChildren,
) {
  let fiber;
  if (!current || current.tag !== Fragment) {
    fiber = createFiberFromFragment(elements, key);
  } else {
    existingChildren.delete(key);
    fiber = useFiber(current, elements);
  }
  fiber.return = returnFiber;
  return fiber;
}

const reconcileChildFibers = childReconciler(true);
const mountChildFibers = childReconciler(false);

export { reconcileChildFibers, mountChildFibers };
