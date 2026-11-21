import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import moduleConfig from '../module'

const { addComponent, addPlugin, addVitePlugin, MazUiPurgeCss, MazUiThemePresets, MazUiIcons, generateIconTypes, loadIconNames, resolveIconTypesModule, addImports, addTemplate, addTypeTemplate, updateTemplates, resolvePath, createResolver, defineNuxtModule, onDevtoolsReady, register, useLogger, logger, setupAgents, readPackageVersion, createRequire } = vi.hoisted(() => {
  const logger = {
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }

  return {
    logger,
    useLogger: vi.fn(() => logger),
    setupAgents: vi.fn(() => ({
      targets: [] as string[],
      version: '5.0.0',
      changes: [] as Array<{ file: string, action: string }>,
      localMcpServer: true,
    })),
    readPackageVersion: vi.fn((): string | undefined => undefined),
    addComponent: vi.fn(),
    addPlugin: vi.fn(),
    addVitePlugin: vi.fn(),
    MazUiPurgeCss: vi.fn((options: Record<string, unknown>) => ({ name: 'maz-ui:purge-css', options })),
    MazUiIcons: vi.fn((options: Record<string, unknown>) => ({ name: 'maz-ui:icons', options })),
    generateIconTypes: vi.fn((names: string[], options: Record<string, unknown>) => `types of ${names.join(', ')} ${JSON.stringify(options)}`),
    loadIconNames: vi.fn((_options: Record<string, unknown>) => ['x-mark', 'app:hero']),
    resolveIconTypesModule: vi.fn((_root: string): string => 'maz-ui'),
    MazUiThemePresets: vi.fn((options: Record<string, unknown>) => ({ name: 'maz-ui:theme-presets', options })),
    addTemplate: vi.fn(),
    addTypeTemplate: vi.fn(),
    updateTemplates: vi.fn(),
    resolvePath: vi.fn((path: string) => Promise.resolve(`/project/${path.replace('~/', '')}`)),
    addImports: vi.fn(),
    createResolver: vi.fn(() => ({
      resolve: (...args: string[]) => args.join('/'),
    })),
    defineNuxtModule: vi.fn((config: any) => config),
    onDevtoolsReady: vi.fn(),
    register: vi.fn(),
    createRequire: vi.fn((from: string) => Object.assign(
      (id: string): unknown => process.getBuiltinModule('node:module').createRequire(from)(id),
      {
        resolve: (id: string): string => {
          throw new Error(`Cannot find module '${id}'`)
        },
      },
    )),
  }
})

vi.mock('node:module', async importOriginal => ({
  ...await importOriginal<typeof import('node:module')>(),
  createRequire,
}))

vi.mock('@nuxt/kit', () => ({
  addComponent,
  addPlugin,
  addVitePlugin,
  addImports,
  addTemplate,
  addTypeTemplate,
  updateTemplates,
  resolvePath,
  createResolver,
  defineNuxtModule,
  useLogger,
}))

vi.mock('@maz-ui/vite-plugin', () => ({
  MazUiPurgeCss,
  MazUiIcons,
  generateIconTypes,
  loadIconNames,
  resolveIconTypesModule,
  MazUiThemePresets,
}))

vi.mock('@maz-ui/node', () => ({
  setupAgents,
  readPackageVersion,
}))

vi.mock('@nuxt/devtools-kit', () => ({
  onDevtoolsReady,
}))

vi.mock('defu', () => ({
  defu: (...args: any[]) => Object.assign({}, ...args.reverse()),
}))

vi.mock('@maz-ui/utils/helpers/capitalize', () => ({
  // maz-ui-review-ignore prefer-utils -- mock of capitalize itself
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
}))

