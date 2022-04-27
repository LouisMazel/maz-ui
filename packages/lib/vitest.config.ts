import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const projectRoot = resolve(__dirname)

export default defineConfig({
  plugins: [Vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      enabled: true,
      excludeNodeModules: true,
      reporter: 'clover',
      include: ['package/**/*.{ts,js,vue}'],
      exclude: ['package/components_tmp'],
      // all: true,
    },
  },
  resolve: {
    alias: {
      '@package': resolve(projectRoot, 'package'),
      '@unit': resolve(projectRoot, 'tests/unit'),
    },
  },
})
