import {
  Container,
  Instance,
  appendChildToContainer,
  commitUpdate,
  insertChildToContainer,
  removeChild,
} from 'hostConfig';
import { effect } from 'vue';
import {
  ChildDeletion,
  Flags,
  MutationMask,
  NoFlags,
  PassiveEffect,
  Placement,
  Update,
} from './fiberFlags';
import { FiberNode, FiberRootNode, PendingPassiveEffects } from './fiber';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from './workTags';
import { Effect, FCUpdateQueue } from './fiberHooks';
import { HookHasEffect } from './hookEffectTags';
let nextEffect: FiberNode | null = null;

export const commitMutationEffect = (
  finishedWork: FiberNode,
  root: FiberRootNode,
) => {
  nextEffect = finishedWork;

  while (nextEffect !== null) {
    // 向下遍历
    const child: FiberNode | null = nextEffect.child;
    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      nextEffect = child;
    } else {
      // 向上遍历
      // eslint-disable-next-line no-restricted-syntax
      up: while (nextEffect !== null) {
        commitMutationEffectOnFiber(nextEffect, root);
        const sibling: FiberNode | null = nextEffect.sibling;
        if (sibling !== null) {
          nextEffect = sibling;
          break up;
        }
        nextEffect = nextEffect.return;
      }
    }
  }
};

const commitMutationEffectOnFiber = (
  finishedWork: FiberNode,
  root: FiberRootNode,
) => {
  const flags = finishedWork.flags;

  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }

  // flags Update
  if ((flags & Update) !== NoFlags) {
    commitUpdate(finishedWork);
    finishedWork.flags &= ~Update;
  }

  // flags ChildDeletion
  if ((flags & ChildDeletion) !== NoFlags) {
    const delections = finishedWork.deletions;
    if (delections !== null) {
      delections.forEach(childToDelete => {
        commitDeleteion(childToDelete, root);
      });
    }
    finishedWork.flags &= ~ChildDeletion;
  }

  if ((flags & PassiveEffect) !== NoFlags) {
    // 收集回调
    finishedWork.flags & ~PassiveEffect;
    commitPassiveEffect(finishedWork, root, 'update');
  }
};

/**
 * 收集useEffect
 *
 * @param {FiberNode} fiber
 * @param {FiberRootNode} root
 * @param {keyof PendingPassiveEffects} type
 */
function commitPassiveEffect(
  fiber: FiberNode,
  root: FiberRootNode,
  type: keyof PendingPassiveEffects,
) {
  // update unmount
  if (
    fiber.tag !== FunctionComponent ||
    (type === 'update' && (fiber.flags & PassiveEffect) === NoFlags)
  ) {
    return;
  }

  const updateQueue = fiber.updateQueue as FCUpdateQueue<any>;

  if (updateQueue !== null) {
    if (updateQueue.lastEffect === null && __DEV__) {
      console.error('当FC存在PassiveEffect flags时，不应该不存在effect');
    }
    root.pendingPassiveEffects[type].push(updateQueue.lastEffect!);
  }
}

/**
 * 执行destory
 *
 * @export
 * @param {Flags} flags
 * @param {Effect} lastEffect
 */
export function commitHookEffectListUnmount(flags: Flags, lastEffect: Effect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const desotry = effect.destory;
    if (typeof desotry === 'function') {
      desotry();
    }
    effect.tag &= ~HookHasEffect;
  });
}

/**
 * 执行destory
 *
 * @export
 * @param {Flags} flags
 * @param {Effect} lastEffect
 */
export function commitHookEffectListDestory(flags: Flags, lastEffect: Effect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const desotry = effect.destory;
    if (typeof desotry === 'function') {
      desotry();
    }
    effect.tag &= ~HookHasEffect;
  });
}

/**
 * 执行destory
 *
 * @export
 * @param {Flags} flags
 * @param {Effect} lastEffect
 */
export function commitHookEffectListCreate(flags: Flags, lastEffect: Effect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const create = effect.create;
    if (typeof create === 'function') {
      effect.destory = create();
    }
  });
}

function commitHookEffectList(
  flags: Flags,
  lastEffect: Effect,
  callback: (effect: Effect) => void,
) {
  let effect = lastEffect.next as Effect;

  do {
    if ((effect.tag & flags) === flags) {
      callback(effect);
    }

    effect = effect.next as Effect;
  } while (effect !== lastEffect.next);
}

