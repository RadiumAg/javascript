import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiblerNode) {}

function renderRoot(root: FiberNode) {
  // 初始化
  prepareFreshStack(root);

  do {
    try {
      workLoop();
      break;
    } catch (e) {
      console.warn('workLoop发生错误', e);
      workInProgress = null;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pedingProps;

  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  do {
    completeWork(node);
    const sibling = node.sibling;

    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return;
    workInProgress = null;
  } while (node !== null);
}
