import MazCard from '@components/MazCard.vue'
import MazContainer from '@components/MazContainer.vue'
import { mount } from '@vue/test-utils'

describe.each([
  ['MazCard', MazCard, '.m-card'],
  ['MazContainer', MazContainer, '.m-container'],
] as const)('given %s elevation and border draw', (_name, component, selector) => {
  describe('when the elevation is a level', () => {
    it.each([
      [1, 'maz:shadow-sm'],
      [2, 'maz:shadow-elevation'],
      [3, 'maz:shadow-lg'],
    ] as const)('then the level %s applies its shadow without the drop shadow', (elevation, expected) => {
      const wrapper = mount(component, { props: { elevation } })
      const classes = wrapper.find(selector).classes()

      expect(classes).toContain(expected)
      expect(classes).not.toContain('maz:drop-shadow-md')
    })

    it('then the level 0 applies no shadow', () => {
      const wrapper = mount(component, { props: { elevation: 0 } })

      expect(wrapper.find(selector).classes().some(name => name.includes('shadow'))).toBe(false)
    })
  })

  describe('when the elevation is true', () => {
    it('then the historical shadow stays', () => {
      const wrapper = mount(component, { props: { elevation: true } })

      expect(wrapper.find(selector).classes()).toEqual(expect.arrayContaining(['maz:shadow-elevation', 'maz:drop-shadow-md']))
    })
  })

  describe('when borderDraw is enabled', () => {
    it('then the utility class is applied and the pointer angle is set on enter', async () => {
      const wrapper = mount(component, { props: { borderDraw: true } })
      const root = wrapper.find(selector)

      root.element.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect

      await root.trigger('pointerenter', { clientX: 200, clientY: 50 })

      expect(root.classes()).toContain('maz:border-draw')
      expect((root.element as HTMLElement).style.getPropertyValue('--maz-border-draw-from')).toBe('90deg')
    })

    it('then nothing is set without the option', async () => {
      const wrapper = mount(component)
      const root = wrapper.find(selector)

      await root.trigger('pointerenter', { clientX: 200, clientY: 50 })

      expect(root.classes()).not.toContain('maz:border-draw')
      expect((root.element as HTMLElement).style.getPropertyValue('--maz-border-draw-from')).toBe('')
    })
  })
})

describe('given MazCard dark mode border', () => {
  describe('when the card has no elevation', () => {
    it('then it keeps the dark border', () => {
      const wrapper = mount(MazCard)

      expect(wrapper.classes()).toContain('maz:dark:border')
    })
  })

  describe('when the card has an elevation', () => {
    it('then the shadow of the theme replaces the dark border', () => {
      const wrapper = mount(MazCard, { props: { elevation: 2 } })

      expect(wrapper.classes()).not.toContain('maz:dark:border')
    })
  })
})
