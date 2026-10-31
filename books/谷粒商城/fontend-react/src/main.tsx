import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from '@/App';
import { FeedbackBridge } from '@/api/feedback';
import { useAuthStore } from '@/store/auth';
import { setUnauthorizedHandler } from '@/api/http';
import 'dayjs/locale/zh-cn';
import '@/index.css';

// token 失效：清理登录态并回到登录页（对应 Vue 版 axios 响应拦截器）
setUnauthorizedHandler(() => {
  useAuthStore.getState().clearLogin();
  window.location.hash = '#/login';
  window.location.reload(); // hash 模式无此项，browser 模式无害保留
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{ token: { colorPrimary: '#1d8bd2' } }}
    >
      {/* antd v6：message/notification/Modal.confirm 必须由 App 提供实例 */}
      <AntdApp>
        <FeedbackBridge />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>,
);
