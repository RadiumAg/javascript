import { Container } from 'hostConfig';
import { ReactElement } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
  UpdateQueue,
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';

export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

export function updateContainer(
  element: ReactElement | null,
  root: FiberRootNode,
) {
  const hostRootFiber = root.current;
  // root component
  const update = createUpdate<ReactElement | null>(element);
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
    update,
  );
  scheduleUpdateOnFiber(hostRootFiber);
  return element;
}
