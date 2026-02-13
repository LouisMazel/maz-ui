import type { ThemePreset, ThemeState } from '@maz-ui/themes'
import type { MazUiTranslationsInstance } from '@maz-ui/translations'
import type { Ref } from 'vue'
import MazUiProvider from '@components/MazUiProvider.vue'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject, ref } from 'vue'

const { mockSetupTheme, mockCreateMazUiTranslations, mockInjectThemeState, mockInjectTranslations, mockSetLocale } = vi.hoisted(() => ({
  mockSetupTheme: vi.fn(),
  mockCreateMazUiTranslations: vi.fn(),
  mockInjectThemeState: vi.fn(),
  mockInjectTranslations: vi.fn(),
  mockSetLocale: vi.fn(),
}))

vi.mock('@maz-ui/themes/utils/setup-theme', () => ({
  setupTheme: mockSetupTheme,
}))

vi.mock('@maz-ui/themes/utils/inject', () => ({
  injectThemeState: mockInjectThemeState,
}))

vi.mock('@maz-ui/translations/utils/instance', () => ({
  createMazUiTranslations: mockCreateMazUiTranslations,
}))

vi.mock('@maz-ui/translations/utils/inject', () => ({
  injectTranslations: mockInjectTranslations,
}))

const mockPreset: ThemePreset = {
  name: 'test',
  colors: {
    light: {
      'background': '0 0% 100%',
      'foreground': '0 0% 0%',
      'primary': '220 90% 56%',
      'primary-foreground': '0 0% 100%',
      'secondary': '220 14% 96%',
      'secondary-foreground': '220 9% 46%',
      'accent': '220 14% 96%',
      'accent-foreground': '220 9% 46%',
      'info': '220 90% 56%',
      'info-foreground': '0 0% 100%',
      'contrast': '0 0% 0%',
      'contrast-foreground': '0 0% 100%',
      'destructive': '0 84% 60%',
      'destructive-foreground': '0 0% 100%',
      'success': '142 71% 45%',
      'success-foreground': '0 0% 100%',
      'warning': '38 92% 50%',
      'warning-foreground': '0 0% 100%',
      'overlay': '0 0% 0%',
      'muted': '220 14% 96%',
      'border': '220 13% 91%',
      'shadow': '0 0% 0%',
    },
    dark: {
      'background': '224 71% 4%',
      'foreground': '210 20% 98%',
      'primary': '220 90% 56%',
      'primary-foreground': '0 0% 100%',
      'secondary': '215 28% 17%',
      'secondary-foreground': '210 20% 98%',
      'accent': '215 28% 17%',
      'accent-foreground': '210 20% 98%',
      'info': '220 90% 56%',
      'info-foreground': '0 0% 100%',
      'contrast': '210 20% 98%',
      'contrast-foreground': '224 71% 4%',
      'destructive': '0 63% 31%',
      'destructive-foreground': '0 0% 100%',
      'success': '142 71% 45%',
      'success-foreground': '0 0% 100%',
      'warning': '38 92% 50%',
      'warning-foreground': '0 0% 100%',
      'overlay': '0 0% 0%',
      'muted': '215 28% 17%',
      'border': '215 28% 17%',
      'shadow': '0 0% 0%',
    },
  },
  foundation: {
    'radius': '0.5rem',
    'border-width': '1px',
  },
}

const ThemeConsumer = defineComponent({
  setup() {
    const themeState = inject<Ref<ThemeState>>('mazThemeState')
    return () => h('div', { 'data-testid': 'theme-consumer' }, JSON.stringify(themeState?.value))
  },
})

const TranslationsConsumer = defineComponent({
  setup() {
    const translations = inject<MazUiTranslationsInstance>('mazTranslations')
    return () => h('div', { 'data-testid': 'translations-consumer' }, translations?.locale?.value ?? 'none')
  },
})

function createDefaultThemeState(): ThemeState {
  return {
    strategy: 'hybrid',
    darkClass: 'dark',
    darkModeStrategy: 'class',
    colorMode: 'auto',
    mode: 'both',
    preset: undefined,
    isDark: false,
  }
}

