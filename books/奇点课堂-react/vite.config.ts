import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
  esbuild: {
    jsxFactory: 'AReact.createElement',
  },
});
