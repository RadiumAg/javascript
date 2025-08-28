import {
  NoFlags,
  NoLanes,
  NoMode,
  FunctionComponent,
  ClassComponent,
  HostComponent,
  HostText,
  HostRoot,
  Fragment,
  ContextProvider,
  ContextConsumer,
  ForwardRef,
  MemoComponent,
  LazyComponent,
  WorkTag,
  Flags,
  Lanes,
  Lane,
  TypeOfMode,
} from './constants.js';
import { ReactElement, ComponentType, RefType, ReactNode } from './ReactElement.js';

// Update Queue 相关类型
export interface Update<State = any> {
  eventTime: number;
  lane: Lane;
  tag: 0 | 1 | 2 | 3;
  payload: any;
  callback: (() => any) | null;
  next: Update<State> | null;
}

export interface UpdateQueue<State = any> {
  baseState: State;
  firstBaseUpdate: Update<State> | null;
  lastBaseUpdate: Update<State> | null;
  shared: {
    pending: Update<State> | null;
    interleaved: Update<State> | null;
    lanes: Lanes;
  };
  effects: Update<State>[] | null;
}

// Hook 相关类型
export interface Hook {
  memoizedState: any;
  baseState: any;
  baseQueue: Update<any> | null;
  queue: any;
  next: Hook | null;
}

// Dependencies 相关类型  
export interface Dependencies {
  lanes: Lanes;
  firstContext: ContextDependency | null;
}

export interface ContextDependency<T = any> {
  context: ReactContext<T>;
  next: ContextDependency | null;
  memoizedValue: T;
}

export interface ReactContext<T> {
  $$typeof: symbol;
  Consumer: ReactContext<T>;
  Provider: ReactProviderType<T>;
  _currentValue: T;
  _currentValue2: T;
  _threadCount: number;
  _defaultValue: T;
  _globalName: string | null;
  displayName?: string;
}

export interface ReactProviderType<T> {
  $$typeof: symbol;
  _context: ReactContext<T>;
}

/**
 * Fiber节点接口
 */
export interface Fiber {
  // Instance
  tag: WorkTag;
  key: string | null;
  elementType: any;
  type: any;
  stateNode: any;

  // Fiber
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  index: number;

  ref: RefType<any> | null;

  pendingProps: any;
  memoizedProps: any;
  updateQueue: UpdateQueue<any> | null;
  memoizedState: any;
  dependencies: Dependencies | null;

  mode: TypeOfMode;

  // Effects
  flags: Flags;
  subtreeFlags: Flags;
  deletions: Fiber[] | null;

  lanes: Lanes;
  childLanes: Lanes;

  alternate: Fiber | null;

  // 开发时调试信息
  _debugSource?: any;
  _debugOwner?: Fiber | null;
  _debugNeedsRemount?: boolean;
  _debugHookTypes?: any;
}

/**
 * 创建Fiber节点
 */
export function createFiber(tag: WorkTag, pendingProps: any, key: string | null, mode: TypeOfMode): Fiber {
  return new FiberNode(tag, pendingProps, key, mode);
}

/**
 * Fiber节点构造函数
 */
class FiberNode implements Fiber {
  tag: WorkTag;
  key: string | null;
  elementType: any;
  type: any;
  stateNode: any;

  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  index: number;

  ref: RefType<any> | null;

  pendingProps: any;
  memoizedProps: any;
  updateQueue: UpdateQueue<any> | null;
  memoizedState: any;
  dependencies: Dependencies | null;

  mode: TypeOfMode;

  flags: Flags;
  subtreeFlags: Flags;
  deletions: Fiber[] | null;

  lanes: Lanes;
  childLanes: Lanes;

  alternate: Fiber | null;

  _debugSource?: any;
  _debugOwner?: Fiber | null;
  _debugNeedsRemount?: boolean;
  _debugHookTypes?: any;

  constructor(tag: WorkTag, pendingProps: any, key: string | null, mode: TypeOfMode) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;

    // Fiber
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;

    this.ref = null;

    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.dependencies = null;

    this.mode = mode;

    // Effects
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.deletions = null;

    this.lanes = NoLanes;
    this.childLanes = NoLanes;

    this.alternate = null;

    // 开发时调试信息
    if (__DEV__) {
      this._debugSource = null;
      this._debugOwner = null;
      this._debugNeedsRemount = false;
      this._debugHookTypes = null;
    }
  }
}

