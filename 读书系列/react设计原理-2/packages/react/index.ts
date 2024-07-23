import { Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import { jsx } from './src/jsx';

export const useState: Dispatcher['useState'] = (initialState: any) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

export default {
  version: '0.0.0',
  createElement: jsx,
};
