import { FiberNode } from 'react-reconciler/src/fiber';
import { HostComponent, HostText } from 'react-reconciler/src/workTags';
import { updateFiberProps } from './systemEvent';
import type { DOMElement } from './systemEvent';
import type { Props } from 'shared/reactTypes';

type Container = Element;
type Instance = Element;
type TextInstance = Text;

const createInstance = (type: string, props: Props) => {
  // TODO 处理props
  const element = document.createElement(type) as unknown;
  updateFiberProps(element as DOMElement, props);
  return element as DOMElement;
};

function commitTextUpdate(textInstance: TextInstance, content: string) {
  textInstance.textContent = content;
}

const appendInitialChild = (
  parent: Instance | Container | undefined,
  child: Instance | undefined,
) => {
  if (!child || !parent) return;
  parent.append(child);
};

const createTextInstance = (content: string) => {
  return document.createTextNode(content);
};

export function commitUpdate(fiber: FiberNode) {
  switch (fiber.tag) {
    case HostText: {
      const text = fiber.memoizedProps?.content;
      return commitTextUpdate(fiber.stateNode, text);
    }
    case HostComponent:
      return updateFiberProps(fiber.stateNode, fiber.memoizedProps);
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
  // eslint-disable-next-line unicorn/prefer-modern-dom-apis
  container.insertBefore(child, before);
}

function removeChild(child: Instance | TextInstance, container: Container) {
  // eslint-disable-next-line unicorn/prefer-dom-node-remove
  container.removeChild(child);
}

const scheduleMicroTask =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : typeof Promise === 'function'
    ? (callback: (...args: any[]) => void) =>
        Promise.resolve(null).then(callback)
    : setTimeout;

const appendChildToContainer = appendInitialChild;

export {
  removeChild,
  createInstance,
  appendInitialChild,
  createTextInstance,
  scheduleMicroTask,
  appendChildToContainer,
  insertChildToContainer,
};
export type { Container, Instance };
