import currentDispatcher, { resolveDispatcher } from './src/currentDispatcher';
import { isValidElement as isValidElementFn, jsx, jsxDEV } from './src/jsx';
import type { Dispatcher } from './src/currentDispatcher';

const useState: Dispatcher['userState'] = initialState => {
  const dispatcher = resolveDispatcher();
  return dispatcher.userState(initialState);
};

// 内部数据共享层
const __SECRET_INTERNALAS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE = {
  currentDispatcher,
};

const version = '0.0.0';
const createElement = jsx;

export {
  useState,
  createElement,
  isValidElementFn as isValidElement,
  version,
  __SECRET_INTERNALAS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE,
};
