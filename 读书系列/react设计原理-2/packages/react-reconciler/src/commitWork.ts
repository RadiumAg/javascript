import { Container, appendChildToContainer } from 'hostConfig';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { FiberNode, FiberRootNode } from './filber';
import { HostComponent, HostRoot, HostText } from './workTags';
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

  // flags ChildDeletion
};

const commitPlacement = (finishedWork: FiberNode) => {
  if (__DEV__) {
    console.warn('执行Placement操作', finishedWork);
  }
  // parent DOM
  const hostParent = getHostParent(finishedWork);
  // finishedWork ~~ DOM
  apendPlacementNodeInToContainer(finishedWork, hostParent!);
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

function apendPlacementNodeInToContainer(
  finishedWork: FiberNode,
  hostParent: Container,
) {
  // fiber host
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(finishedWork.stateNode, hostParent!);
  }

  const child = finishedWork.child;

  if (child !== null) {
    apendPlacementNodeInToContainer(child, hostParent);
    let sibing = child.sibling;

    if (sibing !== null) {
      apendPlacementNodeInToContainer(sibing, hostParent);
      sibing = sibing.sibling;
    }
  }
}
