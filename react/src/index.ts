// React 核心导出
export { 
  createElement, 
  cloneElement, 
  createFragment,
  isValidElement
} from './types/ReactElement.ts';

// 类型导出
export type {
  ReactElement,
  ReactNode,
  ComponentType,
  RefType,
  Key
} from './types/ReactElement.ts';

export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useContext
} from './hooks/index.ts';

export {
  startTransition,
  useTransition,
  useDeferredValue
} from './hooks/index.ts';

// React组件相关
export interface ComponentProps {
  children?: ReactNode;
  [key: string]: any;
}

export interface ComponentState {
  [key: string]: any;
}

export abstract class Component<P extends ComponentProps = {}, S extends ComponentState = {}> {
  props: P;
  context: any;
  refs: { [key: string]: any };
  updater: ReactNoopUpdateQueue;

  constructor(props: P, context?: any, updater?: ReactNoopUpdateQueue) {
    this.props = props;
    this.context = context || {};
    this.refs = {};
    this.updater = updater || ReactNoopUpdateQueue;
  }

  setState(
    partialState: Partial<S> | ((prevState: S, props: P) => Partial<S>),
    callback?: (() => void) | null
  ): void {
    if (typeof partialState !== 'object' && 
        typeof partialState !== 'function' && 
        partialState != null) {
      throw new Error('setState(...): takes an object of state variables to update or a function which returns an object of state variables.');
    }

    this.updater.enqueueSetState(this, partialState, callback || null, 'setState');
  }

  forceUpdate(callback?: (() => void) | null): void {
    this.updater.enqueueForceUpdate(this, callback || null, 'forceUpdate');
  }

  static isReactComponent = {};
}



// Fragment
export const Fragment = Symbol.for('react.fragment');

// StrictMode
interface StrictModeProps {
  children?: ReactNode;
}

export const StrictMode = function StrictModeComponent({ children }: StrictModeProps): ReactNode {
  return children;
};

// Suspense
interface SuspenseProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

export const Suspense = function SuspenseComponent({ children, fallback }: SuspenseProps): ReactNode {
  return children;
};

// memo
export function memo<P extends ComponentProps>(
  Component: (props: P) => ReactElement | null, 
  compare?: (prevProps: P, nextProps: P) => boolean
): (props: P) => ReactElement | null {
  const elementType = {
    $$typeof: Symbol.for('react.memo'),
    type: Component,
    compare: compare === undefined ? null : compare,
  };
  
  if (__DEV__) {
    (elementType as any).displayName = (Component as any).displayName || (Component as any).name || 'Unknown';
  }
  
  return elementType as any;
}

// forwardRef
export function forwardRef<T, P extends ComponentProps = {}>(
  render: (props: P, ref: RefType<T>) => ReactElement | null
): (props: P) => ReactElement | null {
  if (__DEV__) {
    if ((render as any) != null && (render as any).$$typeof === Symbol.for('react.memo')) {
      console.error('forwardRef requires a render function but received a memo component.');
    } else if (typeof render !== 'function') {
      console.error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    }
  }

  const elementType = {
    $$typeof: Symbol.for('react.forward_ref'),
    render,
  };
  
  if (__DEV__) {
    (elementType as any).displayName = (render as any).displayName || (render as any).name || 'ForwardRef';
  }
  
  return elementType as any;
}

// lazy
interface LazyComponent<T> {
  $$typeof: symbol;
  _payload: LazyPayload<T>;
  _init: (payload: LazyPayload<T>) => T;
}

interface LazyPayload<T> {
  _status: number;
  _result: any;
}

export function lazy<T extends (props: any) => ReactElement | null>(
  ctor: () => Promise<{ default: T }>
): LazyComponent<T> {
  const payload: LazyPayload<T> = {
    _status: -1, // Uninitialized
    _result: ctor,
  };

  const lazyType: LazyComponent<T> = {
    $$typeof: Symbol.for('react.lazy'),
    _payload: payload,
    _init: lazyInitializer,
  };

  if (__DEV__) {
    (lazyType as any).displayName = 'Lazy';
  }

  return lazyType;
}

