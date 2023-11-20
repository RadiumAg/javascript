import { FiberNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { Container } from './hostConfig';
import { HostComponent } from './workTags';

let nextEffect: FiberNode | null = null;

const commitMutationEffect = (finishedWork: FiberNode) => {
  nextEffect = finishedWork;

  while (nextEffect !== null) {
    const child: FiberNode | null = nextEffect.child;

    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      nextEffect = child;
    } else {
      // 向上遍历
      while (nextEffect !== null) {
        commitMutationEffectsonFiber(nextEffect);
        const sibling: FiberNode | null = nextEffect.sibling;

        if (sibling !== null) {
          nextEffect = sibling;
          break;
        }

        nextEffect = nextEffect.return;
      }
    }
  }
};

const commitMutationEffectsonFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags;

  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
};

const commitPlacement = (finishedWork: FiberNode) => {
  // parent DOM
  // finishedWork ~ DOM
  if (__DEV__) {
    console.warn('执行Placement操作', finishedWork);
  }
};

function getHostParent(fiber: FiberNode) {
  const parent = fiber.return;

  while (parent) {
    const parentTag = parent.tag;

    if (parentTag === HostComponent) {
      return parent.stateNode as Container;
    }
  }
}

export { commitMutationEffect };
