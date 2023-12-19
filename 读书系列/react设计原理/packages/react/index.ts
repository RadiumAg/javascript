import currentDispatcher, { resolveDispatcher } from './src/currentDispatcher';
import currentBatchConfig from './src/currentBatchConfig';
import { isValidElement as isValidElementFn, jsx, jsxDEV } from './src/jsx';
import type { Dispatcher } from './src/currentDispatcher';

const useState: Dispatcher['useState'] = initialState => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

const useEffect: Dispatcher['useEffect'] = (create, deps) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
};

const useTransition: Dispatcher['useTransition'] = () => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
};

// 内部数据共享层
const __SECRET_INTERNALAS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE = {
  currentDispatcher,
  currentBatchConfig,
};

const version = '0.0.0';
const createElement = jsx;

export {
  useState,
  useEffect,
  createElement,
  useTransition,
  isValidElementFn as isValidElement,
  version,
  __SECRET_INTERNALAS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE,
};
