/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

import { resolve } from 'node:path'

/* eslint-disable unicorn/prefer-module */
const projectRoot = resolve(__dirname)
/* eslint-enable unicorn/prefer-module */

export default defineConfig({
  plugins: [Vue()],
  server: {
    port: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      all: true,
      excludeNodeModules: true,
      reporter: ['clover', 'html'],
      include: ['package'],
      exclude: ['package/components_tmp/**', 'package/components/index.ts'],
      extension: ['.js', '.ts', '.vue'],
    },
  },
  resolve: {
    alias: {
      '@package': resolve(projectRoot, 'package'),
      '@components': resolve(projectRoot, 'package/components'),
      '@tests': resolve(projectRoot, 'tests'),
    },
  },
})
