import ReactCurrentBatchConfig from './src/currentBatchConfig';
import currentDispatcher, {
  Dispatcher,
  resolveDispatcher,
} from './src/currentDispatcher';
import { jsx } from './src/jsx';

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

// 内部共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher,
  currentBatchConfig: ReactCurrentBatchConfig,
};

export default {
  version: '0.0.0',
  createElement: jsx,
};
