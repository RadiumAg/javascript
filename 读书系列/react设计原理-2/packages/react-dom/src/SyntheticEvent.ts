import path from 'path';
import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';

export const elementPropsKey = '__props';

type EventCallback = (e: Event) => void;

interface SyntheticEvent extends Event {
  __stopPropagation: boolean;
}

interface Paths {
  bubble: EventCallback[];
  capture: EventCallback[];
}

export interface DOMElement extends HTMLElement {
  [elementPropsKey]: Props;
}

export function updateFiberProps(node: DOMElement, props: Props) {
  node[elementPropsKey] = props;
}

const validEventTypeList = ['click'];

export function initEvent(container: Container, eventType: string) {
  if (!validEventTypeList.includes(eventType)) {
    console.log('当前不支持', eventType, '事件');
    return;
  }

  if (__DEV__) {
    console.log('初始化事件：', eventType);
  }

  container.addEventListener(eventType, e => {
    dispatchEvent(container, eventType, e);
  });
}

function dispatchEvent(container: Container, eventType: string, e: Event) {
  const targetElement = e.target;

  if (targetElement === null) {
    console.warn('事件不能存target', e);
    return;
  }
  //1. 收集沿途的事件
  const { bubble, capture } = collectPaths(
    targetElement as DOMElement,
    container,
    eventType,
  );
  //2. 构建合成事件
  const se = createSyntheticEvent(e);
  //3. 遍历captue
  triggerEventFlow(capture, se);

  if (!se.__stopPropagation) {
    //4. 遍历bubble
    triggerEventFlow(bubble, se);
  }
}

function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
  for (const callback of paths) {
    callback.call(null, se);

    if (se.__stopPropagation) {
      break;
    }
  }
}

function createSyntheticEvent(e: Event) {
  const syntheticEvent = e as SyntheticEvent;
  syntheticEvent.__stopPropagation = false;
  const orginStopPropagation = e.stopPropagation;

  syntheticEvent.stopPropagation = () => {
    syntheticEvent.__stopPropagation = true;
    if (orginStopPropagation) {
      orginStopPropagation();
    }
  };

  return syntheticEvent;
}

function getEventCallbackNameFromEventType(
  eventType: string,
): string[] | undefined {
  return {
    click: ['onClickCapture', 'onClick'],
  }[eventType];
}

function collectPaths(
  targetElement: DOMElement,
  container: Container,
  eventType: string,
) {
  const paths: Paths = {
    capture: [],
    bubble: [],
  };

  while (targetElement && targetElement !== container) {
    // 收集
    const elememtProps = targetElement[elementPropsKey];

    if (elememtProps) {
      // click -> onClick -> onClickCapture
      const callbackNameList = getEventCallbackNameFromEventType(eventType);

      if (callbackNameList) {
        callbackNameList.forEach((callbackName, i) => {
          const eventCallback = elememtProps[callbackName];
          if (eventCallback) {
            if (i === 0) {
              paths.capture.unshift(eventCallback);
            } else {
              paths.bubble.push(eventCallback);
            }
          }
        });
      }
      targetElement = targetElement.parentNode as DOMElement;
    }

    return paths;
  }
}
