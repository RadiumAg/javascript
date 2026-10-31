import { useEffect, useMemo, useState } from 'react';
import { confirm } from '@/api/feedback';
import {
  Avatar, Button, Dropdown, Layout, Menu, Space, Spin, Tabs, Tooltip
} from 'antd';
import type { MenuProps } from 'antd';
import {
  CloseOutlined, DeleteOutlined, FileTextOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  ReloadOutlined, SettingOutlined, UserOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useTabsStore } from '@/store/tabs';
import { apiPost } from '@/api/http';
import type { MenuNode } from '@/types';
import ModuleTabContent from '@/layout/ModuleTabContent';
import PasswordModal from '@/layout/PasswordModal';

const { Header, Sider, Content } = Layout;

/** nav 树（子节点在 list 字段）-> antd Menu items */
function toAntdItems(
  nodes: MenuNode[],
  pathOfMenu: (menuId: number) => string | undefined
): MenuProps['items'] {
  return nodes.map((n) => {
    const children = n.list ?? [];
    if (children.length > 0) {
      return { key: `dir-${n.menuId}`, label: n.name, children: toAntdItems(children, pathOfMenu) };
    }
    const path = pathOfMenu(n.menuId);
    return { key: path ?? `m-${n.menuId}`, label: n.name, disabled: !path };
  });
}

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, menuList, navLoaded, moduleRoutes, iframeRoutes, loadUser, loadNav, clearLogin } = useAuthStore();
  const tabsStore = useTabsStore();
  const { tabs, activeKey, openTab, closeTab, setActive, closeOthers, closeAll } = tabsStore;
  const [collapsed, setCollapsed] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [reloadSeq, setReloadSeq] = useState(0);

  // 登录守卫（对应 Vue 版 mainRoutes.beforeEnter）
  const hasToken = /(?:^|;\s*)token=[^;]+/.test(document.cookie);
  useEffect(() => {
    if (!hasToken) {
      navigate('/login', { replace: true });
    } else {
      void loadUser();
      void loadNav();
    }
  }, [hasToken, navigate, loadUser, loadNav]);

  // 路由 -> tab 同步（对应 main-sidebar routeHandle）
  useEffect(() => {
    const path = location.pathname;
    if (!hasToken || !navLoaded || path === '/') return;
    const mod = moduleRoutes.find((r) => r.path === path);
    const iframe = iframeRoutes.find((r) => r.path === path);
    if (mod) openTab({ key: mod.path, title: mod.title, closable: true });
    else if (iframe) openTab({ key: iframe.path, title: iframe.title, closable: true });
    else if (path === '/home') openTab({ key: '/home', title: '首页', closable: false });
    else if (path === '/theme') openTab({ key: '/theme', title: '主题设置', closable: false });
  }, [location.pathname, hasToken, navLoaded, moduleRoutes, iframeRoutes, openTab]);

  const menuItems = useMemo<MenuProps['items']>(() => {
    const pathOfMenu = (menuId: number) =>
      moduleRoutes.find((r) => r.menuId === menuId)?.path ??
      iframeRoutes.find((r) => r.path === `/i-${menuId}`)?.path;
    return [
      { key: '/home', icon: <FileTextOutlined />, label: '首页' },
      { key: '/theme', icon: <SettingOutlined />, label: '主题设置' },
      ...(toAntdItems(menuList, pathOfMenu) ?? [])
    ];
  }, [menuList, moduleRoutes, iframeRoutes]);

  const doLogout = () => {
    confirm({
      title: '提示',
      content: '确定进行[退出]操作?',
      onOk: async () => {
        await apiPost('/sys/logout');
        clearLogin();
        closeAll();
        navigate('/login', { replace: true });
      }
    });
  };

  if (!hasToken || !navLoaded) {
    return <Spin fullscreen tip={hasToken ? '加载菜单中…' : '跳转登录中…'} />;
  }

  const showTabsBar = tabs.length > 1;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#001529', padding: '0 16px', position: 'sticky', top: 0, zIndex: 10
        }}
      >
        <Space>
          <span style={{ color: '#fff', fontSize: 18, cursor: 'pointer' }} onClick={() => navigate('/home')}>
            人人快速开发平台
          </span>
          <Button
            type="text"
            style={{ color: '#fff' }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((v) => !v)}
          />
        </Space>
        <Space>
          <Dropdown
            menu={{
              items: [
                { key: 'pwd', label: '修改密码' },
                { key: 'logout', label: '退出', danger: true }
              ],
              onClick: ({ key }) => {
                if (key === 'pwd') setPwdOpen(true);
                if (key === 'logout') doLogout();
              }
            }}
          >
            <Space style={{ color: '#fff', cursor: 'pointer' }}>
              <Avatar size="small" icon={<UserOutlined />} />
              {user?.username ?? ''}
            </Space>
          </Dropdown>
        </Space>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={220}
          theme="light"
          style={{ borderRight: '1px solid #f0f0f0' }}
        >
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              if (String(key).startsWith('/')) navigate(String(key));
            }}
            style={{ height: '100%', borderRight: 0, overflowX: 'hidden' }}
          />
        </Sider>
        <Content style={{ padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 8 }}>
            {showTabsBar && (
              <Tabs
                activeKey={activeKey}
                onChange={(key) => {
                  setActive(key);
                  navigate(key);
                }}
                type="editable-card"
                hideAdd
                onEdit={(key) => {
                  if (typeof key !== 'string') return;
                  const next = closeTab(key);
                  if (key === activeKey && next) navigate(next);
                }}
                tabBarExtraContent={
                  <Space size={4} style={{ marginRight: 8 }}>
                    <Tooltip title="关闭当前">
                      <Button
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => {
                          const n = closeTab(activeKey);
                          if (n) navigate(n);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="关闭其它">
                      <Button size="small" icon={<DeleteOutlined />} onClick={() => closeOthers(activeKey)} />
                    </Tooltip>
                    <Tooltip title="关闭全部">
                      <Button
                        size="small"
                        onClick={() => {
                          closeAll();
                          navigate('/home');
                        }}
                      >
                        全部关闭
                      </Button>
                    </Tooltip>
                    <Tooltip title="刷新当前标签页">
                      <Button size="small" icon={<ReloadOutlined />} onClick={() => setReloadSeq((s) => s + 1)} />
                    </Tooltip>
                  </Space>
                }
                items={tabs.map((t) => ({ key: t.key, label: t.title, closable: t.closable }))}
                style={{ padding: '8px 8px 0' }}
              />
            )}
            <div style={{ padding: 16 }}>
              {/* /home、/theme 走 router；动态菜单页面常驻渲染模拟 keep-alive */}
              <Outlet />
              <TabPanes reloadSeq={reloadSeq} />
            </div>
          </div>
        </Content>
      </Layout>
      <PasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />
    </Layout>
  );
}

/** 每个非静态 tab 一个常驻面板，display 控制显隐（keep-alive） */
function TabPanes({ reloadSeq }: { reloadSeq: number }) {
  const { tabs, activeKey } = useTabsStore();
  const { moduleRoutes, iframeRoutes } = useAuthStore();
  return (
    <>
      {tabs
        .filter((t) => t.key !== '/home' && t.key !== '/theme')
        .map((t) => {
          const mod = moduleRoutes.find((r) => r.path === t.key);
          const iframe = iframeRoutes.find((r) => r.path === t.key);
          return (
            <div key={`${t.key}-${reloadSeq}`} style={{ display: activeKey === t.key ? 'block' : 'none' }}>
              {iframe ? (
                <iframe className="tab-iframe" src={iframe.src} title={iframe.title} />
              ) : mod ? (
                <ModuleTabContent url={mod.url} path={mod.path} />
              ) : null}
            </div>
          );
        })}
    </>
  );
}