function createMockTranslationsInstance(overrides: Partial<MazUiTranslationsInstance> = {}): MazUiTranslationsInstance {
  return {
    locale: ref('en'),
    t: vi.fn().mockReturnValue('test'),
    setLocale: mockSetLocale,
    isLocaleLoaded: vi.fn().mockReturnValue(false),
    isLocaleLoading: vi.fn().mockReturnValue(false),
    getAvailableLocales: vi.fn().mockReturnValue(['en']),
    setLocaleMessage: vi.fn(),
    getMessages: vi.fn().mockReturnValue({}),
    getLoadedLocales: vi.fn().mockReturnValue(['en']),
    ...overrides,
  }
}

describe('given MazUiProvider component', () => {
  let mockCleanupFn: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockCleanupFn = vi.fn()

    mockSetupTheme.mockReturnValue({
      themeState: ref<ThemeState>(createDefaultThemeState()),
      cleanup: mockCleanupFn,
    })

    mockInjectThemeState.mockImplementation(({ app, themeState }) => {
      if (app) {
        app.provide('mazThemeState', themeState)
        app.config.globalProperties.$mazThemeState = themeState
      }
    })

    mockInjectTranslations.mockImplementation(({ app, i18n }) => {
      if (app) {
        app.provide('mazTranslations', i18n)
        app.config.globalProperties.$mazTranslations = i18n
      }
    })

    mockSetLocale.mockResolvedValue(undefined)
    mockCreateMazUiTranslations.mockReturnValue(createMockTranslationsInstance())
  })

  describe('when rendered with theme and translations options', () => {
    it('provides theme state to child components via injection', () => {
      const wrapper = mount(MazUiProvider, {
        props: {
          theme: { colorMode: 'auto', preset: mockPreset },
        },
        slots: {
          default: () => h(ThemeConsumer),
        },
      })

      const consumer = wrapper.find('[data-testid="theme-consumer"]')
      const parsed = JSON.parse(consumer.text())
      expect(parsed.colorMode).toBe('auto')
      expect(parsed.strategy).toBe('hybrid')
      expect(parsed.isDark).toBe(false)
    })

    it('provides translations instance to child components via injection', () => {
      const wrapper = mount(MazUiProvider, {
        props: {
          theme: { colorMode: 'auto', preset: mockPreset },
          translations: { locale: 'en' },
        },
        slots: {
          default: () => h(TranslationsConsumer),
        },
      })

      const consumer = wrapper.find('[data-testid="translations-consumer"]')
      expect(consumer.text()).toBe('en')
    })

    it('calls setupTheme with the theme prop', () => {
      const themeOptions = { colorMode: 'dark' as const, preset: mockPreset }

      mount(MazUiProvider, {
        props: { theme: themeOptions },
        slots: { default: () => h('div') },
      })

      expect(mockSetupTheme).toHaveBeenCalledWith(themeOptions)
    })

    it('calls createMazUiTranslations with the translations prop', () => {
      const translationsOptions = { locale: 'fr' }

      mount(MazUiProvider, {
        props: {
          theme: { colorMode: 'auto', preset: mockPreset },
          translations: translationsOptions,
        },
        slots: { default: () => h('div') },
      })

      expect(mockCreateMazUiTranslations).toHaveBeenCalledWith(translationsOptions)
    })
  })

  describe('when rendered with synchronously available children', () => {
    it('provides theme state immediately from setupTheme result', () => {
      const wrapper = mount(MazUiProvider, {
        props: {
          theme: { colorMode: 'auto', strategy: 'hybrid', preset: mockPreset },
        },
        slots: {
          default: () => h(ThemeConsumer),
        },
      })

      const consumer = wrapper.find('[data-testid="theme-consumer"]')
      const parsed = JSON.parse(consumer.text())
      expect(parsed.colorMode).toBe('auto')
      expect(parsed.strategy).toBe('hybrid')
    })

    it('reflects setupTheme result in theme state', () => {
      const resolvedState = createDefaultThemeState()
      resolvedState.isDark = true

      mockSetupTheme.mockReturnValue({
        themeState: ref<ThemeState>(resolvedState),
        cleanup: vi.fn(),
      })

      const wrapper = mount(MazUiProvider, {
        props: { theme: { colorMode: 'auto', preset: mockPreset } },
        slots: {
          default: () => h(ThemeConsumer),
        },
      })

      const consumer = wrapper.find('[data-testid="theme-consumer"]')
      const parsed = JSON.parse(consumer.text())
      expect(parsed.isDark).toBe(true)
    })
  })

  describe('when rendered without translations prop', () => {
    it('calls createMazUiTranslations with empty object', () => {
      mount(MazUiProvider, {
        props: { theme: { colorMode: 'auto', preset: mockPreset } },
        slots: { default: () => h('div') },
      })

      expect(mockCreateMazUiTranslations).toHaveBeenCalledWith({})
    })
  })

  describe('when rendered with slot content', () => {
    it('renders only the slot content without a DOM wrapper', () => {
      const wrapper = mount(MazUiProvider, {
        props: { theme: { colorMode: 'auto', preset: mockPreset } },
        slots: {
          default: '<span class="child">Hello</span>',
        },
      })

      expect(wrapper.html()).toBe('<span class="child">Hello</span>')
    })
  })

  describe('when theme prop changes', () => {
    it('re-initializes the theme with the new options', async () => {
      const wrapper = mount(MazUiProvider, {
        props: { theme: { colorMode: 'auto', preset: mockPreset } },
        slots: { default: () => h('div') },
      })

      expect(mockSetupTheme).toHaveBeenCalledTimes(1)

      const newThemeState = createDefaultThemeState()
      newThemeState.colorMode = 'dark'
      newThemeState.isDark = true

      mockSetupTheme.mockReturnValue({
        themeState: ref<ThemeState>(newThemeState),
        cleanup: vi.fn(),
      })

      await wrapper.setProps({ theme: { colorMode: 'dark', preset: mockPreset } })

      expect(mockSetupTheme).toHaveBeenCalledTimes(2)
      expect(mockSetupTheme).toHaveBeenLastCalledWith({ colorMode: 'dark', preset: mockPreset })
    })

    it('calls cleanup from the previous theme initialization', async () => {
      const wrapper = mount(MazUiProvider, {
        props: { theme: { colorMode: 'auto', preset: mockPreset } },
        slots: { default: () => h('div') },
      })

      const previousCleanup = mockCleanupFn

      mockSetupTheme.mockReturnValue({
        themeState: ref<ThemeState>(createDefaultThemeState()),
        cleanup: vi.fn(),
      })

      await wrapper.setProps({ theme: { colorMode: 'dark', preset: mockPreset } })

      expect(previousCleanup).toHaveBeenCalled()
    })
  })

  describe('when translations locale prop changes', () => {
    it('calls setLocale with the new locale', async () => {
      const wrapper = mount(MazUiProvider, {
        props: {
          theme: { colorMode: 'auto', preset: mockPreset },
          translations: { locale: 'en' },
        },
        slots: { default: () => h('div') },
      })

      await wrapper.setProps({ translations: { locale: 'fr' } })

      expect(mockSetLocale).toHaveBeenCalledWith('fr')
    })
  })

  describe('when unmounted', () => {
    it('calls the theme cleanup function', () => {
      const wrapper = mount(MazUiProvider, {
        props: { theme: { colorMode: 'auto', preset: mockPreset } },
        slots: { default: () => h('div') },
      })

      wrapper.unmount()

      expect(mockCleanupFn).toHaveBeenCalled()
    })
  })

  describe('when both plugin and provider are used', () => {
    it('provider values take precedence in its subtree', () => {
      const pluginThemeState = ref<ThemeState>({
        strategy: 'runtime',
        darkClass: 'dark',
        darkModeStrategy: 'media',
        colorMode: 'dark',
        mode: 'dark',
        preset: undefined,
        isDark: true,
      })

      const wrapper = mount(MazUiProvider, {
        global: {
          provide: {
            mazThemeState: pluginThemeState,
          },
        },
        props: { theme: { colorMode: 'auto', preset: mockPreset } },
        slots: {
          default: () => h(ThemeConsumer),
        },
      })

      const consumer = wrapper.find('[data-testid="theme-consumer"]')
      const parsed = JSON.parse(consumer.text())
      expect(parsed.colorMode).toBe('auto')
      expect(parsed.strategy).toBe('hybrid')
      expect(parsed.isDark).toBe(false)
    })
  })
})
