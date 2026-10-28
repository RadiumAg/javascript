import { Alert, Card } from 'antd';

/**
 * 简化版主题页（对应 views/common/theme.vue）。
 * Vue 版通过 vuex 切换 navbar/sidebar 明暗并全站生效；
 * React 版布局固定使用 antd 默认风格，此页仅作说明占位。
 */
export default function ThemePage() {
  return (
    <Card title="主题设置">
      <Alert
        type="info"
        showIcon
        message="React 版暂未实现 Vue 版的导航栏/侧边栏明暗切换，功能保持默认主题。如需扩展，可在 MainLayout 中接入 Sider theme 与 ConfigProvider algorithm。"
      />
    </Card>
  );
}
