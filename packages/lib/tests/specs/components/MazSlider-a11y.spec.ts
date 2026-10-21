import MazSlider from '@components/MazSlider.vue'
import { mount } from '@vue/test-utils'

function getCursors(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[role="slider"]')
}

function pressKey(element: Element, key: string) {
  const event = new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true })
  element.dispatchEvent(event)
  return event
}

function lastEmitted(wrapper: ReturnType<typeof mount>) {
  return wrapper.emitted('update:model-value')?.at(-1)?.[0]
}

describe('given a MazSlider with one cursor', () => {
  describe.each([
    ['ArrowUp', 51],
    ['ArrowRight', 51],
    ['ArrowDown', 49],
    ['ArrowLeft', 49],
    ['PageUp', 60],
    ['PageDown', 40],
    ['Home', 0],
    ['End', 100],
  ])('when %s is pressed', (key, expectedValue) => {
    it(`then the value becomes ${expectedValue} and the page does not scroll`, () => {
      const wrapper = mount(MazSlider, { props: { modelValue: 50, min: 0, max: 100 } })

      const event = pressKey(getCursors(wrapper)[0].element, key)

      expect(lastEmitted(wrapper)).toBe(expectedValue)
      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe('when PageUp is pressed near the max', () => {
    it('then the value stops at the max', () => {
      const wrapper = mount(MazSlider, { props: { modelValue: 95, min: 0, max: 100 } })

      pressKey(getCursors(wrapper)[0].element, 'PageUp')

      expect(lastEmitted(wrapper)).toBe(100)
    })
  })

  describe('when Home is pressed on the min value', () => {
    it('then no value is emitted', () => {
      const wrapper = mount(MazSlider, { props: { modelValue: 0, min: 0, max: 100 } })
      const emittedBefore = wrapper.emitted('update:model-value')?.length ?? 0

      const event = pressKey(getCursors(wrapper)[0].element, 'Home')

      expect(wrapper.emitted('update:model-value')?.length ?? 0).toBe(emittedBefore)
      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe('when another key is pressed', () => {
    it('then the value does not change and the default action is kept', () => {
      const wrapper = mount(MazSlider, { props: { modelValue: 50, min: 0, max: 100 } })
      const emittedBefore = wrapper.emitted('update:model-value')?.length ?? 0

      const event = pressKey(getCursors(wrapper)[0].element, 'Tab')

      expect(wrapper.emitted('update:model-value')?.length ?? 0).toBe(emittedBefore)
      expect(event.defaultPrevented).toBe(false)
    })
  })
})

describe('given a MazSlider with two cursors', () => {
  describe('when End is pressed on the first cursor', () => {
    it('then it stops at the second cursor', () => {
      const wrapper = mount(MazSlider, { props: { modelValue: [20, 70], min: 0, max: 100 } })

      pressKey(getCursors(wrapper)[0].element, 'End')

      expect(lastEmitted(wrapper)).toEqual([70, 70])
    })
  })

  describe('when Home is pressed on the second cursor', () => {
    it('then it stops at the first cursor', () => {
      const wrapper = mount(MazSlider, { props: { modelValue: [20, 70], min: 0, max: 100 } })

      pressKey(getCursors(wrapper)[1].element, 'Home')

      expect(lastEmitted(wrapper)).toEqual([20, 20])
    })
  })

  describe('when PageDown is pressed on the second cursor close to the first one', () => {
    it('then it stops at the first cursor', () => {
      const wrapper = mount(MazSlider, { props: { modelValue: [20, 25], min: 0, max: 100 } })

      pressKey(getCursors(wrapper)[1].element, 'PageDown')

      expect(lastEmitted(wrapper)).toEqual([20, 20])
    })
  })

  describe('when ArrowUp is pressed on the first cursor touching the second one', () => {
    it('then the cursor does not pass the second one', () => {
      const wrapper = mount(MazSlider, { props: { modelValue: [70, 70], min: 0, max: 100 } })
      const emittedBefore = wrapper.emitted('update:model-value')?.length ?? 0

      pressKey(getCursors(wrapper)[0].element, 'ArrowUp')

      expect(wrapper.emitted('update:model-value')?.length ?? 0).toBe(emittedBefore)
    })
  })

  describe('when labels are set', () => {
    it('then each cursor exposes its label as value text', () => {
      const wrapper = mount(MazSlider, { props: { modelValue: [20, 70], labels: ['Min price', 'Max price'] } })

      expect(getCursors(wrapper).map(cursor => cursor.attributes('aria-valuetext'))).toEqual(['Min price', 'Max price'])
    })
  })
})
