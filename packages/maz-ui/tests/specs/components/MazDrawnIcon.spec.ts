import MazDrawnIcon from '@components/MazDrawnIcon.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

describe('given a MazDrawnIcon', () => {
  describe('when it is rendered with only a name', () => {
    it('then it is drawn, decorative and has one path for check', () => {
      const wrapper = mount(MazDrawnIcon, { props: { name: 'check' } })
      const svg = wrapper.find('svg')

      expect(svg.classes()).toContain('m-drawn-icon')
      expect(svg.classes()).toContain('m-drawn-icon--drawn')
      expect(svg.attributes('aria-hidden')).toBe('true')
      expect(svg.attributes('role')).toBeUndefined()
      expect(svg.attributes('stroke')).toBe('currentColor')
      expect(svg.attributes('stroke-width')).toBe('2')
      expect(wrapper.findAll('path')).toHaveLength(1)
      expect(wrapper.find('path').attributes('pathLength')).toBe('1')
    })
  })

  describe.each([
    ['check', 1],
    ['x-mark', 2],
    ['minus', 1],
    ['check-circle', 2],
    ['x-circle', 3],
    ['exclamation-circle', 3],
    ['information-circle', 3],
  ] as const)('when the name is %s', (name, count) => {
    it('then it renders the strokes in order', () => {
      const wrapper = mount(MazDrawnIcon, { props: { name } })
      const paths = wrapper.findAll('path')

      expect(paths).toHaveLength(count)
      paths.forEach((path, index) => {
        expect(path.attributes('style')).toContain(`--m-drawn-index: ${index}`)
      })
    })
  })

  describe('when drawn is false', () => {
    it('then the drawn class is missing and returns when drawn becomes true', async () => {
      const wrapper = mount(MazDrawnIcon, { props: { name: 'check', drawn: false } })

      expect(wrapper.classes()).not.toContain('m-drawn-icon--drawn')

      await wrapper.setProps({ drawn: true })

      expect(wrapper.classes()).toContain('m-drawn-icon--drawn')
    })
  })

  describe('when label, strokeWidth, duration and delay are set', () => {
    it('then it exposes an image role and the custom values', () => {
      const wrapper = mount(MazDrawnIcon, {
        props: { name: 'check', label: 'Saved', strokeWidth: 3, duration: '1s', delay: '200ms' },
      })
      const svg = wrapper.find('svg')

      expect(svg.attributes('role')).toBe('img')
      expect(svg.attributes('aria-label')).toBe('Saved')
      expect(svg.attributes('aria-hidden')).toBeUndefined()
      expect(svg.attributes('stroke-width')).toBe('3')
      expect(svg.attributes('style')).toContain('--m-drawn-duration: 1s')
      expect(svg.attributes('style')).toContain('--m-drawn-delay: 200ms')
    })
  })

  describe('when size is a predefined keyword', () => {
    it('then it uses the matching text class', () => {
      const wrapper = mount(MazDrawnIcon, { props: { name: 'check', size: 'lg' } })

      expect(wrapper.classes()).toContain('maz:text-4xl')
      expect(wrapper.attributes('style')).not.toContain('font-size')
    })
  })

  describe('when size is a CSS length', () => {
    it('then it sets the font size', () => {
      const wrapper = mount(MazDrawnIcon, { props: { name: 'check', size: '2rem' } })

      expect(wrapper.attributes('style')).toContain('font-size: 2rem')
    })
  })

  describe('when the motion option is reduced', () => {
    it('then the reduced class is set', () => {
      const wrapper = mount(MazDrawnIcon, {
        props: { name: 'check' },
        global: { provide: { [MAZ_UI_CONTEXT_INJECTION_KEY as symbol]: { motion: 'reduced' } } },
      })

      expect(wrapper.classes()).toContain('m-drawn-icon--reduced')
    })
  })

  describe('when it is rendered on the server', () => {
    it('then the markup contains the drawn icon', async () => {
      const app = createSSRApp({ render: () => h(MazDrawnIcon, { name: 'x-circle' }) })
      const html = await renderToString(app)

      expect(html).toContain('m-drawn-icon--drawn')
      expect(html.match(/<path/g)).toHaveLength(3)
    })
  })
})
