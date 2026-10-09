import type { StylelintConfig } from '../types'

/**
 * Glob patterns Stylelint should ignore by default. Mirrors the eslint-config
 * defaults plus a few CSS-specific build outputs.
 */
export const GLOBAL_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/output/**',
  '**/.output/**',
  '**/coverage/**',
  '**/temp/**',
  '**/.temp/**',
  '**/tmp/**',
  '**/.tmp/**',
  '**/.history/**',
  '**/.vitepress/cache/**',
  '**/.nuxt/**',
  '**/.next/**',
  '**/.svelte-kit/**',
  '**/.vercel/**',
  '**/.cache/**',
  '**/*.min.css',
  '**/*.min.scss',
] satisfies StylelintConfig['ignoreFiles']
