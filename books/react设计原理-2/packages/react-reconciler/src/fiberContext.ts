import { ReactContext } from '../../shared/ReactTypes';
import { ContextItem, FiberNode } from './fiber';
import { ContextProvider } from './workTags';
import { Lane, mergeLanes, isSubsetOfLanes } from './fiberLanes';

// context 值的栈：支持嵌套 Provider，进入 Provider 时 push，离开时 pop
let prevContextValue: any = null;
const prevContextValueStack: any[] = [];

// 当前正在收集依赖的 fiber 的最后一个 contextItem（构成单向链表）
let lastContextDep: ContextItem<any> | null = null;

/**
 * 进入 Provider（beginWork）：保存旧值，写入新值
 */
export function pushProvider<T>(context: ReactContext<T>, newValue: T) {
  prevContextValueStack.push(prevContextValue);
  prevContextValue = context._currentValue;
  context._currentValue = newValue;
}

/**
 * 离开 Provider（completeWork）：恢复旧值
 */
export function popProvider<T>(context: ReactContext<T>) {
  context._currentValue = prevContextValue;
  prevContextValue = prevContextValueStack.pop();
}

/**
 * 渲染函数组件前调用：重置依赖收集状态
 * render 过程中每次 useContext 会通过 readContext 重新收集依赖
 */
export function prepareToReadContext(wip: FiberNode) {
  lastContextDep = null;
  wip.dependencies = null;
}

/**
 * useContext 的真实实现：读取当前 context 值，并把该依赖记录到 consumer 上
 * 依赖信息用于后续 Provider 值变化时精确定位到消费者
 */
export function readContext<T>(
  consumer: FiberNode | null,
  context: ReactContext<T>,
): T {
  if (consumer === null) {
    throw new Error('useContext 只能在函数组件中调用');
  }
  const value = context._currentValue;

  const contextItem: ContextItem<T> = {
    context,
    memoizedState: value,
    next: null,
  };

  if (lastContextDep === null) {
    lastContextDep = contextItem;
    consumer.dependencies = { firstContext: contextItem };
  } else {
    lastContextDep = lastContextDep.next = contextItem;
  }

  return value;
}

/**
 * Provider 值变化时，向下遍历子树，找到消费了该 context 的 fiber，
 * 给它们标记 renderLane（使其无法 bailout），并沿途标记 childLanes，
 * 保证即使中间有 bailout / memo 组件，更新也能穿透到达消费者。
 */
export function propagateContextChange<T>(
  wip: FiberNode,
  context: ReactContext<T>,
  renderLane: Lane,
) {
  let fiber = wip.child;
  if (fiber !== null) {
    fiber.return = wip;
  }

  while (fiber !== null) {
    let nextFiber: FiberNode | null = null;
    const deps = fiber.dependencies;

    if (deps !== null) {
      nextFiber = fiber.child;

      let contextItem = deps.firstContext;
      while (contextItem !== null) {
        if (contextItem.context === context) {
          // 找到消费者：标记 lanes（自身 + alternate，兼容双缓存）
          fiber.lanes = mergeLanes(fiber.lanes, renderLane);
          const alternate = fiber.alternate;
          if (alternate !== null) {
            alternate.lanes = mergeLanes(alternate.lanes, renderLane);
          }
          // 从消费者向上到当前 Provider，标记路径上的 childLanes
          scheduleContextWorkOnParentPath(fiber.return, wip, renderLane);
          break;
        }
        contextItem = contextItem.next;
      }
    } else if (fiber.tag === ContextProvider) {
      // 遇到同一个 context 的内层 Provider，则不再深入（被内层覆盖）
      nextFiber = fiber.type === wip.type ? null : fiber.child;
    } else {
      nextFiber = fiber.child;
    }

    if (nextFiber !== null) {
      nextFiber.return = fiber;
    } else {
      // 到达叶子：找兄弟节点，否则向上回溯
      nextFiber = fiber;
      while (nextFiber !== null) {
        if (nextFiber === wip) {
          nextFiber = null;
          break;
        }
        const sibling = nextFiber.sibling;
        if (sibling !== null) {
          sibling.return = nextFiber.return;
          nextFiber = sibling;
          break;
        }
        nextFiber = nextFiber.return;
      }
    }
    fiber = nextFiber;
  }
}

/**
 * 从消费者的父节点开始，一直到 Provider，标记沿途 childLanes，
 * 使 bailout 时能通过 childLanes 继续克隆子节点向下走
 */
function scheduleContextWorkOnParentPath(
  from: FiberNode | null,
  to: FiberNode,
  renderLane: Lane,
) {
  let node = from;

  while (node !== null) {
    const alternate = node.alternate;

    if (!isSubsetOfLanes(node.childLanes, renderLane)) {
      node.childLanes = mergeLanes(node.childLanes, renderLane);
      if (alternate !== null) {
        alternate.childLanes = mergeLanes(alternate.childLanes, renderLane);
      }
    } else if (
      alternate !== null &&
      !isSubsetOfLanes(alternate.childLanes, renderLane)
    ) {
      alternate.childLanes = mergeLanes(alternate.childLanes, renderLane);
    }

    if (node === to) {
      break;
    }
    node = node.return;
  }
}
