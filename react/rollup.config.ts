import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
  input: 'dist/index.js',
  output: {
    file: 'dist/simple-react.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript()
  ],
  external: ['process']
};

export default config;