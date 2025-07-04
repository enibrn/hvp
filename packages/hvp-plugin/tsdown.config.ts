import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  target: 'node20',
  external: ['rollup', 'vite', 'vitepress', /^vitepress\//]
});