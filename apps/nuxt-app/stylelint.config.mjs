import { defineConfig } from '@maz-ui/stylelint-config'

export default defineConfig({
  ignores: ['.DS_Store'],
  logical: false,
  order: false,
  html: true,
  vue: true,
  tailwind: true,
})
