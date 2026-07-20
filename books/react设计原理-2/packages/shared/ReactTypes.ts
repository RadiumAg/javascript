export type Type = any;
export type Key = any;
export type Ref = { current: any } | ((instance: any) => void);
export type Props = any;
export type ElementType = any;

export interface ReactElement {
  $$typeof: symbol | number;
  key: Key;
  type: ElementType;
  props: Props;
  ref: Ref;
  __mark: string;
}

export type Action<State> = State | ((prevState: State) => State);

export interface ReactProviderType<T> {
  $$typeof: symbol | number;
  _context: ReactContext<T> | null;
}

export interface ReactContext<T> {
  $$typeof: symbol | number;
  Provider: ReactProviderType<T> | null;
  _currentValue: T;
}

// Suspense 使用的 thenable（带状态追踪的 Promise）
export interface Thenable<T> {
  then(onFulfill: (value: T) => any, onReject: (error: any) => any): void | any;
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: any;
}

// use 支持的参数：thenable 或 context
export type Usable<T> = Thenable<T> | ReactContext<T>;
