import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useTabsStore } from '@/store/tabs';

/** 动态菜单路径的内容由 TabPanes 渲染；未知路径兜底跳 404（对应 Vue 版 path:'*' -> 404） */
export default function UnknownPath() {
  const location = useLocation();
  const path = location.pathname;
  const { moduleRoutes, iframeRoutes } = useAuthStore();
  const known =
    moduleRoutes.some((r) => r.path === path) ||
    iframeRoutes.some((r) => r.path === path) ||
    useTabsStore.getState().tabs.some((t) => t.key === path);
  if (known) return null;
  return <Navigate to="/404" replace />;
}
