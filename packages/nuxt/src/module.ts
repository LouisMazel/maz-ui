import type { AgentTarget, SetupAgentsChange, SetupAgentsResult } from '@maz-ui/node'
import type { IconDir } from '@maz-ui/vite-plugin'
import type { Nuxt } from 'nuxt/schema'
import type { MazUiNuxtOptions } from './types'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { readPackageVersion, setupAgents } from '@maz-ui/node'
import { capitalize } from '@maz-ui/utils/helpers/capitalize'
import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
import { generateIconTypes, loadIconNames, MazUiIcons, MazUiPurgeCss, MazUiThemePresets, resolveIconTypesModule } from '@maz-ui/vite-plugin'
import { onDevtoolsReady } from '@nuxt/devtools-kit'
import {
  addComponent,
  addImports,
  addPlugin,
  addTemplate,
  addTypeTemplate,
  addVitePlugin,
  createResolver,
  defineNuxtModule,
  resolvePath,
  updateTemplates,
  useLogger,
} from '@nuxt/kit'
import { defu } from 'defu'
import { renderTranslationsMessages, TRANSLATIONS_MESSAGES_TEMPLATE } from './translations-messages'

type MazUiComposables = keyof typeof import('maz-ui/composables')

type Composables = Omit<
  Record<MazUiComposables | 'useTheme' | 'useTranslations', true>,
  'useAos' | 'useDialog' | 'useToast' | 'useWait' | 'useMazIconProps'
>

declare module 'nuxt/schema' {
  interface NuxtConfig {
    mazUi?: MazUiNuxtOptions
  }

  interface NuxtOptions {
    mazUi: MazUiNuxtOptions
  }

  interface PublicRuntimeConfig {
    mazUi: Required<Omit<MazUiNuxtOptions, 'agents'>>
  }
}

/** The components and composables of maz-ui, written by its build (`maz-ui/exports.json`) */
const mazUiExports: { components: string[], composables: string[] } = createRequire(import.meta.url)('maz-ui/exports.json')

const _dirname = dirname(fileURLToPath(import.meta.url))

const pluginComposables: Record<'useTheme' | 'useTranslations', true> = {
  useTheme: true,
  useTranslations: true,
}

/** Auto-imported through their plugin (`mazUi.plugins`), or internal to the components */
const NOT_AUTO_IMPORTED_COMPOSABLES = new Set([
  'useAos',
  'useDialog',
  'useToast',
  'useWait',
  'useMazIconProps',
])

const mazUiComposables = Object.fromEntries(
  mazUiExports.composables
    .filter(name => !NOT_AUTO_IMPORTED_COMPOSABLES.has(name))
    .map(name => [name, true]),
) as Omit<Record<MazUiComposables, true>, 'useAos' | 'useDialog' | 'useToast' | 'useWait' | 'useMazIconProps'>

const defaults = {
  general: {
    autoImportPrefix: '',
    defaultMazIconPath: '',
    devtools: true,
    preventIosInputZoom: false,
  },
  css: {
    injectCss: true,
    injectUtilities: false,
    purge: true,
  },
  theme: {
    preset: 'maz-ui',
    strategy: 'runtime',
    darkModeStrategy: 'class',
    colorMode: 'auto',
    mode: 'both',
  },
  translations: {
    locale: 'en',
    fallbackLocale: 'en',
    preloadFallback: true,
  },
  defaults: {},
  flags: 'cdn',
  icons: true,
  components: {
    autoImport: true,
  },
  plugins: {
    aos: false,
    dialog: false,
    toast: false,
    wait: false,
  },
  composables: {
    ...pluginComposables,
    ...mazUiComposables,
  } satisfies Composables,
  directives: {
    vZoomImg: false,
    vLazyImg: false,
    vClickOutside: false,
    vFullscreenImg: false,
    vIntersect: false,
    vTooltip: false,
  },
  agents: {
    rules: false,
    mcp: false,
  },
} satisfies Required<MazUiNuxtOptions>

