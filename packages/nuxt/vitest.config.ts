/// <reference types="vitest" />

import { resolve } from 'node:path'
import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

const resolveAliases = {
  '@maz-ui/utils/helpers/capitalize': resolve(__dirname, '../utils/src/helpers/capitalize.ts'),
  '@maz-ui/utils': resolve(__dirname, '../utils/src/index.ts'),
  '@maz-ui/translations/plugin': resolve(__dirname, '../translations/src/plugin.ts'),
  '@maz-ui/translations': resolve(__dirname, '../translations/src/index.ts'),
  '@maz-ui/themes/plugin': resolve(__dirname, '../themes/src/plugin.ts'),
  '@maz-ui/themes/utils/get-color-mode': resolve(__dirname, '../themes/src/utils/get-color-mode.ts'),
  '@maz-ui/themes/utils': resolve(__dirname, '../themes/src/utils/index.ts'),
  '@maz-ui/themes': resolve(__dirname, '../themes/src/index.ts'),
}

export default defineConfig({
  // @ts-expect-error -- tsconfig is omitted from Vite's OxcOptions type but supported by Rolldown; needed to prevent coverage query params from breaking tsconfig resolution in CI
  oxc: { tsconfig: false },
  logLevel: process.env.CI ? 'error' : 'info',
  resolve: {
    alias: resolveAliases,
  },
  test: {
    silent: !!process.env.CI,
    hideSkippedTests: !!process.env.CI,
    reporters: process.env.CI ? ['dot'] : ['tree'],
    globals: true,
    environment: 'node',
    projects: [
      {
        extends: true,
        define: {
          'import.meta.server': false,
          'import.meta.client': true,
        },
        test: {
          name: 'client',
          include: ['src/**/__tests__/*.spec.ts'],
          exclude: [
            ...defaultExclude,
            '**/node_modules/**',
            '**/dist/**',
            'test/**',
            'src/**/__tests__/*.server.spec.ts',
          ],
        },
      },
      {
        extends: true,
        define: {
          'import.meta.server': true,
          'import.meta.client': false,
        },
        test: {
          name: 'server',
          include: ['src/**/__tests__/*.server.spec.ts'],
          exclude: [
            ...defaultExclude,
            '**/node_modules/**',
            '**/dist/**',
            'test/**',
          ],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'html', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*.{js,ts}'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/types/**/*',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 95.79,
        statements: 100,
        autoUpdate: !process.env.CI,
      },
    },
    exclude: [
      ...defaultExclude,
      '**/node_modules/**',
      '**/dist/**',
      'test/**',
    ],
  },
})
