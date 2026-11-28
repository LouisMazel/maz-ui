import MazThemeToggle from '@components/MazThemeToggle.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

const colorMode = ref<'light' | 'dark' | 'auto'>('light')
const isDark = ref(false)
const setColorMode = vi.fn(async (mode: 'light' | 'dark' | 'auto') => {
  colorMode.value = mode
  isDark.value = mode === 'dark'
})

vi.mock('@maz-ui/translations/composables/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string) => ({
      'themeToggle.toDark': 'Switch to dark mode',
      'themeToggle.toSystem': 'Use the system theme',
      'themeToggle.toLight': 'Switch to light mode',
    })[key] ?? key,
    locale: 'en',
  }),
}))

vi.mock('@maz-ui/themes/composables/useTheme', () => ({
  useTheme: () => ({ colorMode, isDark, setColorMode }),
}))

async function mountToggle(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(MazThemeToggle, { props, slots })

  await flushPromises()

  return wrapper
}

describe('given a MazThemeToggle', () => {
  beforeEach(() => {
    colorMode.value = 'light'
    isDark.value = false
    setColorMode.mockClear()
  })

  describe('when it renders in light mode', () => {
    it('then the button offers the dark mode', async () => {
      const wrapper = await mountToggle()

      expect(wrapper.attributes('aria-label')).toBe('Switch to dark mode')
      expect(wrapper.attributes('title')).toBe('Switch to dark mode')
      expect(wrapper.attributes('data-mode')).toBe('light')
      expect(wrapper.attributes('type')).toBe('button')
    })

    it('then the icon is the sun and moon morph', async () => {
      const wrapper = await mountToggle()

      expect(wrapper.find('.m-theme-toggle__morph').exists()).toBe(true)
      expect(wrapper.find('.m-theme-toggle__system').exists()).toBe(false)
    })

    it('then it renders on the server in the light state', async () => {
      const html = await renderToString(createSSRApp(MazThemeToggle))

      expect(html).toContain('m-theme-toggle')
      expect(html).toContain('Switch to dark mode')
    })
  })

  describe('when it renders in dark mode', () => {
    it('then the button offers the light mode', async () => {
      colorMode.value = 'dark'
      isDark.value = true

      const wrapper = await mountToggle()

      expect(wrapper.attributes('aria-label')).toBe('Switch to light mode')
      expect(wrapper.attributes('data-mode')).toBe('dark')
    })
  })

  describe('when the button is clicked', () => {
    it('then it switches to dark and emits change', async () => {
      const wrapper = await mountToggle()

      await wrapper.trigger('click')

      expect(setColorMode).toHaveBeenCalledWith('dark')
      expect(wrapper.emitted('change')?.[0]).toEqual(['dark'])
      expect(wrapper.attributes('aria-label')).toBe('Switch to light mode')
    })

    it('then it switches back to light from dark', async () => {
      colorMode.value = 'dark'
      isDark.value = true

      const wrapper = await mountToggle()

      await wrapper.trigger('click')

      expect(setColorMode).toHaveBeenCalledWith('light')
      expect(wrapper.emitted('change')?.[0]).toEqual(['light'])
    })
  })

  describe('when tri-state is enabled', () => {
    it('then it cycles light, dark, auto, light', async () => {
      const wrapper = await mountToggle({ triState: true })

      expect(wrapper.attributes('aria-label')).toBe('Switch to dark mode')

      await wrapper.trigger('click')
      expect(wrapper.attributes('aria-label')).toBe('Use the system theme')

      await wrapper.trigger('click')
      expect(wrapper.attributes('aria-label')).toBe('Switch to light mode')
      expect(wrapper.attributes('data-mode')).toBe('auto')
      expect(wrapper.classes()).toContain('--system')

      await wrapper.trigger('click')

      expect(setColorMode.mock.calls.map(call => call[0])).toEqual(['dark', 'auto', 'light'])
      expect(wrapper.emitted('change')).toHaveLength(3)
    })

    it('then it renders the system icon', async () => {
      const wrapper = await mountToggle({ triState: true })

      expect(wrapper.find('.m-theme-toggle__system').exists()).toBe(true)
    })

    it('then a missing color mode falls back to light', async () => {
      colorMode.value = undefined as never

      const wrapper = await mountToggle({ triState: true })

      expect(wrapper.attributes('data-mode')).toBe('light')
    })
  })

  describe('when the mode is auto without tri-state', () => {
    it('then the button follows the applied theme', async () => {
      colorMode.value = 'auto'
      isDark.value = true

      const wrapper = await mountToggle()

      expect(wrapper.attributes('data-mode')).toBe('dark')
      expect(wrapper.attributes('aria-label')).toBe('Switch to light mode')
    })
  })

  describe('when motion is configured', () => {
    it('then the motion is enabled after the first frame', async () => {
      const wrapper = mount(MazThemeToggle)

      expect(wrapper.classes()).toContain('--no-motion')

      await flushPromises()
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('--no-motion')
    })

    it('then animated false keeps the motion off', async () => {
      const wrapper = mount(MazThemeToggle, { props: { animated: false } })

      await flushPromises()
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('--no-motion')
    })
  })

  describe('when the icon slot is given', () => {
    it('then it replaces the icon and receives the state', async () => {
      isDark.value = true
      colorMode.value = 'dark'

      const wrapper = mount(MazThemeToggle, {
        slots: { icon: `<template #icon="{ isDark, mode }"><i class="custom">{{ isDark }}-{{ mode }}</i></template>` },
      })

      await flushPromises()

      expect(wrapper.find('.custom').text()).toBe('true-dark')
      expect(wrapper.find('.m-theme-toggle__morph').exists()).toBe(false)
    })
  })

  describe('when a size is given', () => {
    it('then the button and the icon use it', async () => {
      const wrapper = await mountToggle({ size: 'lg', color: 'primary' })

      expect(wrapper.classes()).toContain('--lg')
      expect(wrapper.classes()).toContain('--primary')
    })
  })
})
