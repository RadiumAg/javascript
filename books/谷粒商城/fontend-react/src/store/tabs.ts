import { create } from 'zustand';

export interface Tab {
  /** 路由 path，作为 tab 唯一键 */
  key: string;
  title: string;
  closable: boolean;
}

interface TabsState {
  tabs: Tab[];
  activeKey: string;
  openTab: (tab: Tab) => void;
  closeTab: (key: string) => string | null; // 返回下一个应激活的 key
  setActive: (key: string) => void;
  closeOthers: (key: string) => void;
  closeAll: () => void;
}

const HOME: Tab = { key: '/home', title: '首页', closable: false };

export const useTabsStore = create<TabsState>((set, get) => ({
  tabs: [HOME],
  activeKey: '/home',

  openTab(tab) {
    const { tabs } = get();
    if (!tabs.some((t) => t.key === tab.key)) {
      set({ tabs: [...tabs, tab] });
    }
    set({ activeKey: tab.key });
  },

  closeTab(key) {
    const { tabs, activeKey } = get();
    const idx = tabs.findIndex((t) => t.key === key);
    if (idx < 0) return activeKey;
    const next = tabs.filter((t) => t.key !== key);
    let active = activeKey;
    if (activeKey === key) {
      active = next[Math.max(idx - 1, 0)]?.key ?? '/home';
    }
    set({ tabs: next.length ? next : [HOME], activeKey: next.length ? active : '/home' });
    return next.length ? active : '/home';
  },

  setActive(key) {
    set({ activeKey: key });
  },

  closeOthers(key) {
    const { tabs } = get();
    const keep = tabs.filter((t) => !t.closable || t.key === key);
    set({ tabs: keep.length ? keep : [HOME], activeKey: key });
  },

  closeAll() {
    set({ tabs: [HOME], activeKey: '/home' });
  }
}));
