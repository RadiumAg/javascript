import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import { createUpdateQueue } from './updateQueue';
import { ReactElement } from 'shared/reactTypes';

function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
}

function updateContainer(element: ReactElement | null) {
  const  hostRootFiber = root.current
  const update = createUpdate<ReactElemet | null>();
}

export { createContainer, updateContainer };
