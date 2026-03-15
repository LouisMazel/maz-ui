import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
  vue: true,
  vueAccessibility: true,
  tailwindcss: true,
  ignores: ['LICENSE'],
})
