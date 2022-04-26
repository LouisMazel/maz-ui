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
      reporter: 'clover',
      reportsDirectory: './../../coverage',
      excludeNodeModules: true,
      // include: ['package/**/*.{ts,vue}'],
      // all: true,
      // exclude: [],
    },
  },
  resolve: {
    alias: {
      '@package': resolve(projectRoot, 'package'),
      '@unit': resolve(projectRoot, 'tests/unit'),
    },
  },
})