describe('nuxt module', () => {
  const config = moduleConfig as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('meta', () => {
    it('should have correct name', () => {
      expect(config.meta.name).toBe('maz-ui')
    })

    it('should have correct configKey', () => {
      expect(config.meta.configKey).toBe('mazUi')
    })

    it('should have correct nuxt compatibility', () => {
      expect(config.meta.compatibility.nuxt).toBe('>=3.4.0 <5.0.0')
    })
  })

  describe('defaults', () => {
    it('should have correct general defaults', () => {
      expect(config.defaults.general).toEqual({
        autoImportPrefix: '',
        defaultMazIconPath: '',
        devtools: true,
        preventIosInputZoom: false,
      })
    })

    it('should have correct css defaults', () => {
      expect(config.defaults.css).toEqual({
        injectCss: true,
        injectUtilities: false,
        purge: true,
      })
    })

    it('should have correct theme defaults', () => {
      expect(config.defaults.theme).toEqual({
        preset: 'maz-ui',
        strategy: 'runtime',
        darkModeStrategy: 'class',
        colorMode: 'auto',
        mode: 'both',
      })
    })

    it('should have correct translations defaults', () => {
      expect(config.defaults.translations).toEqual({
        locale: 'en',
        fallbackLocale: 'en',
        preloadFallback: true,
      })
    })

    it('should have correct components defaults', () => {
      expect(config.defaults.components).toEqual({
        autoImport: true,
      })
    })

    it('should have correct toast, dialog and aos defaults', () => {
      expect(config.defaults.toast).toEqual({})
      expect(config.defaults.dialog).toEqual({})
      expect(config.defaults.aos).toBe(false)
    })

    it('should have correct plugins defaults', () => {
      expect(config.defaults.plugins).toEqual({
        aos: false,
        dialog: false,
        toast: false,
        wait: false,
      })
    })

    it('should have correct directives defaults', () => {
      expect(config.defaults.directives).toEqual({
        vZoomImg: false,
        vLazyImg: false,
        vClickOutside: false,
        vFullscreenImg: false,
        vIntersect: false,
        vTooltip: false,
      })
    })

    it('should include all maz-ui composables in defaults', () => {
      const composables = config.defaults.composables
      expect(composables.useTheme).toBe(true)
      expect(composables.useTranslations).toBe(true)
      expect(composables.useIdleTimeout).toBe(true)
      expect(composables.useReadingTime).toBe(true)
      expect(composables.useRelativeTime).toBe(true)
      expect(composables.useFormField).toBe(true)
      expect(composables.useWindowSize).toBe(true)
      expect(composables.useBreakpoints).toBe(true)
      expect(composables.useUserVisibility).toBe(true)
      expect(composables.useStringMatching).toBe(true)
      expect(composables.useTimer).toBe(true)
      expect(composables.useFormValidator).toBe(true)
      expect(composables.useDisplayNames).toBe(true)
      expect(composables.useFreezeValue).toBe(true)
      expect(composables.useInjectStrict).toBe(true)
      expect(composables.useDropzone).toBe(true)
      expect(composables.useInstanceUniqId).toBe(true)
      expect(composables.useMountComponent).toBe(true)
      expect(composables.useSwipe).toBe(true)
      expect(composables.usePullToRefresh).toBe(true)
      expect(composables.useMutationObserver).toBe(true)
      expect(composables.useIntersectionObserver).toBe(true)
      expect(composables.useScroll).toBe(true)
      expect(composables.useInfiniteScroll).toBe(true)
      expect(composables.useScrollLock).toBe(true)
      expect(composables.useResizeObserver).toBe(true)
      expect(composables.useToast).toBe(true)
      expect(composables.useDialog).toBe(true)
      expect(composables.useWait).toBe(true)
      expect(composables).not.toHaveProperty('useAos')
    })
  })

  describe('setup', () => {
    function createNuxtMock(overrides: Record<string, any> = {}, nuxtOptions: Record<string, any> = {}) {
      return {
        hook: vi.fn(),
        options: {
          rootDir: '/project',
          srcDir: '/project/app',
          dev: false,
          build: { transpile: [] },
          vite: {} as Record<string, any>,
          runtimeConfig: {
            public: {
              mazUi: {},
            },
          },
          css: [],
          postcss: { plugins: {} as Record<string, any>, order: [] },
          ...nuxtOptions,
        },
        ...overrides,
      }
    }

    function getTemplate(filename: string) {
      return addTemplate.mock.calls.map(([template]) => template).find(template => template.filename === filename)
    }

    function callSetup(options: Record<string, any> = {}, nuxtOverrides: Record<string, any> = {}, nuxtOptions: Record<string, any> = {}) {
      const nuxt = createNuxtMock(nuxtOverrides, nuxtOptions)
      const mergedOptions = {
        ...config.defaults,
        ...options,
        general: {
          ...config.defaults.general,
          ...options.general,
        },
        css: {
          ...config.defaults.css,
          ...options.css,
        },
        components: {
          ...config.defaults.components,
          ...options.components,
        },
        plugins: {
          ...config.defaults.plugins,
          ...options.plugins,
        },
        composables: {
          ...config.defaults.composables,
          ...options.composables,
        },
        directives: {
          ...config.defaults.directives,
          ...options.directives,
        },
        agents: typeof options.agents === 'object'
          ? {
              ...config.defaults.agents,
              ...options.agents,
            }
          : options.agents ?? config.defaults.agents,
      }
      config.setup(mergedOptions, nuxt)
      return { nuxt }
    }

    it('should add transpile packages', () => {
      const { nuxt } = callSetup()
      expect(nuxt.options.build.transpile).toContain('maz-ui')
      expect(nuxt.options.build.transpile).toContain('@maz-ui/themes')
      expect(nuxt.options.build.transpile).toContain('@maz-ui/translations')
    })

    it('should set runtimeConfig public mazUi', () => {
      const { nuxt } = callSetup()
      expect(nuxt.options.runtimeConfig.public.mazUi).toBeDefined()
    })

    describe('given translations messages', () => {
      describe('when the module is set up', () => {
        it('then they are rendered in the template instead of the runtime config', async () => {
          const { nuxt } = callSetup({
            translations: {
              locale: 'fr',
              messages: {
                fr: '~/locales/fr.ts',
                de: { greeting: 'Hallo' },
              },
            },
          })

          expect((nuxt.options.runtimeConfig.public.mazUi as any).translations).toEqual({ locale: 'fr' })
          const template = getTemplate('maz-ui-translations.mjs')
          expect(template.filename).toBe('maz-ui-translations.mjs')
          expect(await template.getContents()).toBe('export default {\n  "fr": () => import("/project/locales/fr.ts"),\n  "de": {"greeting":"Hallo"},\n}\n')
        })
      })

      describe('when a locale is a function', () => {
        it('then it is skipped with a warning', async () => {
          callSetup({
            translations: {
              messages: {
                fr: () => ({}),
              },
            },
          })

          expect(await getTemplate('maz-ui-translations.mjs').getContents()).toBe('export default {\n\n}\n')
          expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('translations.messages.fr is a function'))
        })
      })
    })

    describe('given no translations config', () => {
      describe('when the module is set up', () => {
        it('then the template exports no messages', async () => {
          callSetup({ translations: undefined })

          expect(await getTemplate('maz-ui-translations.mjs').getContents()).toBe('export default {\n\n}\n')
        })
      })
    })

    describe('css', () => {
      it('should inject main CSS when injectCss is true', () => {
        const { nuxt } = callSetup({
          css: { injectCss: true },
        })
        expect(nuxt.options.css).toContain('maz-ui/style.css')
      })

      it('should not inject main CSS when injectCss is false', () => {
        const { nuxt } = callSetup({
          css: { injectCss: false },
        })
        expect(nuxt.options.css).not.toContain('maz-ui/style.css')
      })

      describe('given the icons option', () => {
        describe('when it is not set', () => {
          it('then the icons plugin reads the icons folder of the app, without writing types', () => {
            callSetup()

            expect(MazUiIcons).toHaveBeenCalledWith({ dir: '/project/app/icons', dts: false })
            expect(addVitePlugin).toHaveBeenCalledWith({
              name: 'maz-ui:icons',
              options: { dir: '/project/app/icons', dts: false },
            })
          })

          it('then the types of the names are a type template', () => {
            callSetup()

            const template = addTypeTemplate.mock.calls[0]![0] as { filename: string, getContents: () => string }
            expect(template.filename).toBe('types/maz-icons.d.ts')
            expect(template.getContents()).toBe('types of x-mark, app:hero {"module":"maz-ui"}')
            expect(loadIconNames).toHaveBeenCalledWith({ root: '/project', dir: '/project/app/icons', prefix: undefined })
          })
        })

        describe('when it sets a folder, a prefix and the strict mode', () => {
          it('then the plugin and the types use them', () => {
            callSetup({
              icons: {
                dir: 'assets/svg',
                prefix: 'app',
                strict: true,
                safelist: ['home'],
              },
            })

            expect(MazUiIcons).toHaveBeenCalledWith({
              dir: '/project/assets/svg',
              prefix: 'app',
              strict: true,
              safelist: ['home'],
              dts: false,
            })
            const template = addTypeTemplate.mock.calls[0]![0] as { getContents: () => string }
            template.getContents()
            expect(loadIconNames).toHaveBeenCalledWith({ root: '/project', dir: '/project/assets/svg', prefix: 'app' })
            expect(generateIconTypes).toHaveBeenCalledWith(['x-mark', 'app:hero'], {
              strict: true,
              module: 'maz-ui',
            })
          })
        })

        describe('when it sets several folders without the icons of maz-ui', () => {
          it('then each folder is resolved from the root, and the types only have the icons of the folders', () => {
            callSetup({
              icons: {
                dir: [
                  'assets/svg',
                  { path: 'node_modules/@acme/icons/svg', prefix: 'acme', svgo: false },
                ],
                defaultIcons: false,
              },
            })

            const dir = [
              '/project/assets/svg',
              { path: '/project/node_modules/@acme/icons/svg', prefix: 'acme', svgo: false },
            ]
            expect(MazUiIcons).toHaveBeenCalledWith({ dir, defaultIcons: false, dts: false })
            const template = addTypeTemplate.mock.calls[0]![0] as { getContents: () => string }
            template.getContents()
            expect(loadIconNames).toHaveBeenCalledWith({
              root: '/project',
              dir,
              prefix: undefined,
              defaultIcons: false,
            })
          })
        })

        describe('when the project resolves @maz-ui/icons', () => {
          it('then the types augment @maz-ui/icons, whose names maz-ui includes', () => {
            resolveIconTypesModule.mockReturnValueOnce('@maz-ui/icons')
            callSetup({ icons: true })

            const template = addTypeTemplate.mock.calls[0]![0] as { getContents: () => string }
            template.getContents()
            expect(resolveIconTypesModule).toHaveBeenCalledWith('/project')
            expect(generateIconTypes).toHaveBeenCalledWith(['x-mark', 'app:hero'], {
              strict: undefined,
              module: '@maz-ui/icons',
            })
          })
        })

        describe('when it is false', () => {
          it('then neither the plugin nor the types are added', () => {
            callSetup({ icons: false })

            expect(MazUiIcons).not.toHaveBeenCalled()
            expect(addTypeTemplate).not.toHaveBeenCalled()
          })
        })

        describe('when a SVG is added to the icons folder', () => {
          it('then the types are generated again', async () => {
            const { nuxt } = callSetup()
            const [hookName, onWatch] = nuxt.hook.mock.calls[0]!

            await onWatch('add', 'icons/hero.svg')

            expect(hookName).toBe('builder:watch')
            expect(updateTemplates).toHaveBeenCalledTimes(1)
            const { filter } = updateTemplates.mock.calls[0]![0] as { filter: (template: { filename: string }) => boolean }
            expect(filter({ filename: 'types/maz-icons.d.ts' })).toBe(true)
            expect(filter({ filename: 'types/other.d.ts' })).toBe(false)
          })
        })

        describe('when a SVG is added to one of several icons folders', () => {
          it('then the types are written again', async () => {
            const { nuxt } = callSetup({
              icons: {
                dir: [
                  'app/icons',
                  { path: 'app/brand', prefix: 'brand' },
                ],
              },
            })
            const onWatch = nuxt.hook.mock.calls[0]![1]

            await onWatch('add', 'brand/logo.svg')

            expect(updateTemplates).toHaveBeenCalledTimes(1)
          })
        })

        describe('when a SVG of the icons folder changes, or another file is added', () => {
          it('then the types are kept', async () => {
            const { nuxt } = callSetup()
            const onWatch = nuxt.hook.mock.calls[0]![1]

            await onWatch('change', 'icons/hero.svg')
            await onWatch('add', 'pages/index.vue')
            await onWatch('unlink', 'assets/hero.svg')

            expect(updateTemplates).not.toHaveBeenCalled()
          })
        })
      })

      describe('given the icons pre-bundling', () => {
        describe('when the vite config has no optimizeDeps', () => {
          it('then @maz-ui/icons is excluded from the pre-bundling', () => {
            const { nuxt } = callSetup()

            expect(nuxt.options.vite.optimizeDeps.exclude).toEqual(['@maz-ui/icons'])
          })
        })

        describe('when the vite config already excludes other dependencies', () => {
          it('then @maz-ui/icons is added to them', () => {
            const { nuxt } = callSetup({}, {}, {
              vite: {
                optimizeDeps: {
                  exclude: ['onnxruntime-web'],
                },
              },
            })

            expect(nuxt.options.vite.optimizeDeps.exclude).toEqual(['onnxruntime-web', '@maz-ui/icons'])
          })
        })

        describe('when the vite config already excludes @maz-ui/icons', () => {
          it('then it is not added twice', () => {
            const { nuxt } = callSetup({}, {}, {
              vite: {
                optimizeDeps: {
                  exclude: ['@maz-ui/icons'],
                },
              },
            })

            expect(nuxt.options.vite.optimizeDeps.exclude).toEqual(['@maz-ui/icons'])
          })
        })

        describe('when the vite config includes @maz-ui/icons', () => {
          it('then the choice of the user is kept', () => {
            const { nuxt } = callSetup({}, {}, {
              vite: {
                optimizeDeps: {
                  include: ['@maz-ui/icons'],
                },
              },
            })

            expect(nuxt.options.vite.optimizeDeps.exclude).toBeUndefined()
          })
        })
      })

      describe('given the utilities option', () => {
        describe('when injectUtilities is enabled', () => {
          it('then maz-ui/utilities.css is injected after maz-ui/style.css', () => {
            const { nuxt } = callSetup({
              css: { injectUtilities: true },
            })

            expect(nuxt.options.css).toEqual(['maz-ui/style.css', 'maz-ui/utilities.css'])
          })
        })

        describe('when injectUtilities keeps its default', () => {
          it('then maz-ui/utilities.css is not injected', () => {
            const { nuxt } = callSetup()

            expect(nuxt.options.css).not.toContain('maz-ui/utilities.css')
          })
        })
      })

      describe('given the purge option', () => {
        describe('when the app is built with the defaults', () => {
          it('then the purge plugin is added with the entries of the enabled plugins and directives', () => {
            callSetup({
              plugins: { toast: true, dialog: false },
              directives: { vTooltip: true },
            })

            expect(MazUiPurgeCss).toHaveBeenCalledWith({
              entries: ['plugins/toast', 'directives/vTooltip'],
            })
            expect(addVitePlugin).toHaveBeenCalledWith({
              name: 'maz-ui:purge-css',
              options: {
                entries: ['plugins/toast', 'directives/vTooltip'],
              },
            })
          })
        })

        describe('when purge is an object', () => {
          it('then its options are passed and its entries are merged', () => {
            callSetup({
              css: {
                purge: {
                  // maz-ui-review-ignore internal-prefix -- the purge safelist holds the classes of maz-ui
                  safelist: ['maz:p-2'],
                  entries: ['MazBtn'],
                },
              },
              plugins: { wait: true },
            })

            expect(MazUiPurgeCss).toHaveBeenCalledWith({
              // maz-ui-review-ignore internal-prefix -- the purge safelist holds the classes of maz-ui
              safelist: ['maz:p-2'],
              entries: ['plugins/wait', 'MazBtn'],
            })
          })
        })

        describe('when aos is enabled', () => {
          it('then the aos plugin is an entry of the purge', () => {
            callSetup({
              aos: true,
            })

            expect(MazUiPurgeCss).toHaveBeenCalledWith({
              entries: ['plugins/aos'],
            })
          })
        })

        describe('when purge is false', () => {
          it('then the purge plugin is not added', () => {
            callSetup({
              css: { purge: false },
            })

            expect(MazUiPurgeCss).not.toHaveBeenCalled()
          })
        })

        describe('when the app runs in dev', () => {
          it('then the purge plugin is not added', () => {
            callSetup({}, {}, { dev: true })

            expect(MazUiPurgeCss).not.toHaveBeenCalled()
          })
        })
      })

      describe('given the theme presets', () => {
        function getManifestHook(nuxt: { hook: ReturnType<typeof vi.fn> }) {
          const call = nuxt.hook.mock.calls.find(([name]) => name === 'build:manifest')

          return call?.[1] as (manifest: Record<string, { src?: string, prefetch?: boolean }>) => void
        }

        describe('when the client manifest is built', () => {
          it('then the chunks of the presets are not prefetched', () => {
            const { nuxt } = callSetup()
            const manifest: Record<string, { src?: string, prefetch?: boolean }> = {
              'node_modules/@maz-ui/themes/dist/presets/ocean.js': { src: 'node_modules/@maz-ui/themes/dist/presets/ocean.js', prefetch: true },
              '../../packages/themes/src/presets/nova.ts': { prefetch: true },
              'pages/index.vue': { src: 'pages/index.vue', prefetch: true },
            }

            getManifestHook(nuxt)(manifest)

            expect(manifest['node_modules/@maz-ui/themes/dist/presets/ocean.js']!.prefetch).toBe(false)
            expect(manifest['../../packages/themes/src/presets/nova.ts']!.prefetch).toBe(false)
            expect(manifest['pages/index.vue']!.prefetch).toBe(true)
          })
        })

        describe('when theme.presets is not set', () => {
          it('then every preset stays in the build', () => {
            callSetup()

            expect(MazUiThemePresets).not.toHaveBeenCalled()
          })
        })

        describe('when theme.presets is set with a named preset', () => {
          it('then the presets plugin keeps them with the configured preset', () => {
            const { nuxt } = callSetup({
              theme: {
                preset: 'nova',
                presets: ['ocean'],
              },
            })

            expect(MazUiThemePresets).toHaveBeenCalledWith({
              presets: ['ocean', 'nova'],
            })
            expect(addVitePlugin).toHaveBeenCalledWith({
              name: 'maz-ui:theme-presets',
              options: {
                presets: ['ocean', 'nova'],
              },
            })
            expect((nuxt.options.runtimeConfig.public.mazUi as any).theme).toEqual({ preset: 'nova' })
          })
        })

        describe('when theme.presets is empty with a preset object', () => {
          it('then the presets plugin keeps no preset', () => {
            callSetup({
              theme: {
                preset: { name: 'brand' },
                presets: [],
              },
            })

            expect(MazUiThemePresets).toHaveBeenCalledWith({ presets: [] })
          })
        })

        describe('when the theme is not configured', () => {
          it('then the runtime config has an empty theme', () => {
            const { nuxt } = callSetup({ theme: undefined })

            expect((nuxt.options.runtimeConfig.public.mazUi as any).theme).toEqual({})
          })
        })
      })

      it('should disable cssnano calc optimization', () => {
        const { nuxt } = callSetup()
        expect(nuxt.options.postcss.plugins.cssnano).toEqual({
          preset: [
            'default',
            { calc: false },
          ],
        })
      })

      it('should preserve existing cssnano options when disabling calc', () => {
        const { nuxt } = callSetup({}, {
          options: {
            ...createNuxtMock().options,
            postcss: {
              plugins: {
                cssnano: { comments: false },
              },
              order: [],
            },
          },
        })
        expect(nuxt.options.postcss.plugins.cssnano).toEqual({
          comments: false,
          preset: [
            'default',
            { calc: false },
          ],
        })
      })

      it('should not touch cssnano when it is explicitly disabled', () => {
        const { nuxt } = callSetup({}, {
          options: {
            ...createNuxtMock().options,
            postcss: {
              plugins: { cssnano: false },
              order: [],
            },
          },
        })
        expect(nuxt.options.postcss.plugins.cssnano).toBe(false)
      })

      it('should initialize postcss options when absent', () => {
        const { nuxt } = callSetup({ icons: false }, {
          options: {
            build: { transpile: [] },
            runtimeConfig: {
              public: { mazUi: {} },
            },
            css: [],
          },
        })
        expect(nuxt.options.postcss.plugins.cssnano).toEqual({
          preset: [
            'default',
            { calc: false },
          ],
        })
      })
    })

    describe('plugins', () => {
      it.each([
        'runtime/plugins/maz-ui',
        'runtime/plugins/maz-link-component',
      ])('always adds %s plugin', (pluginPath) => {
        callSetup()
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining(pluginPath),
        )
      })

      it('gives the defaults to the runtime config of the maz-ui plugin', () => {
        const { nuxt } = callSetup({
          defaults: {
            global: { roundedSize: 'lg' },
          },
        })
        expect((nuxt.options.runtimeConfig.public.mazUi as any).defaults).toEqual({
          global: { roundedSize: 'lg' },
        })
      })

      it('gives the toast and dialog options to the runtime config of the maz-ui plugin', () => {
        const { nuxt } = callSetup({
          toast: { position: 'top-right' },
          dialog: { acceptText: 'Yes' },
        })
        expect((nuxt.options.runtimeConfig.public.mazUi as any).toast).toEqual({ position: 'top-right' })
        expect((nuxt.options.runtimeConfig.public.mazUi as any).dialog).toEqual({ acceptText: 'Yes' })
      })

      it.each(['useToast', 'useDialog', 'useWait'])('always auto-imports %s from maz-ui', (name) => {
        callSetup()
        expect(addImports).toHaveBeenCalledWith({
          name,
          from: `maz-ui/composables/${name}`,
          as: name,
        })
      })

      it('adds no plugin of the deprecated plugins option by default', () => {
        callSetup()
        const legacyCalls = addPlugin.mock.calls.filter(
          ([path]) => /runtime\/plugins\/(?:toast|dialog|wait|aos)$/.test(path),
        )
        expect(legacyCalls).toHaveLength(0)
        expect(logger.warn).not.toHaveBeenCalledWith(expect.stringContaining('mazUi.plugins'))
      })

      it('should add useAos import from maz-ui when aos is enabled', () => {
        callSetup({
          aos: true,
        })
        expect(addImports).toHaveBeenCalledWith({
          name: 'useAos',
          from: 'maz-ui/composables/useAos',
          as: 'useAos',
        })
      })

      it('should not add useAos import when aos is disabled', () => {
        callSetup()
        expect(addImports).not.toHaveBeenCalledWith(
          expect.objectContaining({ name: 'useAos' }),
        )
      })

      it('should inject AOS CSS by default when aos is enabled', () => {
        const { nuxt } = callSetup({
          aos: true,
        })
        expect(nuxt.options.css).toContain('maz-ui/aos.css')
      })

      it('should not inject AOS CSS when injectCss is false', () => {
        const { nuxt } = callSetup({
          aos: { injectCss: false },
        })
        expect(nuxt.options.css).not.toContain('maz-ui/aos.css')
      })

      it('should inject AOS CSS when aos is object without injectCss', () => {
        const { nuxt } = callSetup({
          aos: { delay: 100 },
        })
        expect(nuxt.options.css).toContain('maz-ui/aos.css')
      })

      describe('given the deprecated plugins option', () => {
        it('warns once with a link to the docs', () => {
          callSetup({
            plugins: { toast: true, wait: true },
          })
          expect(logger.warn).toHaveBeenCalledOnce()
          expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('https://maz-ui.com/ecosystem/nuxt#toast-dialog-and-wait'))
        })

        it.each(['toast', 'dialog', 'wait'])('adds the %s plugin that provides its $maz property', (plugin) => {
          callSetup({
            plugins: { [plugin]: true },
          })
          expect(addPlugin).toHaveBeenCalledWith(
            expect.stringContaining(`runtime/plugins/${plugin}`),
          )
        })

        it('gives the toast and dialog options of the plugins to the new options', () => {
          const { nuxt } = callSetup({
            toast: { timeout: 1000 },
            plugins: {
              toast: { position: 'top-right', timeout: 5000 },
              dialog: { acceptText: 'Yes' },
            },
          })
          expect((nuxt.options.runtimeConfig.public.mazUi as any).toast).toEqual({ position: 'top-right', timeout: 1000 })
          expect((nuxt.options.runtimeConfig.public.mazUi as any).dialog).toEqual({ acceptText: 'Yes' })
        })

        it('enables aos with the options of plugins.aos', () => {
          const { nuxt } = callSetup({
            plugins: { aos: { delay: 100, router: true } },
          })
          expect((nuxt.options.runtimeConfig.public.mazUi as any).aos).toEqual({ delay: 100, router: true })
          expect(nuxt.options.css).toContain('maz-ui/aos.css')
          expect(addImports).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'useAos' }),
          )
        })

        it('keeps the aos option over plugins.aos', () => {
          const { nuxt } = callSetup({
            aos: { delay: 300 },
            plugins: { aos: { delay: 100 } },
          })
          expect((nuxt.options.runtimeConfig.public.mazUi as any).aos).toEqual({ delay: 300 })
        })
      })
    })

    describe('components', () => {
      it('should register all components when autoImport is true', () => {
        callSetup({
          components: { autoImport: true },
        })
        const componentCalls = addComponent.mock.calls
        expect(componentCalls.length).toBeGreaterThanOrEqual(60)
        expect(addComponent).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'MazBtn' }),
        )
        expect(addComponent).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'MazInput' }),
        )
      })

      it('registers the components of maz-ui/exports.json, not the other exports of the barrel', () => {
        callSetup({
          components: { autoImport: true },
        })
        const names = addComponent.mock.calls.map(([component]) => component.name)

        expect(names).toContain('MazPagination')
        expect(names).not.toContain('mazListKey')
        expect(names).not.toContain('useMazDialogConfirm')
        expect(names.every(name => /^Maz[A-Z]/.test(name))).toBe(true)
      })

      it('should set correct filePath for components', () => {
        callSetup({
          components: { autoImport: true },
        })
        expect(addComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'MazBtn',
            filePath: 'maz-ui/components/MazBtn',
          }),
        )
      })

      it('registers MazIconPrimitive of @maz-ui/icons/vue', () => {
        callSetup({
          components: { autoImport: true },
        })

        expect(addComponent).toHaveBeenCalledWith({
          name: 'MazIconPrimitive',
          export: 'MazIconPrimitive',
          filePath: '@maz-ui/icons/vue',
        })
      })

      it('resolves @maz-ui/icons/vue from the maz-ui of the module', () => {
        const defaultCreateRequire = createRequire.getMockImplementation()!
        createRequire.mockImplementation((from: string) => Object.assign(
          (id: string): unknown => process.getBuiltinModule('node:module').createRequire(from)(id),
          {
            resolve: (id: string) => (id === 'maz-ui/package.json'
              ? '/module/node_modules/maz-ui/package.json'
              : `${from.replace('/package.json', '')}/node_modules/${id}.js`),
          },
        ))

        callSetup({
          components: { autoImport: true },
        })

        expect(addComponent).toHaveBeenCalledWith(expect.objectContaining({
          name: 'MazIconPrimitive',
          filePath: '/module/node_modules/maz-ui/node_modules/@maz-ui/icons/vue.js',
        }))
        createRequire.mockImplementation(defaultCreateRequire)
      })

      it('should not register components when autoImport is false', () => {
        callSetup({
          components: { autoImport: false },
        })
        expect(addComponent).not.toHaveBeenCalled()
      })
    })

    describe('directives', () => {
      it('should add v-zoom-img plugin when enabled', () => {
        callSetup({
          directives: { vZoomImg: true },
        })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-zoom-img'),
        )
      })

      it('should add v-lazy-img plugin when enabled', () => {
        callSetup({
          directives: { vLazyImg: true },
        })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-lazy-img'),
        )
      })

      it('should add v-click-outside plugin when enabled', () => {
        callSetup({
          directives: { vClickOutside: true },
        })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-click-outside'),
        )
      })

      it('should add v-fullscreen-img plugin when enabled', () => {
        callSetup({
          directives: { vFullscreenImg: true },
        })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-fullscreen-img'),
        )
      })

      it('should add v-intersect plugin when enabled', () => {
        callSetup({
          directives: { vIntersect: true },
        })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-intersect'),
        )
      })

      it('should add v-tooltip plugin when enabled', () => {
        callSetup({
          directives: { vTooltip: true },
        })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-tooltip'),
        )
      })

      it('should not add directive plugins when disabled', () => {
        callSetup({
          directives: {
            vZoomImg: false,
            vLazyImg: false,
            vClickOutside: false,
            vFullscreenImg: false,
            vIntersect: false,
            vTooltip: false,
          },
        })
        const directiveCalls = addPlugin.mock.calls.filter(
          ([path]) => path.includes('v-'),
        )
        expect(directiveCalls).toHaveLength(0)
      })
    })

    describe('composables', () => {
      it('should register maz-ui composables', () => {
        callSetup()
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useIdleTimeout',
            from: 'maz-ui/composables/useIdleTimeout',
          }),
        )
      })

      it('should register useTheme when enabled', () => {
        callSetup({
          composables: { useTheme: true },
        })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useTheme',
            from: '@maz-ui/themes',
            as: 'useTheme',
          }),
        )
      })

      it('should register useTranslations when enabled', () => {
        callSetup({
          composables: { useTranslations: true },
        })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useTranslations',
            from: '@maz-ui/translations',
            as: 'useTranslations',
          }),
        )
      })

      it('should not register useTheme when disabled', () => {
        callSetup({
          composables: { useTheme: false },
        })
        expect(addImports).not.toHaveBeenCalledWith(
          expect.objectContaining({ name: 'useTheme', from: '@maz-ui/themes' }),
        )
      })

      it('should not register useTranslations when disabled', () => {
        callSetup({
          composables: { useTranslations: false },
        })
        expect(addImports).not.toHaveBeenCalledWith(
          expect.objectContaining({ name: 'useTranslations', from: '@maz-ui/translations' }),
        )
      })

      it('does not register a maz-ui composable disabled in the options', () => {
        callSetup({
          composables: { useToast: false },
        })
        expect(addImports).not.toHaveBeenCalledWith(
          expect.objectContaining({ name: 'useToast' }),
        )
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'useDialog', from: 'maz-ui/composables/useDialog' }),
        )
      })

      it('should apply autoImportPrefix to composable names', () => {
        callSetup({
          general: { autoImportPrefix: 'Maz' },
        })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useIdleTimeout',
            as: 'useMazIdleTimeout',
          }),
        )
      })

      it('should apply autoImportPrefix to useTheme', () => {
        callSetup({
          general: { autoImportPrefix: 'Maz' },
          composables: { useTheme: true },
        })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useTheme',
            as: 'useMazTheme',
          }),
        )
      })

      it('should apply autoImportPrefix to useTranslations', () => {
        callSetup({
          general: { autoImportPrefix: 'Maz' },
          composables: { useTranslations: true },
        })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useTranslations',
            as: 'useMazTranslations',
          }),
        )
      })

      it('should apply autoImportPrefix to plugin composables', () => {
        callSetup({
          general: { autoImportPrefix: 'Maz' },
          plugins: {
            aos: true,
            toast: true,
            dialog: true,
            wait: true,
          },
        })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useAos',
            as: 'useMazAos',
          }),
        )
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useToast',
            as: 'useMazToast',
          }),
        )
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useDialog',
            as: 'useMazDialog',
          }),
        )
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useWait',
            as: 'useMazWait',
          }),
        )
      })
    })

    describe('icon path', () => {
      it('should add maz-icon-path plugin when defaultMazIconPath is set', () => {
        callSetup({
          general: { defaultMazIconPath: '/icons' },
        })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('maz-icon-path'),
        )
      })

      it('should not add maz-icon-path plugin when defaultMazIconPath is empty', () => {
        callSetup({
          general: { defaultMazIconPath: '' },
        })
        const iconCalls = addPlugin.mock.calls.filter(
          ([path]) => path.includes('maz-icon-path'),
        )
        expect(iconCalls).toHaveLength(0)
      })
    })

    describe('given the preventIosInputZoom option', () => {
      describe('when it is enabled', () => {
        it('then the client plugin is added', () => {
          callSetup({
            general: { preventIosInputZoom: true },
          })

          expect(addPlugin).toHaveBeenCalledWith(expect.stringContaining('runtime/plugins/prevent-ios-input-zoom.client'))
        })
      })

      describe('when it is not set', () => {
        it('then the client plugin is not added', () => {
          callSetup()

          expect(addPlugin).not.toHaveBeenCalledWith(expect.stringContaining('prevent-ios-input-zoom'))
        })
      })
    })

    describe('given the flags option', () => {
      describe('when it is not set', () => {
        it('then the flags template exports no loader and no flag source is set', async () => {
          const { nuxt } = callSetup()

          expect(config.defaults.flags).toBe('cdn')
          expect(await getTemplate('maz-ui-flags.mjs').getContents()).toBe('export default undefined\n')
          expect((nuxt.options.runtimeConfig.public.mazUi as any).defaults.global?.flagSrc).toBeUndefined()
        })
      })

      describe('when it is local', () => {
        it('then the flags template exports the loader of the local flags', async () => {
          callSetup({
            flags: 'local',
            defaults: {
              global: { size: 'lg' },
            },
          })

          expect(await getTemplate('maz-ui-flags.mjs').getContents()).toMatch(/^export \{ loadCountryFlag as default \} from ".*runtime\/utils\/local-flags"\n$/)
        })
      })

      describe('when it is a URL template', () => {
        it('then the template becomes the global flag source', async () => {
          const { nuxt } = callSetup({
            flags: '/flags/{code}.svg',
            defaults: {
              global: { size: 'lg' },
            },
          })

          expect((nuxt.options.runtimeConfig.public.mazUi as any).defaults.global).toEqual({ flagSrc: '/flags/{code}.svg', size: 'lg' })
          expect(await getTemplate('maz-ui-flags.mjs').getContents()).toBe('export default undefined\n')
        })
      })

      describe('when a global flag source is also set in defaults', () => {
        it('then the defaults value wins over the template', () => {
          const { nuxt } = callSetup({
            flags: '/flags/{code}.svg',
            defaults: {
              global: { flagSrc: '/mine/{CODE}.png' },
            },
          })

          expect((nuxt.options.runtimeConfig.public.mazUi as any).defaults.global.flagSrc).toBe('/mine/{CODE}.png')
        })
      })
    })

    describe('given the agents option', () => {
      beforeEach(() => {
        vi.stubEnv('CI', '')
      })

      afterEach(() => {
        vi.unstubAllEnvs()
      })

      describe('when it is not set', () => {
        it('then the agents are not configured', () => {
          callSetup({}, {}, { dev: true })

          expect(config.defaults.agents).toEqual({ rules: false, mcp: false })
          expect(setupAgents).not.toHaveBeenCalled()
        })
      })

      describe('when only the MCP server is enabled', () => {
        it('then only the MCP server of the detected agents is configured', () => {
          callSetup({
            agents: { mcp: true },
          }, {}, { dev: true })

          expect(setupAgents).toHaveBeenCalledWith({
            rootDir: '/project',
            appDir: '/project',
            rules: false,
            mcp: true,
          })
        })
      })

      describe('when it is disabled', () => {
        it('then the agents are not configured', () => {
          callSetup({ agents: false }, {}, { dev: true })

          expect(setupAgents).not.toHaveBeenCalled()
        })
      })

      describe('when it is enabled in development', () => {
        it('then the rules and the MCP server of the agents are configured from the root directory', () => {
          callSetup({ agents: true }, {}, { dev: true })

          expect(setupAgents).toHaveBeenCalledWith({
            rootDir: '/project',
            appDir: '/project',
            rules: true,
            mcp: true,
          })
        })
      })

      describe('when it is enabled during nuxt prepare', () => {
        it('then the agents are configured', () => {
          callSetup({ agents: true }, {}, { _prepare: true })

          expect(setupAgents).toHaveBeenCalled()
        })
      })

      describe('when targets, rules and mcp are given', () => {
        it('then they are passed through', () => {
          callSetup({
            agents: {
              targets: ['cursor', 'agents-md'],
              rules: true,
              mcp: false,
            },
          }, {}, { dev: true })

          expect(setupAgents).toHaveBeenCalledWith({
            rootDir: '/project',
            appDir: '/project',
            targets: ['cursor', 'agents-md'],
            rules: true,
            mcp: false,
          })
        })
      })

      describe('when the app is part of a monorepo', () => {
        it('then the files are written at the workspace root with the maz-ui of the app', () => {
          callSetup({
            agents: { rules: false, mcp: true },
          }, {}, { dev: true, rootDir: '/repo/apps/web', workspaceDir: '/repo' })

          expect(setupAgents).toHaveBeenCalledWith(expect.objectContaining({ rootDir: '/repo', appDir: '/repo/apps/web' }))
        })
      })

      describe('when a dir is given', () => {
        it('then the files are written in this folder, relative to the Nuxt root', () => {
          callSetup({
            agents: { mcp: true, dir: '../..' },
          }, {}, { dev: true, rootDir: '/repo/apps/web', workspaceDir: '/repo/apps/web' })

          expect(setupAgents).toHaveBeenCalledWith(expect.objectContaining({ rootDir: '/repo' }))
        })
      })

      describe('when both rules and mcp are disabled', () => {
        it('then the agents are not configured', () => {
          callSetup({
            agents: { rules: false, mcp: false },
          }, {}, { dev: true })

          expect(setupAgents).not.toHaveBeenCalled()
        })
      })

      describe('when it is not development', () => {
        it('then the agents are not configured', () => {
          callSetup({ agents: true })

          expect(setupAgents).not.toHaveBeenCalled()
        })
      })

      describe('when running in CI', () => {
        it('then the agents are not configured', () => {
          vi.stubEnv('CI', 'true')

          callSetup({ agents: true }, {}, { dev: true })

          expect(setupAgents).not.toHaveBeenCalled()
        })
      })

      describe('when running in test mode', () => {
        it('then the agents are not configured', () => {
          callSetup({ agents: true }, {}, { dev: true, test: true })

          expect(setupAgents).not.toHaveBeenCalled()
        })
      })

      describe('when files are created, updated or removed', () => {
        it('then they are logged once', () => {
          setupAgents.mockReturnValueOnce({
            targets: ['claude'],
            version: '5.0.0',
            changes: [
              { file: '.claude/rules/maz-ui.md', action: 'create' },
              { file: '.mcp.json', action: 'update' },
              { file: 'AGENTS.md', action: 'unchanged' },
            ],
            localMcpServer: true,
          })

          callSetup({ agents: true }, {}, { dev: true })

          expect(useLogger).toHaveBeenCalledWith('@maz-ui/mcp')
          expect(logger.info).toHaveBeenCalledTimes(1)
          expect(logger.info).toHaveBeenCalledWith(expect.stringMatching(/^AI agents configured for maz-ui: \.claude\/rules\/maz-ui\.md \(create\), \.mcp\.json \(update\)\./))
        })
      })

      describe('when the rules are written and no agent reading AGENTS.md is detected', () => {
        it('then the log explains how to also write AGENTS.md', () => {
          setupAgents.mockReturnValueOnce({
            targets: ['claude'],
            version: '5.0.0',
            changes: [
              { file: '.mcp.json', action: 'create' },
            ],
            localMcpServer: true,
          })

          callSetup({ agents: true }, {}, { dev: true })

          expect(logger.info).toHaveBeenCalledWith('AI agents configured for maz-ui: .mcp.json (create). AGENTS.md not written: no agent that reads it was detected (Cursor, Copilot, Codex, Windsurf, Gemini CLI, Zed...). If your team uses one, set mazUi.agents.targets: [\'claude\', \'agents-md\'].')
        })
      })

      describe('when only the MCP server is configured', () => {
        it('then the log does not mention AGENTS.md', () => {
          setupAgents.mockReturnValueOnce({
            targets: ['claude'],
            version: '5.0.0',
            changes: [
              { file: '.mcp.json', action: 'create' },
            ],
            localMcpServer: true,
          })

          callSetup({
            agents: { rules: false, mcp: true },
          }, {}, { dev: true })

          expect(logger.info).toHaveBeenCalledWith('AI agents configured for maz-ui: .mcp.json (create).')
        })
      })

      describe('when the MCP server runs through npx', () => {
        it('then the log suggests installing @maz-ui/mcp', () => {
          setupAgents.mockReturnValueOnce({
            targets: ['claude'],
            version: '5.0.0',
            changes: [
              { file: '.mcp.json', action: 'create' },
            ],
            localMcpServer: false,
          })

          callSetup({
            agents: { rules: false, mcp: true },
          }, {}, { dev: true })

          expect(logger.info).toHaveBeenCalledWith('AI agents configured for maz-ui: .mcp.json (create). The MCP server runs through npx: add @maz-ui/mcp to the devDependencies of the project root to start it in about a second, at the version of your lockfile.')
        })
      })

      describe('when the targets are given', () => {
        it('then the log does not mention AGENTS.md', () => {
          setupAgents.mockReturnValueOnce({
            targets: ['claude'],
            version: '5.0.0',
            changes: [
              { file: '.mcp.json', action: 'create' },
            ],
            localMcpServer: true,
          })

          callSetup({
            agents: {
              targets: ['claude'],
              rules: true,
            },
          }, {}, { dev: true })

          expect(logger.info).toHaveBeenCalledWith('AI agents configured for maz-ui: .mcp.json (create).')
        })
      })

      describe('when everything is up to date', () => {
        it('then nothing is logged', () => {
          setupAgents.mockReturnValueOnce({
            targets: ['claude'],
            version: '5.0.0',
            changes: [
              { file: '.mcp.json', action: 'unchanged' },
            ],
            localMcpServer: true,
          })

          callSetup({ agents: true }, {}, { dev: true })

          expect(logger.info).not.toHaveBeenCalled()
        })
      })

      describe('when the configuration fails', () => {
        it('then a warning is logged and the setup continues', () => {
          setupAgents.mockImplementationOnce(() => {
            throw new Error('maz-ui is not installed')
          })

          callSetup({ agents: true }, {}, { dev: true })

          expect(logger.warn).toHaveBeenCalledWith('Could not configure the AI agents for maz-ui: maz-ui is not installed')
          expect(addPlugin).toHaveBeenCalledWith(expect.stringContaining('runtime/plugins/maz-ui'))
        })
      })

      describe('when the runtime config is built', () => {
        it('then it does not expose the agents option', () => {
          const { nuxt } = callSetup({ agents: true })

          expect(nuxt.options.runtimeConfig.public.mazUi).not.toHaveProperty('agents')
        })
      })
    })

    describe('given the maz-ui of the app and the maz-ui of the module', () => {
      function resolveMazUi({ app, module }: { app?: string, module?: string }) {
        createRequire.mockImplementation((from: string) => Object.assign(
          (id: string): unknown => process.getBuiltinModule('node:module').createRequire(from)(id),
          {
            resolve: () => {
              const version = from === '/project/package.json'
                ? app
                : module

              if (!version)
                throw new Error('Cannot find module \'maz-ui/package.json\'')

              return `/${version}/node_modules/maz-ui/package.json`
            },
          },
        ))
        readPackageVersion.mockImplementation((dir?: string) => dir?.split('/')[1])
      }

      describe('when they have the same version', () => {
        it('then it does not warn', () => {
          resolveMazUi({ app: '5.2.0', module: '5.2.0' })

          callSetup()

          expect(logger.warn).not.toHaveBeenCalledWith(expect.stringContaining('two copies of maz-ui'))
        })
      })

      describe('when they have different versions', () => {
        it('then it warns that two copies of maz-ui are loaded', () => {
          resolveMazUi({ app: '5.1.0', module: '5.2.0' })

          callSetup()

          expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('The app installs maz-ui 5.1.0 and @maz-ui/nuxt uses maz-ui 5.2.0'))
        })
      })

      describe('when the app does not resolve maz-ui', () => {
        it('then it does not warn', () => {
          resolveMazUi({ module: '5.2.0' })

          callSetup()

          expect(logger.warn).not.toHaveBeenCalledWith(expect.stringContaining('two copies of maz-ui'))
        })
      })
    })

    describe('devtools', () => {
      it('should add devtools tab when devtools is true', () => {
        onDevtoolsReady.mockImplementation((fn: (ctx: any) => void) => fn({
          docks: { register },
        }))
        callSetup({
          general: { devtools: true },
        })
        expect(register).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'maz-ui',
            type: 'iframe',
            title: 'maz-ui',
            url: 'https://maz-ui.com',
          }),
        )
      })

      it('should not add devtools tab when devtools is false', () => {
        callSetup({
          general: { devtools: false },
        })
        expect(onDevtoolsReady).not.toHaveBeenCalled()
      })
    })
  })
})
