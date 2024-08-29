import { FiberNode } from 'react-reconciler/src/fiber';
import { HostText } from 'react-reconciler/src/workTags';
import type { Props } from 'shared/reactTypes';

interface Container {
  rootID: number;
  children: (Instance | TextInstance)[];
}

interface Instance {
  id: number;
  type: string;
  children: any[];
  parent: number;
  props: Props;
}
interface TextInstance {
  text: string;
  id: number;
  parent: number;
}

let instanceCounter = 0;
const createInstance = (type: string, props: Props) => {
  const instance = {
    id: instanceCounter,
    type,
    children: [],
    parent: -1,
    props,
  };

  return instance;
};

function commitTextUpdate(textInstance: TextInstance, content: string) {
  textInstance.text = content;
}

const appendInitialChild = (parent: Instance | Container, child: Instance) => {
  const prevParentID = child.parent;
  const parentID = 'rootID' in parent ? parent.rootID : parent.id;

  if (prevParentID !== -1 && prevParentID !== parentID) {
    throw new Error('不能重复挂载child');
  }

  child.parent = parentID;
  parent.children.push(child);
};

const createTextInstance = (content: string) => {
  const instance = {
    text: content,
    id: instanceCounter++,
    parent: -1,
  };

  return instance;
};

export function commitUpdate(fiber: FiberNode) {
  switch (fiber.tag) {
    case HostText: {
      const text = fiber.memoizedProps?.content;
      return commitTextUpdate(fiber.stateNode, text);
    }
    default:
      if (__DEV__) {
        console.warn('未实现的Update类型', fiber);
      }
      break;
  }
}

function insertChildToContainer(
  child: Instance,
  container: Container,
  before: Instance,
) {
  const beforeIndex = container.children.indexOf(before);

  if (beforeIndex === -1) {
    throw new Error('before不存在');
  }

  const index = container.children.indexOf(child);

  if (index !== -1) {
    container.children.splice(index, 1);
  }
  container.children.splice(beforeIndex, 0, child);
}

function removeChild(child: Instance | TextInstance, container: Container) {
  const index = container.children.indexOf(child);
  if (index === -1) {
    throw new Error('child不存在');
  }
  container.children.splice(index, 1);
}

const scheduleMicroTask =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : typeof Promise === 'function'
    ? (callback: (...args: any[]) => void) =>
        Promise.resolve(null).then(callback)
    : setTimeout;

const appendChildToContainer = (parent: any, child: Instance) => {
  const prevParentID = child.parent;
  const parentID = 'rootID' in parent ? parent.rootID : parent.id;

  if (prevParentID !== -1 && prevParentID !== parent.rootID) {
    throw new Error('不能重复挂载child');
  }

  child.parent = parentID;
  parent.children.push(child);
};

export {
  scheduleMicroTask,
  removeChild,
  createInstance,
  appendInitialChild,
  createTextInstance,
  appendChildToContainer,
  insertChildToContainer,
};
export type { Container, Instance };
