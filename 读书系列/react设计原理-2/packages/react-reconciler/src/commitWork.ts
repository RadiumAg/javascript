import {
  Container,
  appendChildToContainer,
  commitUpdate,
  removeChild,
} from 'hostConfig';
import {
  ChildDeletion,
  MutationMask,
  NoFlags,
  Placement,
  Update,
} from './fiberFlags';
import { FiberNode, FiberRootNode } from './fiber';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from './workTags';
let nextEffect: FiberNode | null = null;

export const commitMutationEffect = (finishedWork: FiberNode) => {
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
        commitMutationEffectOnFiber(nextEffect);
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

const commitMutationEffectOnFiber = (finishedWork: FiberNode) => {
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
        commitDeleteion(childToDelete);
      });
    }
    finishedWork.flags &= ~ChildDeletion;
  }
};

function commitDeleteion(childToDelete: FiberNode) {
  let rootHostNode: FiberNode | null = null;

  // 递归子树
  commitNestedComponent(childToDelete, unmountFiber => {
    switch (unmountFiber.tag) {
      case HostComponent:
        if (rootHostNode === null) {
          rootHostNode = unmountFiber;
        }
        //TODO 解绑ref
        return;

      case HostText:
        if (rootHostNode === null) {
          rootHostNode = unmountFiber;
        }
        return;

      case FunctionComponent:
        //TODO useEffect unmount
        break;

      default:
        if (__DEV__) {
          console.warn('未处理的unmount类型', unmountFiber.tag);
        }
    }
  });

  // 移除rootHostComponent的DOM
  if (rootHostNode !== null) {
    const hostParent = getHostParent(childToDelete);

    // eslint-disable-next-line eqeqeq
    if (hostParent != null) {
      removeChild((rootHostNode as FiberNode).stateNode, hostParent);
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
  // finishedWork ~~ DOM
  appendPlacementNodeInToContainer(finishedWork, hostParent!);
};

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

function appendPlacementNodeInToContainer(
  finishedWork: FiberNode,
  hostParent: Container,
) {
  // fiber host
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(hostParent!, finishedWork.stateNode);
  }

  const child = finishedWork.child;

  if (child !== null) {
    appendPlacementNodeInToContainer(child, hostParent);
    let sibing = child.sibling;

    if (sibing !== null) {
      appendPlacementNodeInToContainer(sibing, hostParent);
      sibing = sibing.sibling;
    }
  }
}
