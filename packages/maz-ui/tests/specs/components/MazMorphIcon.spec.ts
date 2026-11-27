import MazMorphIcon from '@components/MazMorphIcon.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

const NAMES = [
  'menu-close',
  'plus-close',
  'plus-minus',
  'play-pause',
  'eye-eye-slash',
  'copy-check',
  'sun-moon',
  'chevron-down-up',
  'sound-mute',
] as const

describe('given a MazMorphIcon', () => {
  describe('when it is rendered with only a name', () => {
    it('then it shows the first icon and is decorative', () => {
      const wrapper = mount(MazMorphIcon, { props: { name: 'menu-close' } })
      const svg = wrapper.find('svg')

      expect(svg.classes()).toContain('m-morph-icon')
      expect(svg.classes()).not.toContain('m-morph-icon--active')
      expect(svg.attributes('aria-hidden')).toBe('true')
      expect(svg.attributes('stroke-width')).toBe('2')
      expect(wrapper.findAll('path')).toHaveLength(3)
    })
  })

  describe.each(NAMES)('when the name is %s', (name) => {
    it('then the transforms of the parts change with active', async () => {
      const wrapper = mount(MazMorphIcon, { props: { name } })
      const before = wrapper.findAll('path').map(path => path.attributes('style'))

      await wrapper.setProps({ active: true })

      const after = wrapper.findAll('path').map(path => path.attributes('style'))

      expect(wrapper.classes()).toContain('m-morph-icon--active')
      expect(after).not.toEqual(before)

      await wrapper.setProps({ active: false })

      expect(wrapper.findAll('path').map(path => path.attributes('style'))).toEqual(before)
    })
  })

  describe('when menu-close is active', () => {
    it('then the bars become a cross and the middle one fades', () => {
      const wrapper = mount(MazMorphIcon, { props: { name: 'menu-close', active: true } })
      const [top, middle, bottom] = wrapper.findAll('path')

      expect(top!.attributes('style')).toContain('rotate(45deg)')
      expect(bottom!.attributes('style')).toContain('rotate(-45deg)')
      expect(middle!.attributes('style')).toContain('opacity: 0')
    })
  })

  describe('when eye-eye-slash is inactive and then active', () => {
    it('then the slash is hidden by its dash offset and then drawn', async () => {
      const wrapper = mount(MazMorphIcon, { props: { name: 'eye-eye-slash' } })
      const slash = () => wrapper.findAll('path')[2]!

      expect(slash().attributes('style')).toContain('stroke-dashoffset: 1')

      await wrapper.setProps({ active: true })

      expect(slash().attributes('style')).toContain('stroke-dashoffset: 0')
    })
  })

  describe('when the name is play-pause or sound-mute', () => {
    it.each(['play-pause', 'sound-mute'] as const)('then %s is mirrored in RTL', (name) => {
      const wrapper = mount(MazMorphIcon, { props: { name } })

      expect(wrapper.classes()).toContain('m-morph-icon--rtl-flip')
    })
  })

  describe('when the name is not direction dependent', () => {
    it('then it is not mirrored', () => {
      const wrapper = mount(MazMorphIcon, { props: { name: 'plus-minus' } })

      expect(wrapper.classes()).not.toContain('m-morph-icon--rtl-flip')
    })
  })

  describe('when strokeWidth and size are set', () => {
    it('then it applies the stroke width and the predefined size class', () => {
      const wrapper = mount(MazMorphIcon, { props: { name: 'sun-moon', strokeWidth: 1.5, size: 'sm' } })

      expect(wrapper.attributes('stroke-width')).toBe('1.5')
      expect(wrapper.classes()).toContain('maz:text-xl')
    })

    it('then a CSS length sets the font size', () => {
      const wrapper = mount(MazMorphIcon, { props: { name: 'sun-moon', size: '3rem' } })

      expect(wrapper.attributes('style')).toContain('font-size: 3rem')
    })
  })

  describe('when the motion option is reduced', () => {
    it('then the reduced class is set', () => {
      const wrapper = mount(MazMorphIcon, {
        props: { name: 'plus-minus' },
        global: { provide: { [MAZ_UI_CONTEXT_INJECTION_KEY as symbol]: { motion: 'reduced' } } },
      })

      expect(wrapper.classes()).toContain('m-morph-icon--reduced')
    })
  })

  describe('when it is rendered on the server', () => {
    it('then the markup contains the active state', async () => {
      const app = createSSRApp({ render: () => h(MazMorphIcon, { name: 'plus-close', active: true }) })
      const html = await renderToString(app)

      expect(html).toContain('m-morph-icon--active')
      expect(html).toContain('rotate(135deg)')
    })
  })
})
