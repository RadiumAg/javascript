// ReactElement 符号标识
const REACT_ELEMENT_TYPE = Symbol.for('react.element');
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');

// 类型定义
export interface ReactElement<P = any, T extends string | ComponentType<any> = any> {
  $$typeof: symbol;
  type: T;
  key: string | null;
  ref: RefType<any> | null;
  props: P;
  _owner: any;
  _store: {
    validated?: boolean;
  };
  _source?: any;
}

export interface ReactFragment {
  $$typeof: symbol;
  type: symbol;
  key: Key;
  ref: null;
  props: {
    children: ReactNode;
  };
  _owner: null;
  _store: {};
}

export type ReactNode = 
  | ReactElement
  | ReactFragment
  | string 
  | number 
  | boolean 
  | null 
  | undefined
  | ReactNode[];

export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

export interface ComponentClass<P = {}> {
  new (props: P): Component<P, any>;
  defaultProps?: Partial<P>;
}

export interface FunctionComponent<P = {}> {
  (props: P): ReactElement | null;
  defaultProps?: Partial<P>;
}

export interface Component<P, S> {
  props: P;
  state: S;
}

export type Key = string | number | null;
export type RefType<T = any> = 
  | ((instance: T | null) => void) 
  | RefObject<T> 
  | null;

export interface RefObject<T> {
  current: T | null;
}

export interface Props {
  children?: ReactNode;
  [key: string]: any;
}

/**
 * 创建 ReactElement
 */
export function createElement<P extends Props>(
  type: string | ComponentType<P>,
  config?: (P & { key?: Key; ref?: RefType }) | null,
  ...children: ReactNode[]
): ReactElement<P> {
  let propName: string;
  const props: any = {};
  let key: Key = null;
  let ref: RefType = null;

  if (config != null) {
    if (config.ref !== undefined) {
      ref = config.ref;
    }
    if (config.key !== undefined) {
      key = '' + config.key;
    }

    // 复制剩余属性到props
    for (propName in config) {
      if (
        config.hasOwnProperty(propName) &&
        propName !== 'key' &&
        propName !== 'ref'
      ) {
        props[propName] = (config as any)[propName];
      }
    }
  }

  // 处理children
  const childrenLength = children.length;
  if (childrenLength === 1) {
    props.children = children[0];
  } else if (childrenLength > 1) {
    props.children = children;
  }

  // 设置默认props
  if (type && typeof type === 'function' && (type as any).defaultProps) {
    const defaultProps = (type as any).defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    _owner: null, // 当前组件的owner
    _store: {}, // 用于验证的存储
  };
}

/**
 * 创建Fragment
 */
export function createFragment(children: ReactNode, key?: Key): ReactFragment {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: REACT_FRAGMENT_TYPE,
    key: key || null,
    ref: null,
    props: {
      children
    },
    _owner: null,
    _store: {},
  };
}

/**
 * 检查是否为有效的ReactElement
 */
export function isValidElement(object: any): object is ReactElement {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}

/**
 * 克隆元素
 */
export function cloneElement<P>(
  element: ReactElement<P>,
  config?: Partial<P & { key?: Key; ref?: RefType }> | null,
  ...children: ReactNode[]
): ReactElement<P> {
  if (element === null || element === undefined) {
    throw new Error('React.cloneElement(...): The argument must be a React element.');
  }

  let propName: string;
  const props: any = Object.assign({}, element.props);
  let key: Key = element.key;
  let ref: RefType = element.ref;
  let owner: any = element._owner;

  if (config != null) {
    if (config.ref !== undefined) {
      ref = config.ref;
      owner = null;
    }
    if (config.key !== undefined) {
      key = '' + config.key;
    }

    for (propName in config) {
      if (
        config.hasOwnProperty(propName) &&
        propName !== 'key' &&
        propName !== 'ref'
      ) {
        props[propName] = (config as any)[propName];
      }
    }
  }

  const childrenLength = children.length;
  if (childrenLength === 1) {
    props.children = children[0];
  } else if (childrenLength > 1) {
    props.children = children;
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: element.type,
    key,
    ref,
    props,
    _owner: owner,
    _store: {},
  };
}

export { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE };