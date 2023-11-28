import { updateFiberProps } from './systemEvent';
import type { DOMElement } from './systemEvent';
import type { Props } from 'shared/reactTypes';

type Container = Element;
type Instance = Element;

const createInstance = (type: string, props: Props) => {
  // TODO 处理props
  const element = document.createElement(type) as unknown;
  updateFiberProps(element as DOMElement, props);
  return element as DOMElement;
};

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

const appendChildToContainer = appendInitialChild;

export {
  createInstance,
  appendInitialChild,
  createTextInstance,
  appendChildToContainer,
};
export type { Container, Instance };
