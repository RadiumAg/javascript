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
    case HostText:
      const text = fiber.memoizedProps?.content;
      return commitTextUpdate(fiber.stateNode, text);
    case HostComponent:
      return updateFiberProps(fiber.stateNode, fiber.memoizedProps);
    default:
      if (__DEV__) {
        console.warn('未实现的Update类型', fiber);
      }
      break;
  }
}

const appendChildToContainer = appendInitialChild;

export {
  createInstance,
  appendInitialChild,
  createTextInstance,
  appendChildToContainer,
};
export type { Container, Instance };
