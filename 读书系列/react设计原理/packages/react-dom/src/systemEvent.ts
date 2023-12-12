import { Container } from 'hostConfig';
import {
  unstable_ImmediatePriority,
  unstable_NormalPriority,
  unstable_UserBlockingPriority,
  unstable_runWithPriority,
} from 'scheduler';
import type { Props } from 'shared/reactTypes';

const elementPropsKey = '__props';
const validEventTypeList = ['click'];

interface DOMElement extends Element {
  [elementPropsKey]: Props;
}

type EventCallback = (e: Event) => void;

interface SyntheticEvent extends Event {
  __stopPropagation: boolean;
}

interface Patchs {
  capture: EventCallback[];
  bubble: EventCallback[];
}

function updateFiberProps(node: DOMElement, props: Props) {
  node[elementPropsKey] = props;
}

function initEvent(container: Container, eventType: string) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn('当前不支持', eventType, '事件');
    return;
  }

  if (__DEV__) {
    console.log('初始化事件', eventType);
  }

  container.addEventListener(eventType, e => {
    dispatchEvent(container, eventType, e);
  });
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

function dispatchEvent(container: Container, eventType: string, e: Event) {
  const targetElement = e.target;

  if (targetElement === null) {
    console.warn('事件不存在target', e);
    return;
  }
  // 1. 搜集沿途的事件
  const { bubble, capture } = collectPatchs(
    targetElement as DOMElement,
    container,
    eventType,
  );
  // 2. 构建合成事件
  const se = createSyntheticEvent(e);
  // 3. 遍历captue
  triggerEventFlow(capture, se);

  if (!se.__stopPropagation) {
    // 4. 遍历bubble
    triggerEventFlow(bubble, se);
  }
}

function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
  for (const callback of paths) {
    unstable_runWithPriority(eventTypeToSchdulerPriority(se.type), () => {
      callback.call(null, se);
    });

    if (se.__stopPropagation) {
      break;
    }
  }
}

function getEventCallbackNameFromEventType(
  eventType: string,
): string[] | undefined {
  return {
    click: ['onClickCapture', 'onClick'],
  }[eventType];
}

function collectPatchs(
  targetElement: DOMElement,
  container: Container,
  eventType: string,
) {
  const paths: Patchs = {
    capture: [],
    bubble: [],
  };

  while (targetElement && targetElement !== container) {
    // 收集
    const elementProps = targetElement[elementPropsKey];
    if (elementProps) {
      const callbackNameList = getEventCallbackNameFromEventType(eventType);
      if (callbackNameList) {
        callbackNameList.forEach((callbackName, index) => {
          const eventCallback = elementProps[callbackName];
          if (eventCallback) {
            if (index === 0) {
              paths.capture.unshift(eventCallback);
            } else {
              paths.bubble.push(eventCallback);
            }
          }
        });
      }
    }
    targetElement = targetElement.parentNode as DOMElement;
  }

  return paths;
}

function eventTypeToSchdulerPriority(eventType: string) {
  switch (eventType) {
    case 'click':
    case 'keydown':
    case 'keyup':
      return unstable_ImmediatePriority;
    case 'scroll':
      return unstable_UserBlockingPriority;
    default:
      return unstable_NormalPriority;
  }
}

export type { DOMElement };
export { initEvent, updateFiberProps };
