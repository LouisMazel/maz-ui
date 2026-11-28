import MazProgressiveBlur from '@components/MazProgressiveBlur.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

describe('given a MazProgressiveBlur', () => {
  describe('when it renders without props', () => {
    it('then it is a decorative bottom band of six layers', () => {
      const wrapper = mount(MazProgressiveBlur)

      expect(wrapper.attributes('aria-hidden')).toBe('true')
      expect(wrapper.classes()).toContain('m-progressive-blur--bottom')
      expect(wrapper.findAll('.m-progressive-blur__layer')).toHaveLength(6)
      expect((wrapper.element as HTMLElement).style.getPropertyValue('--m-progressive-blur-size')).toBe('6rem')
    })

    it('then the blur of the layers grows toward the edge', () => {
      const wrapper = mount(MazProgressiveBlur)
      const amounts = wrapper.findAll('.m-progressive-blur__layer').map(layer => Number.parseFloat((layer.element as HTMLElement).style.getPropertyValue('--m-progressive-blur-amount')))

      expect(amounts).toEqual([...amounts].sort((a, b) => a - b))
      expect(amounts[0]).toBeGreaterThan(0)
    })

    it('then it renders the same markup on the server', async () => {
      const html = await renderToString(createSSRApp(MazProgressiveBlur))

      expect(html).toContain('m-progressive-blur__layer')
    })
  })

  describe('when the position, height, strength and class are set', () => {
    it.each(['top', 'bottom', 'start', 'end'] as const)('then the position %s is applied', (position) => {
      const wrapper = mount(MazProgressiveBlur, { props: { position } })

      expect(wrapper.classes()).toContain(`m-progressive-blur--${position}`)
    })

    it('then the height and the class apply and the strength scales the blur', () => {
      const weak = mount(MazProgressiveBlur, { props: { strength: 6 } })
      const strong = mount(MazProgressiveBlur, { props: { strength: 24, height: '10rem', class: 'custom' } })
      const last = (wrapper: typeof weak) => Number.parseFloat((wrapper.findAll('.m-progressive-blur__layer').at(-1)!.element as HTMLElement).style.getPropertyValue('--m-progressive-blur-amount'))

      expect(last(strong)).toBeGreaterThan(last(weak))
      expect(strong.classes()).toContain('custom')
      expect((strong.element as HTMLElement).style.getPropertyValue('--m-progressive-blur-size')).toBe('10rem')
    })
  })
})
