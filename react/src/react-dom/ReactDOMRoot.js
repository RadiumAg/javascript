import { createFiber } from '../types/Fiber.js';
import { createUpdateQueue, createUpdate, enqueueUpdate } from '../types/UpdateQueue.js';
import { scheduleUpdateOnFiber } from '../reconciler/ReactFiberWorkLoop.js';
import { HostRoot, NoLanes, ConcurrentMode } from '../types/constants.js';

/**
 * React DOM Root 实现
 */
class ReactDOMRoot {
  constructor(container, options = {}) {
    this._internalRoot = this.createRoot(container, options);
  }

  createRoot(container, options) {
    const root = createFiber(HostRoot, null, null, ConcurrentMode);
    
    const fiberRoot = {
      containerInfo: container,
      current: root,
      pendingContext: null,
      context: null,
      isDehydrated: false,
      callbackNode: null,
      callbackPriority: NoLanes,
      pendingLanes: NoLanes,
      finishedWork: null,
      finishedLanes: NoLanes,
      tag: 1, // ConcurrentRoot
    };

    root.stateNode = fiberRoot;
    root.updateQueue = createUpdateQueue(null);

    return fiberRoot;
  }

  render(element) {
    const root = this._internalRoot;
    const current = root.current;
    
    const eventTime = performance.now();
    const lane = 1; // SimpleLane
    const update = createUpdate(eventTime, lane);
    
    update.payload = { element };
    
    const rootFiber = enqueueUpdate(current, update, lane);
    
    if (rootFiber !== null) {
      scheduleUpdateOnFiber(root, current, lane, eventTime);
    }
  }

  unmount() {
    const root = this._internalRoot;
    if (root !== null) {
      this._internalRoot = null;
      const container = root.containerInfo;
      this.render(null);
      container.textContent = '';
    }
  }
}

/**
 * 创建根节点
 */
export function createRoot(container, options) {
  if (!container || !container.nodeType) {
    throw new Error('createRoot(...): Target container is not a DOM element.');
  }

  return new ReactDOMRoot(container, options);
}

/**
 * Legacy 渲染方法
 */
export function render(element, container, callback) {
  let root = container._reactRootContainer;
  
  if (!root) {
    root = container._reactRootContainer = new ReactDOMRoot(container);
  }

  root.render(element);
  
  if (callback) {
    callback();
  }
}

/**
 * 卸载组件
 */
export function unmountComponentAtNode(container) {
  if (!container || !container._reactRootContainer) {
    return false;
  }

  const root = container._reactRootContainer;
  root.unmount();
  delete container._reactRootContainer;
  return true;
}