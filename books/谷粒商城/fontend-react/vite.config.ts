import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// dev 时 /proxyApi/* -> renren-fast 后端 (context-path 已包含在目标里)
// 后端端口可用 VITE_API_TARGET 覆盖（本机 8080 被 Nacos 控制台占用时用，如 http://localhost:8086）
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_TARGET || 'http://localhost:8080';
  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') }
    },
    server: {
      port: 5173,
      proxy: {
        '/proxyApi': {
          target,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/proxyApi/, '/renren-fast')
        }
      }
    }
  };
});
