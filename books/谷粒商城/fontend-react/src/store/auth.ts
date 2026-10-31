import { create } from 'zustand';
import { renrenApi } from '@/api';
import { removeToken } from '@/api/http';
import type { MenuNode } from '@/types';
import { flattenNavMenus, menuUrlToPath } from '@/utils';
import { isURL } from '@/utils';

export interface ModuleRoute {
  path: string;
  url: string;
  title: string;
  menuId: number;
}
export interface IframeRoute {
  path: string;
  title: string;
  src: string;
  menuId: number;
}

interface AuthState {
  user: { userId: number; username: string } | null;
  menuList: MenuNode[];
  permissions: string[];
  navLoaded: boolean;
  moduleRoutes: ModuleRoute[];
  iframeRoutes: IframeRoute[];
  loadUser: () => Promise<void>;
  loadNav: () => Promise<boolean>;
  isAuth: (code: string) => boolean;
  clearLogin: () => void;
  resetForNewSession: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  menuList: [],
  permissions: [],
  navLoaded: false,
  moduleRoutes: [],
  iframeRoutes: [],

  async loadUser() {
    if (get().user) return;
    const data = await renrenApi.current();
    if (data && data.code === 0 && data.user) {
      set({ user: { userId: data.user.userId, username: data.user.username } });
    }
  },

  // 对应 router.beforeEach 里的动态菜单加载：每个会话只做一次
  async loadNav() {
    if (get().navLoaded) return true;
    try {
      const data = await renrenApi.nav();
      if (data && data.code === 0) {
        const menuList = data.menuList ?? [];
        const permissions = data.permissions ?? [];
        sessionStorage.setItem('menuList', JSON.stringify(menuList));
        sessionStorage.setItem('permissions', JSON.stringify(permissions));
        const moduleRoutes: ModuleRoute[] = [];
        const iframeRoutes: IframeRoute[] = [];
        flattenNavMenus(menuList).forEach((menu) => {
          const url = (menu.url ?? '').replace(/^\//, '');
          if (isURL(menu.url)) {
            iframeRoutes.push({
              path: `/i-${menu.menuId}`,
              title: menu.name,
              src: menu.url as string,
              menuId: menu.menuId
            });
          } else if (url) {
            moduleRoutes.push({
              path: menuUrlToPath(url),
              url,
              title: menu.name,
              menuId: menu.menuId
            });
          }
        });
        set({ menuList, permissions, navLoaded: true, moduleRoutes, iframeRoutes });
        return true;
      }
      return false;
    } catch (e) {
      console.error('请求菜单列表和权限失败', e);
      return false;
    }
  },

  isAuth(code) {
    return get().permissions.indexOf(code) !== -1;
  },

  clearLogin() {
    removeToken();
    sessionStorage.removeItem('menuList');
    sessionStorage.removeItem('permissions');
    set({ user: null, menuList: [], permissions: [], navLoaded: false, moduleRoutes: [], iframeRoutes: [] });
  },

  /** 重新登录后重置 nav/权限缓存，但保留刚设置的 token cookie */
  resetForNewSession() {
    sessionStorage.removeItem('menuList');
    sessionStorage.removeItem('permissions');
    set({ user: null, menuList: [], permissions: [], navLoaded: false, moduleRoutes: [], iframeRoutes: [] });
  }
}));
