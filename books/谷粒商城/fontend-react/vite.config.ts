import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// dev 时两条代理通道都指向网关（VITE_API_TARGET）：
//   /proxyApi/* -> 网关 /renren-fast/**      renren-fast 后台（context-path 已包含在重写里）
//   /gw/*       -> 网关原样路径               gulimall 微服务，如 /gw/gulimallproduct/... -> /gulimallproduct/...
// 网关地址用 VITE_API_TARGET 覆盖（8080 被 Nacos 控制台占用，本机网关在 8087）
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_TARGET || 'http://localhost:8087';
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
        },
        '/gw': {
          target,
          changeOrigin: true,
          // 只剥掉 /gw 这一段，后面就是网关认识的路径；query 会原样保留
          rewrite: (p) => p.replace(/^\/gw/, '')
        }
      }
    }
  };
});
