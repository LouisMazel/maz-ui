import MazRollingText from '@components/MazRollingText.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

const reduced = ref(false)

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: reduced }),
}))

function cells(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.m-rolling-text__cell')
}

function rolling(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.m-rolling-text__char--in')
}

function visibleText(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.m-rolling-text__chars').text()
}

describe('given a MazRollingText', () => {
  beforeEach(() => {
    reduced.value = false
  })

  describe('when it renders for the first time', () => {
    it('then it does not animate and the visible characters are aria-hidden', () => {
      const wrapper = mount(MazRollingText, { props: { value: 'Copy' } })

      expect(visibleText(wrapper)).toBe('Copy')
      expect(rolling(wrapper)).toHaveLength(0)
      expect(wrapper.find('.m-rolling-text__chars').attributes('aria-hidden')).toBe('true')
    })

    it('then the sr-only copy holds the final value', () => {
      const wrapper = mount(MazRollingText, { props: { value: 'Copy' } })

      expect(wrapper.find('.maz\\:sr-only').text()).toBe('Copy')
    })

    it('then it renders the same markup on the server', async () => {
      const html = await renderToString(createSSRApp(MazRollingText, { value: 'Hi' }))

      expect(html).toContain('m-rolling-text')
      expect(html).toContain('Hi')
    })

    it('then it renders the given tag', () => {
      const wrapper = mount(MazRollingText, { props: { value: 'x', tag: 'strong' } })

      expect(wrapper.element.tagName).toBe('STRONG')
    })
  })

  describe('when the value changes', () => {
    it('then only the changed characters roll', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'Cat' } })

      await wrapper.setProps({ value: 'Cot' })

      expect(rolling(wrapper)).toHaveLength(1)
      expect(cells(wrapper)[1]!.find('.m-rolling-text__char--out').text()).toBe('a')
      expect(cells(wrapper)[1]!.find('.m-rolling-text__char--in').text()).toBe('o')
      expect(wrapper.find('.maz\\:sr-only').text()).toBe('Cot')
    })

    it('then the old characters are removed when the animation ends', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'Cat' } })

      await wrapper.setProps({ value: 'Cot' })
      await cells(wrapper)[1]!.find('.m-rolling-text__char--out').trigger('animationend')
      await rolling(wrapper)[0]!.trigger('animationend')

      expect(wrapper.find('.m-rolling-text__char--out').exists()).toBe(false)
      expect(rolling(wrapper)).toHaveLength(0)
      expect(wrapper.emitted('animation-end')).toHaveLength(1)
    })

    it('then a new value during an animation replaces the old character without stacking', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'a' } })

      await wrapper.setProps({ value: 'b' })
      await wrapper.setProps({ value: 'c' })

      expect(wrapper.findAll('.m-rolling-text__char--out')).toHaveLength(1)
      expect(wrapper.find('.m-rolling-text__char--out').text()).toBe('b')
      expect(rolling(wrapper)[0]!.text()).toBe('c')
    })

    it('then the changed characters are staggered and capped', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'aaaaaaaaaa' } })

      await wrapper.setProps({ value: 'bbbbbbbbbb' })

      const delays = rolling(wrapper).map(char => (char.element as HTMLElement).style.animationDelay)

      expect(delays[0]).toBe('0ms')
      expect(delays[1]).toBe('25ms')
      expect(delays.at(-1)).toBe('150ms')
    })

    it('then there is no delay when stagger is false', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'ab', stagger: false } })

      await wrapper.setProps({ value: 'cd' })

      expect(rolling(wrapper).map(char => (char.element as HTMLElement).style.animationDelay)).toEqual(['0ms', '0ms'])
    })

    it('then a new character without counterpart enters alone', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'ab' } })

      await wrapper.setProps({ value: 'abc' })

      expect(rolling(wrapper)).toHaveLength(1)
      expect(wrapper.find('.m-rolling-text__char--out').exists()).toBe(false)
    })

    it('then the same text does nothing', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'ab' } })

      await wrapper.setProps({ value: 'ab' })

      expect(rolling(wrapper)).toHaveLength(0)
    })
  })

  describe('when the value is a number', () => {
    it('then it is formatted with Intl.NumberFormat and uses tabular numbers', () => {
      const wrapper = mount(MazRollingText, {
        props: { value: 1234.5, locale: 'en-US', format: { style: 'currency', currency: 'USD' } },
      })

      expect(visibleText(wrapper)).toBe('$1,234.50')
      expect(wrapper.classes()).toContain('m-rolling-text--numeric')
    })

    it('then the digits are aligned from the right', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 99, locale: 'en-US' } })

      await wrapper.setProps({ value: 100 })

      expect(rolling(wrapper).map(char => char.text())).toEqual(['1', '0', '0'])
      expect(cells(wrapper)[1]!.find('.m-rolling-text__char--out').text()).toBe('9')
    })

    it('then the browser locale is used without locale', () => {
      const wrapper = mount(MazRollingText, { props: { value: 5 } })

      expect(visibleText(wrapper)).toBe('5')
    })
  })

  describe('when the direction is auto', () => {
    it('then numbers roll up when they increase', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 1 } })

      await wrapper.setProps({ value: 2 })

      expect((rolling(wrapper)[0]!.element as HTMLElement).style.getPropertyValue('--m-rolling-from')).toBe('100%')
    })

    it('then numbers roll down when they decrease', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 2 } })

      await wrapper.setProps({ value: 1 })

      expect((rolling(wrapper)[0]!.element as HTMLElement).style.getPropertyValue('--m-rolling-from')).toBe('-100%')
    })

    it('then text rolls up', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'b' } })

      await wrapper.setProps({ value: 'a' })

      expect((rolling(wrapper)[0]!.element as HTMLElement).style.getPropertyValue('--m-rolling-from')).toBe('100%')
    })
  })

  describe('when the direction is forced', () => {
    it('then down rolls from the top', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'a', direction: 'down' } })

      await wrapper.setProps({ value: 'b' })

      expect((rolling(wrapper)[0]!.element as HTMLElement).style.getPropertyValue('--m-rolling-from')).toBe('-100%')
    })

    it('then up rolls from the bottom even when the number decreases', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 5, direction: 'up' } })

      await wrapper.setProps({ value: 1 })

      expect((rolling(wrapper)[0]!.element as HTMLElement).style.getPropertyValue('--m-rolling-from')).toBe('100%')
    })
  })

  describe('when animated is false', () => {
    it('then the text changes instantly', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'a', animated: false } })

      await wrapper.setProps({ value: 'b' })

      expect(visibleText(wrapper)).toBe('b')
      expect(rolling(wrapper)).toHaveLength(0)
      expect(wrapper.find('.m-rolling-text__char--out').exists()).toBe(false)
    })
  })

  describe('when the motion is reduced', () => {
    it('then the text changes instantly', async () => {
      reduced.value = true
      const wrapper = mount(MazRollingText, { props: { value: 'a' } })

      await wrapper.setProps({ value: 'b' })
      await nextTick()

      expect(visibleText(wrapper)).toBe('b')
      expect(rolling(wrapper)).toHaveLength(0)
      expect(wrapper.find('.m-rolling-text__char--out').exists()).toBe(false)
    })
  })

  describe('when the value switches between text and number', () => {
    it('then the characters are rebuilt', async () => {
      const wrapper = mount(MazRollingText, { props: { value: 'ab' } })

      await wrapper.setProps({ value: 12 })

      expect(visibleText(wrapper)).toBe('12')
      expect(wrapper.classes()).toContain('m-rolling-text--numeric')
    })
  })

  describe('when the text is Latin', () => {
    it('then the direction is left to right whatever the page', () => {
      const wrapper = mount(MazRollingText, { props: { value: 'Vendredi 20 mars' } })

      expect(wrapper.attributes('dir')).toBe('ltr')
    })
  })

  describe('when the text is Arabic', () => {
    it('then the direction is right to left', () => {
      const wrapper = mount(MazRollingText, { props: { value: 'مارس' } })

      expect(wrapper.attributes('dir')).toBe('rtl')
    })
  })

  describe('when the text is Hebrew', () => {
    it('then the direction is right to left', () => {
      const wrapper = mount(MazRollingText, { props: { value: 'מרץ' } })

      expect(wrapper.attributes('dir')).toBe('rtl')
    })
  })

  describe('when the text starts with digits then Hebrew letters', () => {
    it('then the first strong character decides', () => {
      const wrapper = mount(MazRollingText, { props: { value: '20 מרץ' } })

      expect(wrapper.attributes('dir')).toBe('rtl')
    })
  })

  describe('when the value is a number or has no letters', () => {
    it('then the direction is left to right', () => {
      const numeric = mount(MazRollingText, { props: { value: 2026 } })
      const empty = mount(MazRollingText, { props: { value: '' } })

      expect(numeric.attributes('dir')).toBe('ltr')
      expect(empty.attributes('dir')).toBe('ltr')
    })
  })
})
