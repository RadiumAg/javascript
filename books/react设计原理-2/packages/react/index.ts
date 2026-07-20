import ReactCurrentBatchConfig from './src/currentBatchConfig';
import currentDispatcher, {
  Dispatcher,
  resolveDispatcher,
} from './src/currentDispatcher';
import { jsx } from './src/jsx';
import {
  REACT_MEMO_TYPE,
  REACT_CONTEXT_TYPE,
  REACT_PROVIDER_TYPE,
} from '../shared/ReactSymbols';
import { ReactContext } from '../shared/ReactTypes';

export const useState: Dispatcher['useState'] = (initialState: any) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

export const useEffect: Dispatcher['useEffect'] = (create, deps) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
};

export const useTransition: Dispatcher['useTransition'] = () => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
};

export const userRef: Dispatcher['useRef'] = (initialValue) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
};

export const useCallback: Dispatcher['useCallback'] = (callback, deps) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
};

export const useMemo: Dispatcher['useMemo'] = (nextCreate, deps) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useMemo(nextCreate, deps);
};

export const useContext: Dispatcher['useContext'] = (context) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useContext(context);
};

/**
 * createContext：创建一个 context 对象，并挂载其 Provider
 * @param defaultValue 没有匹配的 Provider 时使用的默认值
 */
export function createContext<T>(defaultValue: T): ReactContext<T> {
  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    Provider: null,
    _currentValue: defaultValue,
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };
  return context;
}

/**
 * React.memo：包裹一个组件，返回一个特殊的 memo 对象作为 element.type
 * @param type    被包裹的组件
 * @param compare 可选的自定义 props 比较函数，不传则默认浅比较
 */
export function memo(
  type: any,
  compare?: (oldProps: any, newProps: any) => boolean,
) {
  return {
    $$typeof: REACT_MEMO_TYPE,
    type,
    compare: compare === undefined ? null : compare,
  };
}

// 内部共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher,
  currentBatchConfig: ReactCurrentBatchConfig,
};

export default {
  version: '0.0.0',
  createElement: jsx,
  memo,
  createContext,
};
