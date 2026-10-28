import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import UnknownPath from '@/layout/UnknownPath';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import ThemePage from '@/pages/ThemePage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="theme" element={<ThemePage />} />
        {/* 动态菜单路由由 MainLayout 的 TabPanes 渲染，这里只做 404 兜底 */}
        <Route path="*" element={<UnknownPath />} />
      </Route>
    </Routes>
  );
}