function formatAgentsLog(applied: SetupAgentsChange[], result: SetupAgentsResult, options: { rules: boolean, mcp: boolean, requestedTargets?: AgentTarget[] }): string {
  const files = applied.map(change => [change.file, `(${change.action})`].join(' ')).join(', ')
  const messages = [`AI agents configured for maz-ui: ${files}.`]

  // An explicit target list is a choice: AGENTS.md is only suggested for the detected agents
  if (options.rules && !options.requestedTargets && !result.targets.includes('agents-md')) {
    const suggestedTargets = [...result.targets, 'agents-md'].map(target => ['\'', target, '\''].join('')).join(', ')

    messages.push(`AGENTS.md not written: no agent that reads it was detected (Cursor, Copilot, Codex, Windsurf, Gemini CLI, Zed...). If your team uses one, set mazUi.agents.targets: [${suggestedTargets}].`)
  }

  if (options.mcp && !result.localMcpServer)
    messages.push('The MCP server runs through npx: add @maz-ui/mcp to the devDependencies of the project root to start it in about a second, at the version of your lockfile.')

  return messages.join(' ')
}

/** Version of the maz-ui that Node.js resolves from a file, `undefined` when it does not resolve */
const ICON_TYPES_TEMPLATE = 'types/maz-icons.d.ts'

function resolveIconDir(dir: IconDir, rootDir: string): IconDir {
  return typeof dir === 'string'
    ? resolve(rootDir, dir)
    : {
        ...dir,
        path: resolve(rootDir, dir.path),
      }
}

function setupIcons(options: MazUiNuxtOptions['icons'], nuxt: Nuxt) {
  const iconsOptions = typeof options === 'object'
    ? options
    : {}
  const { rootDir } = nuxt.options
  const dir = Array.isArray(iconsOptions.dir)
    ? iconsOptions.dir.map(entry => resolveIconDir(entry, rootDir))
    : resolveIconDir(iconsOptions.dir ?? join(nuxt.options.srcDir, 'icons'), rootDir)
  const paths = (Array.isArray(dir)
    ? dir
    : [dir]).map(entry => typeof entry === 'string'
    ? entry
    : entry.path)

  addVitePlugin(MazUiIcons({ ...iconsOptions, dir, dts: false }))

  // Written by Nuxt, `nuxi prepare` and `nuxi typecheck` have them without running Vite
  addTypeTemplate({
    filename: ICON_TYPES_TEMPLATE,
    getContents: () => generateIconTypes(
      loadIconNames({
        root: rootDir,
        dir,
        prefix: iconsOptions.prefix,
        defaultIcons: iconsOptions.defaultIcons,
      }),
      {
        strict: iconsOptions.strict,
        module: resolveIconTypesModule(rootDir),
      },
    ),
  })

  nuxt.hook('builder:watch', async (event, relativePath) => {
    const path = resolve(nuxt.options.srcDir, relativePath)
    if ((event === 'add' || event === 'unlink') && paths.some(directory => path.startsWith(`${directory}/`)) && path.endsWith('.svg')) {
      await updateTemplates({
        filter: template => template.filename === ICON_TYPES_TEMPLATE,
      })
    }
  })
}

/**
 * `@maz-ui/icons/vue`, from the maz-ui of the module: with pnpm strict, an app that only depends on `@maz-ui/nuxt`
 * does not resolve `@maz-ui/icons`
 */
function resolveIconsVue(): string {
  try {
    const mazUiPackage = createRequire(import.meta.url).resolve('maz-ui/package.json')
    return createRequire(mazUiPackage).resolve('@maz-ui/icons/vue')
  }
  catch {
    return '@maz-ui/icons/vue'
  }
}

function resolveMazUiVersion(from: string): string | undefined {
  try {
    return readPackageVersion(dirname(createRequire(from).resolve('maz-ui/package.json')))
  }
  catch {
    return undefined
  }
}

/**
 * The plugins of the module import the maz-ui of the module, the auto-imported components and composables the maz-ui
 * of the app: two versions are two copies, and the components of one do not see the defaults provided by the other
 */
