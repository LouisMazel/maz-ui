import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import moduleConfig from '../module'

const { addComponent, addPlugin, addImports, createResolver, defineNuxtModule, addCustomTab, useLogger, logger, setupAgents, detectAgentTargets } = vi.hoisted(() => {
  const logger = { info: vi.fn(), warn: vi.fn(), debug: vi.fn() }

  return {
    logger,
    useLogger: vi.fn(() => logger),
    setupAgents: vi.fn(() => ({ targets: [] as string[], version: '5.0.0', changes: [] as Array<{ file: string, action: string }> })),
    detectAgentTargets: vi.fn((): string[] => ['claude']),
    addComponent: vi.fn(),
    addPlugin: vi.fn(),
    addImports: vi.fn(),
    createResolver: vi.fn(() => ({
      resolve: (...args: string[]) => args.join('/'),
    })),
    defineNuxtModule: vi.fn((config: any) => config),
    addCustomTab: vi.fn(),
  }
})

vi.mock('@nuxt/kit', () => ({
  addComponent,
  addPlugin,
  addImports,
  createResolver,
  defineNuxtModule,
  useLogger,
}))

vi.mock('@maz-ui/node', () => ({
  setupAgents,
  detectAgentTargets,
}))

vi.mock('@nuxt/devtools-kit', () => ({
  addCustomTab,
}))

vi.mock('defu', () => ({
  defu: (...args: any[]) => Object.assign({}, ...args.reverse()),
}))

