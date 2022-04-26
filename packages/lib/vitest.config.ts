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
      // include: ['package/**/*.{ts,vue}'],
      enabled: true,
      // all: true,
      reporter: ['json'],
      // reportsDirectory: './../../coverage',
      // exclude: [],
      excludeNodeModules: true,
    },
  },
  resolve: {
    alias: {
      '@package': resolve(projectRoot, 'package'),
      '@unit': resolve(projectRoot, 'tests/unit'),
    },
  },
})