function lazyInitializer<T>(payload: LazyPayload<T>): T {
  if (payload._status === -1) {
    const ctor = payload._result;
    const thenable = ctor();
    
    const pending = payload;
    pending._status = 0; // Pending
    pending._result = thenable;
    
    thenable.then(
      (moduleObject: { default: T }) => {
        if (payload._status === 0) {
          const defaultExport = moduleObject.default;
          if (__DEV__) {
            if (defaultExport === undefined) {
              console.error('lazy: Expected the result of a dynamic import() call.');
            }
          }
          const resolved = payload;
          resolved._status = 1; // Resolved
          resolved._result = defaultExport;
        }
      },
      (error: any) => {
        if (payload._status === 0) {
          const rejected = payload;
          rejected._status = 2; // Rejected
          rejected._result = error;
        }
      }
    );
  }

  if (payload._status === 1) {
    return payload._result;
  } else {
    throw payload._result;
  }
}

// Context
export interface ReactContext<T> {
  $$typeof: symbol;
  _currentValue: T;
  _currentValue2: T;
  _threadCount: number;
  Provider: ReactProviderType<T>;
  Consumer: ReactContext<T>;
  _defaultValue: T;
  _globalName: string | null;
  displayName?: string;
}

export interface ReactProviderType<T> {
  $$typeof: symbol;
  _context: ReactContext<T>;
}

export function createContext<T>(defaultValue: T): ReactContext<T> {
  const context: ReactContext<T> = {
    $$typeof: Symbol.for('react.context'),
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: null as any,
    Consumer: null as any,
    _defaultValue: defaultValue,
    _globalName: null,
  };

  context.Provider = {
    $$typeof: Symbol.for('react.provider'),
    _context: context,
  };

  context.Consumer = context;

  if (__DEV__) {
    context.displayName = 'Context';
  }

  return context;
}



export function useImperativeHandle<T>(
  ref: RefType<T>,
  create: () => T,
  deps?: any[]
): void {
  // 简化实现，使用useEffect模拟
  useEffect(() => {
    if (typeof ref === 'function') {
      ref(create());
    } else if (ref != null) {
      ref.current = create();
    }
  }, deps);
}

export function useDebugValue(value: any, formatterFn?: (value: any) => any): void {
  // 只在开发环境有效
  if (__DEV__) {
    console.log('Debug value:', formatterFn ? formatterFn(value) : value);
  }
}

// React版本
export const version = '18.0.0-simple-ts';

// 内部使用
interface ReactNoopUpdateQueue {
  isMounted(publicInstance: any): boolean;
  enqueueForceUpdate(publicInstance: any, callback: (() => void) | null, callerName: string): void;
  enqueueReplaceState(publicInstance: any, completeState: any, callback: (() => void) | null, callerName: string): void;
  enqueueSetState(publicInstance: any, partialState: any, callback: (() => void) | null, callerName: string): void;
}

const ReactNoopUpdateQueue: ReactNoopUpdateQueue = {
  isMounted: function(publicInstance: any): boolean {
    return false;
  },
  enqueueForceUpdate: function(publicInstance: any, callback: (() => void) | null, callerName: string): void {
    // noop
  },
  enqueueReplaceState: function(publicInstance: any, completeState: any, callback: (() => void) | null, callerName: string): void {
    // noop
  },
  enqueueSetState: function(publicInstance: any, partialState: any, callback: (() => void) | null, callerName: string): void {
    // noop
  },
};

// 重新导入类型
import { ReactElement, ReactNode } from './types/ReactElement.ts';
import { RefType } from './types/ReactElement.ts';
import { useEffect } from './hooks/index.ts';

const __DEV__ = process.env.NODE_ENV !== 'production';