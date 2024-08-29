import { Container } from 'hostConfig';
import { ReactElement } from 'shared/reactTypes';
import {
  unstable_ImmediatePriority,
  unstable_runWithPriority,
} from 'scheduler';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
  UpdateQueue,
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { requestUpdateLanes } from './fiberLanes';

function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();

  return root;
}

function updateContainer(element: ReactElement | null, root: FiberRootNode) {
  unstable_runWithPriority(unstable_ImmediatePriority, () => {
    const hostRootFiber = root.current;
    const lane = requestUpdateLanes();
    const update = createUpdate<ReactElement | null>(element, lane);
    enqueueUpdate(
      hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
      update,
    );
    scheduleUpdateOnFiber(hostRootFiber, lane);
  });
  return element;
}

export { createContainer, updateContainer };
