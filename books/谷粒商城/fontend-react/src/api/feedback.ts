import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import { FC } from 'react';

/**
 * antd v6 起静态 message / Modal.confirm 不再渲染（拿不到 context 的静态入口被废弃），
 * 只能用 <App> 提供的实例。这里把实例接到模块级出口，让非组件代码（axios 拦截器）也能调用，
 * 页面里继续写 `message.success(...)` / `confirm({...})`，不必每处都 App.useApp()。
 */
type ModalApi = Omit<ModalStaticFunctions, 'warn'>;

let messageApi: MessageInstance | undefined;
let modalApi: ModalApi | undefined;

const call = <A extends unknown[], R>(pick: (api: MessageInstance) => (...a: A) => R) =>
  (...args: A): R | undefined => (messageApi ? pick(messageApi)(...args) : undefined);

export const message = {
  open: call((a) => a.open),
  success: call((a) => a.success),
  error: call((a) => a.error),
  info: call((a) => a.info),
  warning: call((a) => a.warning),
  loading: call((a) => a.loading),
  destroy: () => messageApi?.destroy()
} as unknown as MessageInstance;

export const confirm: ModalApi['confirm'] = (config) => modalApi?.confirm(config) as ReturnType<ModalApi['confirm']>;

/** 放在 <App> 内部，把上下文实例接到上面两个出口 */
export const FeedbackBridge: FC = () => {
  const app = App.useApp();
  messageApi = app.message;
  modalApi = app.modal;
  return null;
};
