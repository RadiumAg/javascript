export { createRoot, render, unmountComponentAtNode } from './ReactDOMRoot.js';

/**
 * 批处理更新
 */
export function flushSync(fn) {
  // 简化实现：直接执行函数
  if (fn) {
    return fn();
  }
}

/**
 * 查找DOM节点
 */
export function findDOMNode(componentOrElement) {
  if (componentOrElement == null) {
    return null;
  }
  
  if (componentOrElement.nodeType === 1) {
    return componentOrElement;
  }
  
  // 简化实现
  return null;
}

/**
 * 创建Portal
 */
export function createPortal(children, container, key = null) {
  if (!container || typeof container.appendChild !== 'function') {
    throw new Error('createPortal: Target container is not a DOM element.');
  }
  
  return {
    $$typeof: Symbol.for('react.portal'),
    key,
    children,
    containerInfo: container,
    implementation: null,
  };
}

/**
 * 预加载资源
 */
export function preload(href, options) {
  // 简化实现
  console.log('Preloading resource:', href, options);
}

export function preinit(href, options) {
  // 简化实现
  console.log('Preinitializing resource:', href, options);
}