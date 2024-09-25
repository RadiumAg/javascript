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
import { requestUpdateLanes } from './fiberLanes';

/**
 * 创建FiberRootNode
 *
 * @export
 * @param {Container} container
 * @return {*}
 */
export function createContainer(container: Container) {
  // App组件
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

/**
 * 创建更新队列
 *
 * @export
 * @param {(ReactElement | null)} element
 * @param {FiberRootNode} root
 * @return {*}
 */
export function updateContainer(
  element: ReactElement | null,
  root: FiberRootNode,
) {
  const hostRootFiber = root.current;
  const lane = requestUpdateLanes();
  // root component
  const update = createUpdate<ReactElement | null>(element, lane);
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
    update,
  );
  scheduleUpdateOnFiber(hostRootFiber, lane);
  return element;
}