/**
 * 从ReactElement创建Fiber
 */
export function createFiberFromElement(element: ReactElement, mode: TypeOfMode, lanes: Lanes): Fiber {
  let owner: Fiber | null = null;
  if (__DEV__) {
    owner = element._owner;
  }

  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes);
  
  if (__DEV__) {
    fiber._debugSource = (element as any)._source;
    fiber._debugOwner = element._owner;
  }

  return fiber;
}

/**
 * 从类型和props创建Fiber
 */
export function createFiberFromTypeAndProps(
  type: any,
  key: string | null,
  pendingProps: any,
  owner: Fiber | null,
  mode: TypeOfMode,
  lanes: Lanes
): Fiber {
  let fiberTag: WorkTag = FunctionComponent;
  let resolvedType = type;

  if (typeof type === 'function') {
    if (shouldConstruct(type)) {
      fiberTag = ClassComponent;
    }
  } else if (typeof type === 'string') {
    fiberTag = HostComponent;
  } else {
    getTag: switch (type) {
      case REACT_FRAGMENT_TYPE:
        return createFiberFromFragment(pendingProps.children, mode, lanes, key);
      default: {
        if (typeof type === 'object' && type !== null) {
          switch (type.$$typeof) {
            case REACT_PROVIDER_TYPE:
              fiberTag = ContextProvider;
              break getTag;
            case REACT_CONTEXT_TYPE:
              fiberTag = ContextConsumer;
              break getTag;
            case REACT_FORWARD_REF_TYPE:
              fiberTag = ForwardRef;
              break getTag;
            case REACT_MEMO_TYPE:
              fiberTag = MemoComponent;
              break getTag;
            case REACT_LAZY_TYPE:
              fiberTag = LazyComponent;
              resolvedType = null;
              break getTag;
          }
        }
        
        let info = '';
        if (__DEV__) {
          if (
            type === undefined ||
            (typeof type === 'object' &&
              type !== null &&
              Object.keys(type).length === 0)
          ) {
            info +=
              ' You likely forgot to export your component from the file ' +
              "it's defined in, or you might have mixed up default and named imports.";
          }
        }

        throw new Error(
          'Element type is invalid: expected a string (for built-in ' +
            'components) or a class/function (for composite components) ' +
            `but got: ${type == null ? type : typeof type}.${info}`
        );
      }
    }
  }

  const fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = resolvedType;
  fiber.lanes = lanes;

  if (__DEV__) {
    fiber._debugOwner = owner;
  }

  return fiber;
}

/**
 * 创建文本Fiber
 */
export function createFiberFromText(content: string, mode: TypeOfMode, lanes: Lanes): Fiber {
  const fiber = createFiber(HostText, content, null, mode);
  fiber.lanes = lanes;
  return fiber;
}

/**
 * 创建Fragment Fiber
 */
export function createFiberFromFragment(elements: ReactNode, mode: TypeOfMode, lanes: Lanes, key: string | null): Fiber {
  const fiber = createFiber(Fragment, elements, key, mode);
  fiber.lanes = lanes;
  return fiber;
}

/**
 * 创建工作进展Fiber (双缓存)
 */
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  let workInProgress = current.alternate;
  
  if (workInProgress === null) {
    // 创建新的Fiber
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    if (__DEV__) {
      if (current._debugOwner !== undefined) {
        workInProgress._debugOwner = current._debugOwner;
      }
      if (current._debugHookTypes !== undefined) {
        workInProgress._debugHookTypes = current._debugHookTypes;
      }
    }

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // 复用现有Fiber
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;

    // 清除副作用
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;

    if (__DEV__) {
      if (current._debugNeedsRemount !== undefined) {
        workInProgress._debugNeedsRemount = current._debugNeedsRemount;
      }
    }
  }

  // 复制字段
  workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.dependencies = current.dependencies;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  return workInProgress;
}

/**
 * 检查是否应该构造为类组件
 */
function shouldConstruct(Component: any): boolean {
  const prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

// 导入符号类型
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
const REACT_PROVIDER_TYPE = Symbol.for('react.provider');
const REACT_CONTEXT_TYPE = Symbol.for('react.context');
const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
const REACT_MEMO_TYPE = Symbol.for('react.memo');
const REACT_LAZY_TYPE = Symbol.for('react.lazy');

// 开发环境标志
const __DEV__ = process.env.NODE_ENV !== 'production';