vi.mock('@maz-ui/utils/helpers/capitalize', () => ({
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
        vTooltip: false,
      })
    })

    it('should include all maz-ui composables in defaults', () => {
      const composables = config.defaults.composables
      expect(composables.useTheme).toBe(true)
      expect(composables.useTranslations).toBe(true)
      expect(composables.useIdleTimeout).toBe(true)
      expect(composables.useReadingTime).toBe(true)
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
    })
  })

  describe('setup', () => {
    function createNuxtMock(overrides: Record<string, any> = {}, nuxtOptions: Record<string, any> = {}) {
      return {
        options: {
          rootDir: '/project',
          dev: false,
          build: { transpile: [] },
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

    function callSetup(options: Record<string, any> = {}, nuxtOverrides: Record<string, any> = {}, nuxtOptions: Record<string, any> = {}) {
      const nuxt = createNuxtMock(nuxtOverrides, nuxtOptions)
      const mergedOptions = {
        ...config.defaults,
        ...options,
        general: { ...config.defaults.general, ...options.general },
        css: { ...config.defaults.css, ...options.css },
        components: { ...config.defaults.components, ...options.components },
        plugins: { ...config.defaults.plugins, ...options.plugins },
        composables: { ...config.defaults.composables, ...options.composables },
        directives: { ...config.defaults.directives, ...options.directives },
        agents: typeof options.agents === 'object' ? { ...config.defaults.agents, ...options.agents } : options.agents ?? config.defaults.agents,
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

    describe('css', () => {
      it('should inject main CSS when injectCss is true', () => {
        const { nuxt } = callSetup({ css: { injectCss: true } })
        expect(nuxt.options.css).toContain('maz-ui/style.css')
      })

      it('should not inject main CSS when injectCss is false', () => {
        const { nuxt } = callSetup({ css: { injectCss: false } })
        expect(nuxt.options.css).not.toContain('maz-ui/style.css')
      })

      it('should disable cssnano calc optimization', () => {
        const { nuxt } = callSetup()
        expect(nuxt.options.postcss.plugins.cssnano).toEqual({ preset: ['default', { calc: false }] })
      })

      it('should preserve existing cssnano options when disabling calc', () => {
        const { nuxt } = callSetup({}, { options: { ...createNuxtMock().options, postcss: { plugins: { cssnano: { comments: false } }, order: [] } } })
        expect(nuxt.options.postcss.plugins.cssnano).toEqual({ comments: false, preset: ['default', { calc: false }] })
      })

      it('should not touch cssnano when it is explicitly disabled', () => {
        const { nuxt } = callSetup({}, { options: { ...createNuxtMock().options, postcss: { plugins: { cssnano: false }, order: [] } } })
        expect(nuxt.options.postcss.plugins.cssnano).toBe(false)
      })

      it('should initialize postcss options when absent', () => {
        const { nuxt } = callSetup({}, { options: { build: { transpile: [] }, runtimeConfig: { public: { mazUi: {} } }, css: [] } })
        expect(nuxt.options.postcss.plugins.cssnano).toEqual({ preset: ['default', { calc: false }] })
      })
    })

    describe('plugins', () => {
      it.each([
        'runtime/plugins/theme',
        'runtime/plugins/translations',
        'runtime/plugins/maz-link-component',
      ])('always adds %s plugin', (pluginPath) => {
        callSetup()
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining(pluginPath),
        )
      })

      it('should add defaults plugin when defaults are set', () => {
        callSetup({ defaults: { global: { roundedSize: 'lg' } } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('runtime/plugins/defaults'),
        )
      })

      it('should not add defaults plugin when defaults are empty', () => {
        callSetup({ defaults: {} })
        expect(addPlugin).not.toHaveBeenCalledWith(
          expect.stringContaining('runtime/plugins/defaults'),
        )
      })

      it('should add aos plugin when aos is enabled', () => {
        callSetup({ plugins: { aos: true } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('runtime/plugins/aos'),
        )
      })

      it('should add useAos import when aos is enabled', () => {
        callSetup({ plugins: { aos: true } })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useAos',
            as: 'useAos',
          }),
        )
      })

      it('should inject AOS CSS by default when aos is enabled', () => {
        const { nuxt } = callSetup({ plugins: { aos: true } })
        expect(nuxt.options.css).toContain('maz-ui/aos.css')
      })

      it('should not inject AOS CSS when injectCss is false', () => {
        const { nuxt } = callSetup({ plugins: { aos: { injectCss: false } } })
        expect(nuxt.options.css).not.toContain('maz-ui/aos.css')
      })

      it('should inject AOS CSS when aos is object without injectCss', () => {
        const { nuxt } = callSetup({ plugins: { aos: { delay: 100 } } })
        expect(nuxt.options.css).toContain('maz-ui/aos.css')
      })

      it('should not add aos plugin when aos is disabled', () => {
        callSetup({ plugins: { aos: false } })
        const aosCalls = addPlugin.mock.calls.filter(
          ([path]) => path.includes('aos'),
        )
        expect(aosCalls).toHaveLength(0)
      })

      it('should add toast plugin when toast is enabled', () => {
        callSetup({ plugins: { toast: true } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('runtime/plugins/toast'),
        )
      })

      it('should add useToast import when toast is enabled', () => {
        callSetup({ plugins: { toast: true } })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useToast',
            as: 'useToast',
          }),
        )
      })

      it('should add dialog plugin when dialog is enabled', () => {
        callSetup({ plugins: { dialog: true } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('runtime/plugins/dialog'),
        )
      })

      it('should add useDialog import when dialog is enabled', () => {
        callSetup({ plugins: { dialog: true } })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useDialog',
            as: 'useDialog',
          }),
        )
      })

      it('should add wait plugin when wait is enabled', () => {
        callSetup({ plugins: { wait: true } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('runtime/plugins/wait'),
        )
      })

      it('should add useWait import when wait is enabled', () => {
        callSetup({ plugins: { wait: true } })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useWait',
            as: 'useWait',
          }),
        )
      })
    })

    describe('components', () => {
      it('should register all components when autoImport is true', () => {
        callSetup({ components: { autoImport: true } })
        const componentCalls = addComponent.mock.calls
        expect(componentCalls.length).toBeGreaterThanOrEqual(60)
        expect(addComponent).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'MazBtn' }),
        )
        expect(addComponent).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'MazInput' }),
        )
      })

      it('should set correct filePath for components', () => {
        callSetup({ components: { autoImport: true } })
        expect(addComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'MazBtn',
            filePath: 'maz-ui/components/MazBtn',
          }),
        )
      })

      it('should not register components when autoImport is false', () => {
        callSetup({ components: { autoImport: false } })
        expect(addComponent).not.toHaveBeenCalled()
      })
    })

    describe('directives', () => {
      it('should add v-zoom-img plugin when enabled', () => {
        callSetup({ directives: { vZoomImg: true } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-zoom-img'),
        )
      })

      it('should add v-lazy-img plugin when enabled', () => {
        callSetup({ directives: { vLazyImg: true } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-lazy-img'),
        )
      })

      it('should add v-click-outside plugin when enabled', () => {
        callSetup({ directives: { vClickOutside: true } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-click-outside'),
        )
      })

      it('should add v-fullscreen-img plugin when enabled', () => {
        callSetup({ directives: { vFullscreenImg: true } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('v-fullscreen-img'),
        )
      })

      it('should add v-tooltip plugin when enabled', () => {
        callSetup({ directives: { vTooltip: true } })
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
        callSetup({ composables: { useTheme: true } })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useTheme',
            from: '@maz-ui/themes',
            as: 'useTheme',
          }),
        )
      })

      it('should register useTranslations when enabled', () => {
        callSetup({ composables: { useTranslations: true } })
        expect(addImports).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'useTranslations',
            from: '@maz-ui/translations',
            as: 'useTranslations',
          }),
        )
      })

      it('should not register useTheme when disabled', () => {
        callSetup({ composables: { useTheme: false } })
        expect(addImports).not.toHaveBeenCalledWith(
          expect.objectContaining({ name: 'useTheme', from: '@maz-ui/themes' }),
        )
      })

      it('should not register useTranslations when disabled', () => {
        callSetup({ composables: { useTranslations: false } })
        expect(addImports).not.toHaveBeenCalledWith(
          expect.objectContaining({ name: 'useTranslations', from: '@maz-ui/translations' }),
        )
      })

      it('should apply autoImportPrefix to composable names', () => {
        callSetup({ general: { autoImportPrefix: 'Maz' } })
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
          plugins: { aos: true, toast: true, dialog: true, wait: true },
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
        callSetup({ general: { defaultMazIconPath: '/icons' } })
        expect(addPlugin).toHaveBeenCalledWith(
          expect.stringContaining('maz-icon-path'),
        )
      })

      it('should not add maz-icon-path plugin when defaultMazIconPath is empty', () => {
        callSetup({ general: { defaultMazIconPath: '' } })
        const iconCalls = addPlugin.mock.calls.filter(
          ([path]) => path.includes('maz-icon-path'),
        )
        expect(iconCalls).toHaveLength(0)
      })
    })

    describe('given the preventIosInputZoom option', () => {
      describe('when it is enabled', () => {
        it('then the client plugin is added', () => {
          callSetup({ general: { preventIosInputZoom: true } })

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
        it('then no flags plugin is added and no flag source is set', () => {
          const { nuxt } = callSetup()

          expect(config.defaults.flags).toBe('cdn')
          expect(addPlugin).not.toHaveBeenCalledWith(expect.stringContaining('runtime/plugins/local-flags'))
          expect((nuxt.options.runtimeConfig.public.mazUi as any).defaults.global?.flagSrc).toBeUndefined()
        })
      })

      describe('when it is local', () => {
        it('then the local flags plugin replaces the defaults plugin', () => {
          callSetup({ flags: 'local', defaults: { global: { size: 'lg' } } })

          expect(addPlugin).toHaveBeenCalledWith(expect.stringContaining('runtime/plugins/local-flags'))
          expect(addPlugin).not.toHaveBeenCalledWith(expect.stringContaining('runtime/plugins/defaults'))
        })
      })

      describe('when it is a URL template', () => {
        it('then the template becomes the global flag source through the defaults plugin', () => {
          const { nuxt } = callSetup({ flags: '/flags/{code}.svg', defaults: { global: { size: 'lg' } } })

          expect((nuxt.options.runtimeConfig.public.mazUi as any).defaults.global).toEqual({ flagSrc: '/flags/{code}.svg', size: 'lg' })
          expect(addPlugin).toHaveBeenCalledWith(expect.stringContaining('runtime/plugins/defaults'))
          expect(addPlugin).not.toHaveBeenCalledWith(expect.stringContaining('runtime/plugins/local-flags'))
        })
      })

      describe('when a global flag source is also set in defaults', () => {
        it('then the defaults value wins over the template', () => {
          const { nuxt } = callSetup({ flags: '/flags/{code}.svg', defaults: { global: { flagSrc: '/mine/{CODE}.png' } } })

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
        it('then only the MCP server of the detected agents is configured', () => {
          callSetup({}, {}, { dev: true })

          expect(config.defaults.agents).toEqual({ rules: false, mcp: true })
          expect(setupAgents).toHaveBeenCalledWith({ rootDir: '/project', targets: ['claude'], rules: false, mcp: true })
        })
      })

      describe('when it is disabled', () => {
        it('then the agents are not configured', () => {
          callSetup({ agents: false }, {}, { dev: true })

          expect(setupAgents).not.toHaveBeenCalled()
        })
      })

      describe('when it is enabled in development', () => {
        it('then the rules and the MCP server of the detected agents are configured from the root directory', () => {
          callSetup({ agents: true }, {}, { dev: true })

          expect(detectAgentTargets).toHaveBeenCalledWith('/project')
          expect(setupAgents).toHaveBeenCalledWith({ rootDir: '/project', targets: ['claude'], rules: true, mcp: true })
        })
      })

      describe('when it is enabled during nuxt prepare', () => {
        it('then the agents are configured', () => {
          callSetup({ agents: true }, {}, { _prepare: true })

          expect(setupAgents).toHaveBeenCalled()
        })
      })

      describe('when targets, rules and mcp are given', () => {
        it('then they are passed through without detection', () => {
          callSetup({ agents: { targets: ['cursor', 'agents-md'], rules: true, mcp: false } }, {}, { dev: true })

          expect(detectAgentTargets).not.toHaveBeenCalled()
          expect(setupAgents).toHaveBeenCalledWith({ rootDir: '/project', targets: ['cursor', 'agents-md'], rules: true, mcp: false })
        })
      })

      describe('when both rules and mcp are disabled', () => {
        it('then the agents are not configured', () => {
          callSetup({ agents: { rules: false, mcp: false } }, {}, { dev: true })

          expect(setupAgents).not.toHaveBeenCalled()
        })
      })

      describe('when no agent is detected', () => {
        it('then nothing is written', () => {
          detectAgentTargets.mockReturnValueOnce([])

          callSetup({ agents: true }, {}, { dev: true })

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
          })

          callSetup({ agents: true }, {}, { dev: true })

          expect(logger.info).toHaveBeenCalledTimes(1)
          expect(logger.info).toHaveBeenCalledWith('AI agents configured for maz-ui: .claude/rules/maz-ui.md (create), .mcp.json (update)')
        })
      })

      describe('when everything is up to date', () => {
        it('then nothing is logged', () => {
          setupAgents.mockReturnValueOnce({ targets: ['claude'], version: '5.0.0', changes: [{ file: '.mcp.json', action: 'unchanged' }] })

          callSetup({ agents: true }, {}, { dev: true })

          expect(logger.info).not.toHaveBeenCalled()
        })
      })

      describe('when the configuration of an explicitly enabled option fails', () => {
        it('then a warning is logged and the setup continues', () => {
          setupAgents.mockImplementationOnce(() => {
            throw new Error('maz-ui is not installed')
          })

          callSetup({ agents: true }, {}, { dev: true, mazUi: { agents: true } })

          expect(logger.warn).toHaveBeenCalledWith('Could not configure the AI agents for maz-ui: maz-ui is not installed')
          expect(addPlugin).toHaveBeenCalledWith(expect.stringContaining('runtime/plugins/theme'))
        })
      })

      describe('when the configuration enabled by default fails', () => {
        it('then the error is only logged at debug level', () => {
          setupAgents.mockImplementationOnce(() => {
            throw new Error('maz-ui is not installed')
          })

          callSetup({}, {}, { dev: true })

          expect(logger.warn).not.toHaveBeenCalled()
          expect(logger.debug).toHaveBeenCalledWith('Could not configure the AI agents for maz-ui: maz-ui is not installed')
        })
      })

      describe('when the runtime config is built', () => {
        it('then it does not expose the agents option', () => {
          const { nuxt } = callSetup({ agents: true })

          expect(nuxt.options.runtimeConfig.public.mazUi).not.toHaveProperty('agents')
        })
      })
    })

    describe('devtools', () => {
      it('should add devtools tab when devtools is true', () => {
        callSetup({ general: { devtools: true } })
        expect(addCustomTab).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'maz-ui',
            title: 'maz-ui',
          }),
        )
      })

      it('should not add devtools tab when devtools is false', () => {
        callSetup({ general: { devtools: false } })
        expect(addCustomTab).not.toHaveBeenCalled()
      })
    })
  })
})
