import { existsSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import mazUiModule from '@maz-ui/nuxt'
import { VitePreNestedCss } from '@maz-ui/vite-config'
import svgLoader from '@maz-ui/vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'

// In dev, the app reads the sources of the packages (HMR, no rebuild): `MAZ_UI_DIST=1 pnpm dev` tests their dist
const isDev = process.env.NODE_ENV !== 'production' && process.env.MAZ_UI_DIST !== '1'

const mazUiSources = fileURLToPath(new URL('../../packages/maz-ui/src/components/', import.meta.url))

export default defineNuxtConfig({
  modules: [
    mazUiModule,
    // After the module of maz-ui, which registers the components: they are resolved by Node (dist), in dev they
    // use their sources too
    (_options, nuxt) => {
      if (!isDev)
        return

      nuxt.hook('components:extend', (components) => {
        for (const component of components) {
          const name = /maz-ui\/(?:dist\/)?components\/(Maz\w+)(?:\.js|\.mjs)?$/.exec(component.filePath)?.[1]
          const source = name && `${mazUiSources}${name}.vue`

          if (source && existsSync(source))
            component.filePath = source
        }
      })
    },
  ],

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

  // The sources of maz-ui keep their doc comments in the templates while the server renders the dist, which has none:
  // the comments make the client hydration fail in dev
  vue: {
    compilerOptions: {
      comments: false,
    },
  },

  vite: {
    plugins: [
      VitePreNestedCss(),
      tailwindcss(),
      svgLoader(),
    ],
    // Resolve `monorepo:dev` first when developing so we consume maz-ui's
    // raw src/ (with HMR), and fall back to the published dist for prod
    // builds. Same trick as accor-core-library.
    resolve: {
      conditions: isDev
        ? [
            'monorepo:dev',
            'import',
            'browser',
            'module',
            'default',
          ]
        : [
            'import',
            'browser',
            'module',
            'default',
          ],
    },
    // The server renders the same sources as the client, or the hydration would not match
    $server: isDev
      ? {
          resolve: {
            conditions: ['monorepo:dev', 'import', 'module', 'node', 'default'],
            externalConditions: ['monorepo:dev', 'import', 'module', 'node', 'default'],
          },
          ssr: { noExternal: ['maz-ui', /^@maz-ui\//] },
        }
      : undefined,
  },

  mazUi: {
    // The panels stay under the sticky toolbar of the modernisation page
    defaults: {
      MazPopover: { collisionPadding: { top: 88 } },
    },
    css: { injectCss: !isDev },
    icons: { prefix: 'app' },
    theme: {
      preset: 'maz-ui',
      mode: 'both',
      colorMode: 'auto',
      overrides: {
        scales: {
          color: 'perceptual',
        },
      },
    },
    translations: {
      locale: 'fr',
      preloadFallback: true,
      fallbackLocale: 'en',
    },
    aos: true,
    directives: {
      vTooltip: true,
    },
  },
})
