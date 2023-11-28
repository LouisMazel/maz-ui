// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-expect-error
import postcss from 'maz-ui/postcss.config.cjs'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  modules: ['nuxt-module', '@nuxtjs/tailwindcss'],
  css: ['~/css/main.css'],
  devServer: {
    port: 3333,
  },
  mazUi: {
    defaultMazIconPath: '/icons',
    injectComponents: true,
    injectCss: true,
    injectAos: {
      router: true,
      injectCss: true,
      delay: 1000,
    },
    injectUseToast: {
      position: 'bottom-right',
      timeout: 1000,
      persistent: false,
    },
    injectUseThemeHandler: {
      darkClass: 'dark',
      lightClass: 'light',
      storageThemeKey: 'theme',
      storageThemeValueDark: 'dark',
      storageThemeValueLight: 'light',
    },
    injectUseIdleTimeout: true,
    injectUseUserVisibility: true,
    injectUseWait: true,
    injectUseWindowSize: true,
    injectUseBreakpoints: true,
    injectUseTimer: true,
    installVZoomImg: true,
    installVLazyImg: true,
    installVClickOutside: true,
    installVFullscreenImg: true,
    devtools: true,
  },
  srcDir: 'src/',
  app: {
    head: {
      title: 'Dev App - Maz-UI',
    },
  },
  postcss,
  vite: {
    plugins: [svgLoader()],
  },
  devtools: { enabled: true },
})
