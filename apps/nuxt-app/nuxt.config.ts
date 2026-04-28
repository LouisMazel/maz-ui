import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import postcssNested from 'postcss-nested'
import svgLoader from 'vite-svg-loader'
import mazUiModule from './../../packages/nuxt/src/module'

const isDev = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  modules: [mazUiModule],

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Dev App - Maz-UI',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
        },
      ],
    },
  },
  css: ['~/css/main.css'],

  srcDir: 'src/',

  devServer: {
    port: 3333,
  },

  compatibilityDate: '2024-07-22',

  vite: {
    plugins: [tailwindcss(), svgLoader()],
    // Resolve `monorepo:dev` first when developing so we consume maz-ui's
    // raw src/ (with HMR), and fall back to the published dist for prod
    // builds. Same trick as accor-core-library.
    resolve: {
      conditions: isDev
        ? ['monorepo:dev', 'import', 'browser', 'module', 'default', 'require']
        : ['import', 'browser', 'module', 'default', 'require'],
    },
    css: {
      postcss: {
        // In dev only: flatten postcss-nested `&-child` syntax that ships
        // in raw maz-ui SFCs loaded via the `monorepo:dev` resolve
        // condition. Prod consumes the already-flattened dist.
        plugins: isDev ? [postcssNested()] : [],
      },
    },
  },

  mazUi: {
    theme: {
      preset: 'nova',
      mode: 'both',
      colorMode: 'auto',
    },
    translations: {
      locale: 'fr',
      preloadFallback: true,
      fallbackLocale: 'en',
    },
    plugins: {
      aos: true,
      dialog: true,
      toast: true,
      wait: true,
    },
    directives: {
      vTooltip: true,
    },
  },
})
