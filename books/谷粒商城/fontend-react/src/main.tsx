// antd v5 在 React 19 下需要这个兼容补丁（message/notification/Modal 等静态方法走已移除的 render API）
// 必须是第一条 import，早于任何 antd 组件加载
import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from '@/App';
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
