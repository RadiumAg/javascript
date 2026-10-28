import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * 菜单 url -> 页面组件（对应 Vue 版 `_import('modules/' + url)` 的约定）
 * 新增业务菜单时在这里登记即可。
 */
const registry: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  'sys/user': lazy(() => import('@/pages/sys/UserPage')),
  'sys/role': lazy(() => import('@/pages/sys/RolePage')),
  'sys/menu': lazy(() => import('@/pages/sys/MenuPage')),
  'sys/config': lazy(() => import('@/pages/sys/ConfigPage')),
  'sys/log': lazy(() => import('@/pages/sys/LogPage')),
  'job/schedule': lazy(() => import('@/pages/job/SchedulePage')),
  'oss/oss': lazy(() => import('@/pages/oss/OssPage'))
};

export function resolveModule(url: string): LazyExoticComponent<ComponentType<any>> | undefined {
  const key = url.replace(/^\//, '');
  return registry[key] ?? registry[key.replace('-', '/')];
}