function checkMazUiVersion(rootDir: string | undefined) {
  if (!rootDir)
    return

  const appVersion = resolveMazUiVersion(join(rootDir, 'package.json'))
  const moduleVersion = resolveMazUiVersion(import.meta.url)

  if (appVersion && moduleVersion && appVersion !== moduleVersion) {
    useLogger('maz-ui').warn(`The app installs maz-ui ${appVersion} and @maz-ui/nuxt uses maz-ui ${moduleVersion}: two copies of maz-ui are loaded, and the options of the module (\`mazUi.general\`, \`mazUi.plugins\`...) may not apply to the components. Install the same version of maz-ui and @maz-ui/nuxt.`)
  }
}

function syncAgents(agents: MazUiNuxtOptions['agents'], nuxt: Nuxt) {
  if (!agents || !(nuxt.options.dev || nuxt.options._prepare) || process.env.CI || nuxt.options.test) {
    return
  }

  const logger = useLogger('@maz-ui/mcp')

  try {
    const { rootDir, workspaceDir } = nuxt.options
    const { targets: requestedTargets, rules = true, mcp = true, dir, paths } = typeof agents === 'object'
      ? agents
      : {}
    // In a monorepo, the agents start at the workspace root, not in the Nuxt app
    const projectDir = dir
      ? resolve(rootDir, dir)
      : (workspaceDir || rootDir)

    if (!rules && !mcp)
      return

    // The maz-ui and the @maz-ui/mcp of the app give the rules and the version pinned in the npx command
    const result = setupAgents({
      rootDir: projectDir,
      appDir: rootDir,
      targets: requestedTargets,
      rules,
      mcp,
      paths,
    })
    const applied = result.changes.filter(change => ['create', 'update', 'remove'].includes(change.action))

    if (applied.length > 0) {
      logger.info(formatAgentsLog(applied, result, { rules, mcp, requestedTargets }))
    }
  }
  catch (error) {
    logger.warn(`Could not configure the AI agents for maz-ui: ${getErrorMessage(error)}`)
  }
}

/** The entries of maz-ui the plugins and directives enabled in the options install */
function getModuleEntries(options: { plugins: NonNullable<MazUiNuxtOptions['plugins']>, directives: NonNullable<MazUiNuxtOptions['directives']> }): string[] {
  const plugins = Object.entries(options.plugins).filter(([, enabled]) => enabled).map(([name]) => `plugins/${name}`)
  const directives = Object.entries(options.directives).filter(([, enabled]) => enabled).map(([name]) => `directives/${name}`)

  return [
    ...plugins,
    ...directives,
  ]
}

/** Chunks of the named presets of @maz-ui/themes (`dist` when installed, `src` in the monorepo) */
const THEME_PRESET_CHUNK = /[\\/]themes[\\/](?:dist|src)[\\/]presets[\\/]/

function addMazUiComposableImport({
  name,
  from,
  prefix = '',
}: {
  name: string
  from: string
  prefix: string
}) {
  addImports({
    from,
    name,
    as: `use${capitalize(prefix)}${name.replace('use', '')}`,
  })
}

