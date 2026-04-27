import { defineConfig } from '@maz-ui/stylelint-config'

export default defineConfig({
  vue: true,
  tailwind: true,
  scss: true,
  // Lib already ships fully-authored CSS — logical-property warnings and
  // recess property ordering would be too noisy on the existing surface.
  // Re-enable per-package when the codebase is ready for the diff.
  logical: true,
  order: true,
  html: true,
  ignores: ['types/**/*', '.DS_Store'],
})
