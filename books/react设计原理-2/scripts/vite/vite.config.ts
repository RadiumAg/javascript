import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import { resolvePkgPath } from '../rollup/utils';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    replace({ __DEV__: true, preventAssignment: true }),
    {
      // @vitejs/plugin-react 会往 optimizeDeps.include 里塞 react / react-dom，
      // include 优先级高于 exclude，只能在它之后从已解析配置里剔掉，
      // 否则浏览器加载的是 esbuild 快照，改 packages/** 源码不生效。
      name: 'serve-local-react-from-source',
      configResolved(config) {
        const localIds = [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ];
        config.optimizeDeps.include = (
          config.optimizeDeps.include ?? []
        ).filter((id) => !localIds.includes(id));
      },
    },
  ],
  // 本地 workspace 包被 esbuild 预构建后就成了静态快照，改 packages/** 源码不会进快照。
  // exclude 之后 Vite 直接按源文件转换并纳入 watcher，保存即整页 reload（库文件没有 HMR 边界）。
  optimizeDeps: {
    exclude: ['react', 'react-dom', 'react/jsx-dev-runtime'],
  },
  resolve: {
    alias: [
      {
        find: 'react',
        replacement: resolvePkgPath('react'),
      },
      {
        find: 'react-dom',
        replacement: resolvePkgPath('react-dom'),
      },
      {
        find: 'react-noop-renderer',
        replacement: resolvePkgPath('react-noop-renderer'),
      },
      {
        find: 'hostConfig',
        replacement: resolve(
          resolvePkgPath('react-dom'),
          './src/hostConfig.ts',
        ),
      },
    ],
  },
});