function recordHostChidlrenToDelete(
  childrenToDelete: FiberNode[],
  unmountFiber: FiberNode,
) {
  // 1. 找到第一个root host 节点
  const lastOne = childrenToDelete[childrenToDelete.length - 1];
  if (!lastOne) {
    childrenToDelete.push(unmountFiber);
  } else {
    let node = lastOne.sibling;

    while (node !== null) {
      if (unmountFiber === node) {
        childrenToDelete.push(unmountFiber);
      }
      node = node.sibling;
    }
  }
  // 2. 每找到一个 host 节点，判断下个节点是不是
}

function commitDeleteion(childToDelete: FiberNode, root: FiberRootNode) {
  const rootChildrenToDelete: FiberNode[] = [];

  // 递归子树
  commitNestedComponent(childToDelete, unmountFiber => {
    switch (unmountFiber.tag) {
      case HostComponent:
        recordHostChidlrenToDelete(rootChildrenToDelete, unmountFiber);
        //TODO 解绑ref
        return;

      case HostText:
        recordHostChidlrenToDelete(rootChildrenToDelete, unmountFiber);
        return;

      case FunctionComponent:
        //TODO useEffect unmount
        commitPassiveEffect(unmountFiber, root, 'unmount');
        break;

      default:
        if (__DEV__) {
          console.warn('未处理的unmount类型', unmountFiber.tag);
        }
    }
  });

  // 移除rootHostComponent的DOM
  if (rootChildrenToDelete.length > 0) {
    const hostParent = getHostParent(childToDelete);

    // eslint-disable-next-line eqeqeq
    if (hostParent != null) {
      rootChildrenToDelete.forEach(node => {
        removeChild(node.stateNode, hostParent);
      });
    }
  }

  childToDelete.return = null;
  childToDelete.child = null;
}

function commitNestedComponent(
  root: FiberNode,
  onCommitUnmount: (fiber: FiberNode) => void,
) {
  let node = root;
  while (true) {
    onCommitUnmount(node);

    if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === root) {
      // 终止条件
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === root) {
        return;
      }
      //向上归
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

const commitPlacement = (finishedWork: FiberNode) => {
  if (__DEV__) {
    console.warn('执行Placement操作', finishedWork);
  }
  // parent DOM
  const hostParent = getHostParent(finishedWork);

  // host sibling
  const sibling = getHostSibling(finishedWork);

  // finishedWork ~~ DOM
  insertOrAppendPlacementNodeInToContainer(finishedWork, hostParent!, sibling);
};

function getHostSibling(fiber: FiberNode) {
  let node: FiberNode = fiber;

  // eslint-disable-next-line no-restricted-syntax
  findSibling: while (true) {
    while (node.sibling === null) {
      const parent = node.return;

      if (
        parent === null ||
        parent.tag === HostComponent ||
        parent.tag === HostRoot
      ) {
        return null;
      }
      node = parent;
    }

    node.sibling.return = node.return;
    node = node.sibling;

    while (node.tag !== HostText && node.tag !== HostComponent) {
      // 向下遍历
      if ((node.flags & Placement) !== NoFlags) {
        continue findSibling;
      }

      if (node.child === null) {
        continue findSibling;
      } else {
        node.child.return = node;
        node = node.child;
      }
    }

    if ((node.flags & Placement) === NoFlags) {
      return node.stateNode;
    }
  }
}

function getHostParent(fiber: FiberNode) {
  let parent = fiber.return;

  while (parent) {
    const parentTag = parent.tag;
    // hostComponent HostRoot
    if (parentTag === HostComponent) {
      return parent.stateNode as Container;
    }

    if (parentTag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container;
    }
    parent = parent.return;
  }

  if (__DEV__) {
    console.warn('未找到host parent');
  }
}

function insertOrAppendPlacementNodeInToContainer(
  finishedWork: FiberNode,
  hostParent: Container,
  before?: Instance,
) {
  // fiber host
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    if (before) {
      insertChildToContainer(finishedWork.stateNode, hostParent, before);
      return;
    } else {
      appendChildToContainer(hostParent, finishedWork.stateNode);
      return;
    }
  }

  const child = finishedWork.child;

  if (child !== null) {
    insertOrAppendPlacementNodeInToContainer(child, hostParent);
    let sibing = child.sibling;

    if (sibing !== null) {
      insertOrAppendPlacementNodeInToContainer(sibing, hostParent);
      sibing = sibing.sibling;
    }
  }
}
