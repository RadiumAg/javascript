import { Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { Alert, Spin } from 'antd';
import { resolveModule } from '@/modules/registry';

export default function ModuleTabContent({
  url,
  path,
}: {
  url: string;
  path: string;
}) {
  const Comp: LazyExoticComponent<ComponentType<any>> | undefined =
    resolveModule(url);
  if (!Comp) {
    return (
      <Alert
        type="warning"
        showIcon
        message={`未实现的菜单页面：模块「${path}」`}
        description={`菜单 url="${url}" 没有对应的 React 组件，请在 src/modules/registry.tsx 中登记。`}
      />
    );
  }
  return (
    <Suspense
      fallback={
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Spin />
        </div>
      }
    >
      <Comp />
    </Suspense>
  );
}
