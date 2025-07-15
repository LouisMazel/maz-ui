import MazSpinner from '@components/MazSpinner.vue'
import { mount } from '@vue/test-utils'

describe('given MazSpinner component', () => {
  describe('when rendered with default props', () => {
    it('then it should render with default size and theme color', () => {
      const wrapper = mount(MazSpinner)

      expect(wrapper.find('svg').attributes('width')).toBe('2em')
      expect(wrapper.find('svg').attributes('height')).toBe('2em')
      expect(wrapper.classes()).toContain('m-spinner--theme')
    })
  })

  describe('when rendered with custom size', () => {
    it('then it should apply the custom size', () => {
      const wrapper = mount(MazSpinner, {
        props: { size: '3rem' },
      })

      expect(wrapper.find('svg').attributes('width')).toBe('3rem')
      expect(wrapper.find('svg').attributes('height')).toBe('3rem')
    })
  })

  describe('when rendered with different colors', () => {
    it('then it should apply the correct color classes', () => {
      const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast', 'normal', 'transparent']

      colors.forEach((color) => {
        const wrapper = mount(MazSpinner, {
          props: { color },
        })
        expect(wrapper.classes()).toContain(`m-spinner--${color}`)
      })
    })
  })

  describe('when rendered', () => {
    it('then it should have the correct SVG structure', () => {
      const wrapper = mount(MazSpinner)
      const svg = wrapper.find('svg')

      expect(svg.attributes('version')).toBe('1.1')
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
      expect(svg.attributes('viewBox')).toBe('0 0 50 50')
      expect(svg.find('path').exists()).toBe(true)
    })

    it('then it should have the base spinner classes', () => {
      const wrapper = mount(MazSpinner)

      expect(wrapper.classes()).toContain('m-spinner')
      expect(wrapper.classes()).toContain('m-reset-css')
    })
  })

  describe('when rendered with custom color and size', () => {
    it('then it should apply both custom properties', () => {
      const wrapper = mount(MazSpinner, {
        props: {
          color: 'success',
          size: '4em',
        },
      })

      expect(wrapper.classes()).toContain('m-spinner--success')
      expect(wrapper.find('svg').attributes('width')).toBe('4em')
      expect(wrapper.find('svg').attributes('height')).toBe('4em')
    })
  })
})
