import MazBtn from '@components/MazBtn.vue'
import { mount } from '@vue/test-utils'

describe('given MazBtn loading position', () => {
  describe('when loading with the default position', () => {
    it('then the loader covers the button', async () => {
      const wrapper = mount(MazBtn, { props: { loading: true }, slots: { default: 'Save' } })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-btn-loader-container').exists()).toBe(true)
      expect(wrapper.classes()).toContain('maz:relative')
    })
  })

  describe('when loading with the start position', () => {
    it('then the loader replaces the start icon and the label is kept', async () => {
      const wrapper = mount(MazBtn, { props: { loading: true, loadingPosition: 'start' }, slots: { default: 'Save' } })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-btn-loader-container').exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'MazSpinner' }).exists()).toBe(true)
      expect(wrapper.text()).toContain('Save')
      expect(wrapper.classes()).toContain('--loading')
      expect(wrapper.classes()).toContain('--has-start-icon')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('then the loader slot replaces the spinner', () => {
      const wrapper = mount(MazBtn, {
        props: { loading: true, loadingPosition: 'start' },
        slots: { default: 'Save', loader: '<i class="custom-loader" />' },
      })

      expect(wrapper.find('.custom-loader').exists()).toBe(true)
    })
  })

  describe('when not loading with the start position', () => {
    it('then the start icon slot is rendered', () => {
      const wrapper = mount(MazBtn, {
        props: { loadingPosition: 'start' },
        slots: { 'default': 'Save', 'start-icon': '<i class="my-icon" />' },
      })

      expect(wrapper.find('.my-icon').exists()).toBe(true)
    })
  })
})

describe('given MazBtn text color', () => {
  describe('when text-color is set', () => {
    it('then the utility class has no important flag so a user class can override it', () => {
      const wrapper = mount(MazBtn, { props: { textColor: 'success' } })

      expect(wrapper.classes()).toContain('maz:text-success')
      expect(wrapper.classes()).not.toContain('maz:text-success!')
    })
  })
})

describe('given MazBtn variant classes', () => {
  describe.each(['primary', 'transparent', 'surface', 'container', 'destructive'] as const)('when color is %s', (color) => {
    it.each([
      [{}, [`--${color}`]],
      [{ outlined: true }, ['--outlined']],
      [{ pastel: true }, ['--pastel']],
      [{ active: true }, ['--active']],
      [{ loading: true }, ['--loading', 'maz:relative']],
      [{ padding: false }, ['--no-padding']],
      [{ block: true }, ['--block']],
    ])('then %j keeps the state classes the stylesheet relies on', (extra, expected) => {
      const wrapper = mount(MazBtn, { props: { color, ...extra }, slots: { default: 'Btn' } })

      for (const name of expected)
        expect(wrapper.classes()).toContain(name)
    })

    it('then no color utility competes with the variant styles', () => {
      const wrapper = mount(MazBtn, { props: { color } })
      const colorUtilities = wrapper.classes().filter(name => /^maz:(?:bg|text|border)-(?!solid|center|xl|sm|xs|\d)/.test(name))

      expect(colorUtilities).toEqual([])
    })
  })

  describe('when the button is disabled', () => {
    it('then the disabled attribute carries the disabled styles', () => {
      const wrapper = mount(MazBtn, { props: { disabled: true } })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })
})
