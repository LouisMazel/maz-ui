import { mazUi } from '@maz-ui/themes'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  mazUi: {
    general: {
      defaultMazIconPath: '/icons/path',
      autoImportPrefix: '',
      devtools: true,
    },
    css: {
      injectMainCss: true,
    },
    theme: {
      preset: mazUi,
      strategy: 'hybrid',
      darkModeStrategy: 'class',
    },
    components: {
      autoImport: true,
    },
    composables: {
      useTheme: true,
      useAos: true,
      useToast: true,
      useDialog: true,
    },
    directives: {
      vTooltip: true,
      vLazyImg: true,
    },
  },
})
