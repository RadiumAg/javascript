import { FiberNode } from '../../react-reconciler/src/fiber';
import { HostText } from '../../react-reconciler/src/workTags';
import { DOMElement, updateFiberProps } from './SyntheticEvent';

export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

export const createInstance = (type: string, props: any): Instance => {
  const element = document.createElement(type);
  updateFiberProps(element as DOMElement, props);
  return element;
};

export const appendInitialChild = (
  parent: Instance | Container,
  child: Instance
) => {
  parent.append(child);
};

export const createTextInstance = (content: string) => {
  return document.createTextNode(content);
};

export const appendChildToContainer = appendInitialChild;

export function commitUpdate(fiber: FiberNode) {
  switch (fiber.tag) {
    case HostText: {
      const text = fiber.memoizedProps.content;
      return commitTextUpdate(fiber.stateNode, text);
    }

    default:
      if (__DEV__) {
        console.warn('未实现的Update类型', fiber);
      }

      break;
  }
}

export function commitTextUpdate(textInstance: TextInstance, content: string) {
  textInstance.textContent = content;
}

export function removeChild(
  child: Instance | TextInstance,
  container: Container
) {
  // eslint-disable-next-line unicorn/prefer-dom-node-remove
  container.removeChild(child);
}

export function insertChildToContainer(
  child: Instance,
  cotnainer: Container,
  before: Instance
) {
  before.before(child);
}

export const scheduleMicorTask =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : typeof Promise === 'function'
    ? (callback: (...args: any) => void) => Promise.resolve().then(callback)
    : setTimeout;
