import currentDispatcher, {
  Dispatcher,
  resolveDispatcher,
} from './src/currentDispatcher';
import { jsxDEV } from './src/jsx';

const useState: Dispatcher['userState'] = initialState => {
  const dispatcher = resolveDispatcher();
  return dispatcher.userState(initialState);
};

// 内部数据共享层
const __SECRET_INTERNALAS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE = {
  currentDispatcher,
};

export { useState, __SECRET_INTERNALAS_DO_NOT_USE_OR_YOU_WILL_BE_FIRE };

export default {
  version: '0.0.0',
  createElement: jsxDEV,
};
