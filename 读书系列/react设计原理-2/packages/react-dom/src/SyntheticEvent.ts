import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';

export const elementPropsKey = '__props';

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

  container.addEventListener(eventType, e => {;[=]
    dispatchEvent(container, eventType, e);
  });
}

function dispatchEvent(container: Container, eventType: string, e: Event) {
  //1. 收集沿途的事件
  //2. 构建合成事件
  //3. 遍历captue
  //4. 遍历bubble
}
