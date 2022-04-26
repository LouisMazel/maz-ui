import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      enabled: true,
      // all: true,
      exclude: [],
      excludeNodeModules: true,
    },
  },
  resolve: {
    alias: {
      package: './package',
      unit: './tests/unit',
    },
  },
})
