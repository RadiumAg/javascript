import { FiberNode } from '../../react-reconciler/src/fiber';
import { HostText, HostComponent } from '../../react-reconciler/src/workTags';
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
    case HostComponent: {
      const updatePayload = fiber.updateQueue as any[] | null;
      if (updatePayload !== null) {
        applyUpdatePayload(fiber.stateNode as Instance, updatePayload);
        // 清空 updateQueue
        fiber.updateQueue = null;
      }
      return;
    }

    default:
      if (__DEV__) {
        console.warn('未实现的Update类型', fiber);
      }

      break;
  }
}

/**
 * 将 updatePayload 应用到 DOM 元素上
 * updatePayload 格式: [propKey1, propValue1, propKey2, propValue2, ...]
 */
function applyUpdatePayload(
  dom: Instance,
  updatePayload: any[],
) {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];

    if (propKey === 'style') {
      // style 特殊处理
      if (typeof propValue === 'string') {
        (dom as HTMLElement).style.cssText = propValue;
      } else if (propValue === null) {
        (dom as HTMLElement).style.cssText = '';
      } else if (typeof propValue === 'object') {
        for (const styleName in propValue) {
          if (Object.prototype.hasOwnProperty.call(propValue, styleName)) {
            (dom as HTMLElement).style[styleName as any] = propValue[styleName];
          }
        }
      }
    } else if (propValue === null || propValue === false) {
      dom.removeAttribute(propKey);
    } else if (propValue === true) {
      dom.setAttribute(propKey, '');
    } else {
      dom.setAttribute(propKey, String(propValue));
    }
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
