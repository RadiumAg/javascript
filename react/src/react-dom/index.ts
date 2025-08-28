// ReactDOM TypeScript 实现

import { ReactElement, ReactNode } from '../types/ReactElement.js';
import { Fiber } from '../types/Fiber.js';
import { FiberRoot, createFiberRoot, scheduleUpdateOnFiber } from '../reconciler/index.js';
import { createUpdate, createUpdateQueue, enqueueUpdate } from '../types/UpdateQueue.js';
import { DefaultLane } from '../types/constants.js';

// ReactDOM Root 类型定义
export interface Root {
  render(children: ReactNode): void;
  unmount(): void;
  _internalRoot: FiberRoot;
}

interface RootContainer {
  appendChild(child: any): void;
  removeChild(child: any): void;
  insertBefore(newChild: any, beforeChild: any): void;
  [key: string]: any;
}

/**
 * 创建根节点
 */
export function createRoot(container: RootContainer): Root {
  const root = createFiberRoot(container, 1); // ConcurrentRoot
  
  return {
    render(children: ReactNode) {
      updateContainer(children, root);
    },
    
    unmount() {
      updateContainer(null, root);
    },
    
    _internalRoot: root,
  };
}

/**
 * 更新容器
 */
function updateContainer(element: ReactNode, root: FiberRoot): void {
  const current = root.current;
  const eventTime = performance.now();
  const lane = DefaultLane;

  // 创建更新
  const update = createUpdate(eventTime, lane);
  update.payload = { element };

  // 初始化更新队列（如果需要）
  if (current.updateQueue === null) {
    current.updateQueue = createUpdateQueue(null);
  }

  // 入队更新
  enqueueUpdate(current, update, lane);

  // 调度更新
  scheduleUpdateOnFiber(root, current, lane);
}

/**
 * 渲染到容器 (Legacy API)
 */
export function render(element: ReactElement, container: RootContainer): void {
  if (__DEV__) {
    console.warn(
      'ReactDOM.render is deprecated. Use ReactDOM.createRoot instead.'
    );
  }

  let root = getInternalRootFromContainer(container);
  if (!root) {
    root = createLegacyRoot(container);
    setInternalRootFromContainer(container, root);
  }

  updateContainer(element, root);
}

/**
 * 卸载组件树 (Legacy API)
 */
export function unmountComponentAtNode(container: RootContainer): boolean {
  const root = getInternalRootFromContainer(container);
  if (root) {
    updateContainer(null, root);
    setInternalRootFromContainer(container, null);
    return true;
  }
  return false;
}

/**
 * 创建 Legacy Root
 */
function createLegacyRoot(container: RootContainer): FiberRoot {
  return createFiberRoot(container, 0); // LegacyRoot
}

/**
 * Portals 支持
 */
export function createPortal(
  children: ReactNode,
  container: RootContainer,
  key?: string | null
): ReactElement {
  return {
    $$typeof: Symbol.for('react.portal'),
    type: null,
    key: key || null,
    ref: null,
    props: {
      children,
      containerInfo: container,
    },
    _owner: null,
    _store: {},
  } as ReactElement;
}

/**
 * 查找 DOM 节点
 */
export function findDOMNode(componentOrElement: any): Element | Text | null {
  if (componentOrElement == null) {
    return null;
  }
  
  if (componentOrElement.nodeType === 1) {
    return componentOrElement as Element;
  }
  
  // 简化实现，在实际应用中需要从Fiber中查找
  return null;
}

/**
 * 服务器端渲染支持
 */
export function renderToString(element: ReactElement): string {
  // 简化的 SSR 实现
  if (__DEV__) {
    console.warn('renderToString is a simplified implementation.');
  }
  
  return renderElementToString(element);
}

export function renderToStaticMarkup(element: ReactElement): string {
  // 简化的静态标记渲染
  return renderElementToString(element);
}

/**
 * 将元素渲染为字符串
 */
function renderElementToString(element: ReactElement): string {
  if (typeof element === 'string' || typeof element === 'number') {
    return String(element);
  }
  
  if (element == null || typeof element === 'boolean') {
    return '';
  }
  
  if (Array.isArray(element)) {
    return element.map(renderElementToString).join('');
  }
  
  if (typeof element === 'object' && element.$$typeof === Symbol.for('react.element')) {
    const { type, props } = element;
    
    if (typeof type === 'string') {
      // DOM 元素
      let html = `<${type}`;
      
      // 添加属性
      for (const prop in props) {
        if (prop !== 'children' && props.hasOwnProperty(prop)) {
          if (prop === 'className') {
            html += ` class="${props[prop]}"`;
          } else if (prop === 'style' && typeof props[prop] === 'object') {
            const styleStr = Object.keys(props[prop])
              .map(key => `${key}: ${props[prop][key]}`)
              .join('; ');
            html += ` style="${styleStr}"`;
          } else {
            html += ` ${prop}="${props[prop]}"`;
          }
        }
      }
      
      html += '>';
      
      // 添加子元素
      if (props.children) {
        html += renderElementToString(props.children);
      }
      
      html += `</${type}>`;
      return html;
    } else if (typeof type === 'function') {
      // 组件
      const result = type(props);
      return renderElementToString(result);
    }
  }
  
  return '';
}

/**
 * 批处理更新
 */
export function flushSync<T>(fn: () => T): T {
  // 简化实现，同步执行
  return fn();
}

/**
 * 不稳定的批处理 API
 */
export function unstable_batchedUpdates<T>(fn: () => T): T {
  return fn(); // 简化实现
}

// 内部辅助函数
const rootContainerMap = new WeakMap<RootContainer, FiberRoot | null>();

function getInternalRootFromContainer(container: RootContainer): FiberRoot | null {
  return rootContainerMap.get(container) || null;
}

function setInternalRootFromContainer(container: RootContainer, root: FiberRoot | null): void {
  if (root === null) {
    rootContainerMap.delete(container);
  } else {
    rootContainerMap.set(container, root);
  }
}

/**
 * 事件系统相关
 */
export const unstable_UserBlockingPriority = 2;
export const unstable_NormalPriority = 3;
export const unstable_LowPriority = 4;
export const unstable_IdlePriority = 5;

/**
 * 版本信息
 */
export const version = '18.0.0-simple-ts';

const __DEV__ = process.env.NODE_ENV !== 'production';