export default defineNuxtModule<MazUiNuxtOptions>({
  meta: {
    name: 'maz-ui',
    configKey: 'mazUi',
    compatibility: {
      nuxt: '>=3.4.0 <5.0.0',
    },
  },
  defaults,
  /* eslint-disable complexity, sonarjs/cognitive-complexity */
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.build.transpile.push('maz-ui', '@maz-ui/themes', '@maz-ui/translations')

    checkMazUiVersion(nuxt.options.rootDir)

    const { agents, ...moduleOptions } = defu(
      nuxt.options.runtimeConfig.public.mazUi,
      options,
      defaults,
    )

    // The messages go through a template, not the runtime config (serialized in the payload of every page)
    const { messages: translationsMessages, ...translationsOptions } = moduleOptions.translations ?? {}
    moduleOptions.translations = translationsOptions

    // The presets of the build are a build option, not a runtime one
    const { presets: themePresets, ...themeOptions }: NonNullable<MazUiNuxtOptions['theme']> = moduleOptions.theme ?? {}
    moduleOptions.theme = themeOptions as typeof moduleOptions.theme

    nuxt.options.runtimeConfig.public.mazUi = moduleOptions

    addTemplate({
      filename: TRANSLATIONS_MESSAGES_TEMPLATE,
      getContents: () => renderTranslationsMessages(
        translationsMessages,
        path => resolvePath(path),
        message => useLogger('maz-ui').warn(message),
      ),
    })

    // AI agents

    syncAgents(agents, nuxt)

    // CSS

    if (moduleOptions.css.injectUtilities) {
      nuxt.options.css.unshift('maz-ui/utilities.css')
    }

    if (moduleOptions.css.injectCss) {
      nuxt.options.css.unshift('maz-ui/style.css')
    }

    if (moduleOptions.css.purge !== false && !nuxt.options.dev) {
      const purgeOptions = typeof moduleOptions.css.purge === 'object'
        ? moduleOptions.css.purge
        : {}

      addVitePlugin(MazUiPurgeCss({
        ...purgeOptions,
        // The plugins and directives of the module are installed from node_modules, where the purge does not look
        entries: [
          ...getModuleEntries(moduleOptions),
          ...(purgeOptions.entries ?? []),
        ],
      }))
    }

    // Icons by name: each file registers the icons it uses, in its chunk

    if (moduleOptions.icons !== false) {
      setupIcons(moduleOptions.icons, nuxt)
    }

    // Icons are one ESM module each: pre-bundled, every new one found while browsing reloads the page
    nuxt.options.vite ??= {}
    nuxt.options.vite.optimizeDeps ??= {}
    const optimizeDeps = nuxt.options.vite.optimizeDeps
    if (!optimizeDeps.include?.includes('@maz-ui/icons') && !optimizeDeps.exclude?.includes('@maz-ui/icons')) {
      optimizeDeps.exclude = [
        ...(optimizeDeps.exclude ?? []),
        '@maz-ui/icons',
      ]
    }

    // Theme presets

    // `getPreset` imports each named preset on demand: the renderer would prefetch all of them on every page
    nuxt.hook('build:manifest', (manifest) => {
      for (const [id, chunk] of Object.entries(manifest)) {
        if (THEME_PRESET_CHUNK.test(chunk.src ?? id))
          chunk.prefetch = false
      }
    })

    if (themePresets) {
      addVitePlugin(MazUiThemePresets({
        presets: typeof themeOptions.preset === 'string'
          ? [
              ...themePresets,
              themeOptions.preset,
            ]
          : themePresets,
      }))
    }

    // cssnano's `postcss-calc` cannot parse the relative OKLCh values maz-ui
    // emits (`oklch(from X clamp(0, calc(l - .05), 1) c h)`) and floods
    // production builds with harmless "Lexical error" warnings. Disable only
    // its `calc` optimization; the rest of the minification is untouched. Left
    // alone if the user explicitly disabled cssnano.
    nuxt.options.postcss ??= { plugins: {}, order: [] }
    nuxt.options.postcss.plugins ??= {}
    const postcssPlugins = nuxt.options.postcss.plugins
    if (postcssPlugins.cssnano !== false) {
      const current = typeof postcssPlugins.cssnano === 'object' && postcssPlugins.cssnano !== null
        ? postcssPlugins.cssnano
        : {}
      postcssPlugins.cssnano = {
        ...current,
        preset: [
          'default',
          { calc: false },
        ],
      }
    }

    // Plugins

    addPlugin(resolve(_dirname, './runtime/plugins/theme'))
    addPlugin(resolve(_dirname, './runtime/plugins/translations'))
    addPlugin(resolve(_dirname, './runtime/plugins/maz-link-component'))

    // Flags: a URL template is a plain default, the local flags need their loader (only imported by this plugin)

    const flags = moduleOptions.flags

    if (flags && flags !== 'cdn' && flags !== 'local') {
      moduleOptions.defaults = {
        ...moduleOptions.defaults,
        global: { flagSrc: flags, ...moduleOptions.defaults.global },
      }
    }

    if (flags === 'local') {
      addPlugin(resolve(_dirname, './runtime/plugins/local-flags'))
    }
    else if (Object.keys(moduleOptions.defaults).length > 0) {
      addPlugin(resolve(_dirname, './runtime/plugins/defaults'))
    }

    // Components

    if (moduleOptions.components.autoImport) {
      for (const name of mazUiExports.components) {
        addComponent({
          name,
          filePath: `maz-ui/components/${name}`,
        })
      }

      // The component of the icons by name, without style, for the wrappers of the app
      addComponent({
        name: 'MazIconPrimitive',
        export: 'MazIconPrimitive',
        filePath: resolveIconsVue(),
      })
    }

    // Plugins

    const autoImportPrefix = moduleOptions.general.autoImportPrefix

    if (moduleOptions.plugins.aos) {
      addPlugin(resolve(_dirname, './runtime/plugins/aos'))

      addImports({
        name: 'useAos',
        from: resolve(_dirname, './runtime/composables/useAos'),
        as: `use${capitalize(autoImportPrefix)}Aos`,
      })

      const injectAosCSS
        = typeof moduleOptions.plugins.aos === 'object'
          && typeof moduleOptions.plugins.aos.injectCss === 'boolean'
          ? moduleOptions.plugins.aos.injectCss
          : true

      if (injectAosCSS) {
        nuxt.options.css = ['maz-ui/aos.css', ...nuxt.options.css]
      }
    }

    if (moduleOptions.plugins.toast) {
      addPlugin(resolve(_dirname, './runtime/plugins/toast'))
      addImports({
        name: 'useToast',
        from: resolve(_dirname, './runtime/composables/useToast'),
        as: `use${capitalize(autoImportPrefix)}Toast`,
      })
    }

    if (moduleOptions.plugins.dialog) {
      addPlugin(resolve(_dirname, './runtime/plugins/dialog'))
      addImports({
        name: 'useDialog',
        from: resolve(_dirname, './runtime/composables/useDialog'),
        as: `use${capitalize(autoImportPrefix)}Dialog`,
      })
    }

    if (moduleOptions.plugins.wait) {
      addPlugin(resolve(_dirname, './runtime/plugins/wait'))
      addImports({
        name: 'useWait',
        from: resolve(_dirname, './runtime/composables/useWait'),
        as: `use${capitalize(autoImportPrefix)}Wait`,
      })
    }

    // Directives

    if (moduleOptions.directives.vZoomImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-zoom-img'))
    }

    if (moduleOptions.directives.vLazyImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-lazy-img'))
    }

    if (moduleOptions.directives.vClickOutside) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-click-outside'))
    }

    if (moduleOptions.directives.vFullscreenImg) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-fullscreen-img'))
    }

    if (moduleOptions.directives.vIntersect) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-intersect'))
    }

    if (moduleOptions.directives.vTooltip) {
      addPlugin(resolve(_dirname, './runtime/plugins/v-tooltip'))
    }

    // Composables

    const allowedMazUiComposables = Object.keys(moduleOptions.composables).filter(composable => mazUiComposables[composable as keyof typeof mazUiComposables])

    for (const composable of allowedMazUiComposables) {
      addMazUiComposableImport({
        name: composable,
        from: `maz-ui/composables/${composable}`,
        prefix: autoImportPrefix,
      })
    }

    if (moduleOptions.composables.useTheme) {
      addImports({
        name: 'useTheme',
        from: '@maz-ui/themes',
        as: `use${capitalize(autoImportPrefix)}Theme`,
      })
    }

    if (moduleOptions.composables.useTranslations) {
      addImports({
        name: 'useTranslations',
        from: '@maz-ui/translations',
        as: `use${capitalize(autoImportPrefix)}Translations`,
      })
    }

    // Maz Icon Path
    if (moduleOptions.general.defaultMazIconPath) {
      addPlugin(resolve(_dirname, './runtime/plugins/maz-icon-path'))
    }

    // iOS input zoom
    if (moduleOptions.general.preventIosInputZoom) {
      addPlugin(resolve(_dirname, './runtime/plugins/prevent-ios-input-zoom.client'))
    }

    // Devtools
    if (moduleOptions.general.devtools) {
      onDevtoolsReady((ctx) => {
        ctx.docks.register({
          id: 'maz-ui',
          type: 'iframe',
          title: 'maz-ui',
          icon: 'https://maz-ui.com/img/icons/android-chrome-512x512.png',
          url: 'https://maz-ui.com',
        })
      })
    }
  },
})
