import MazRating from '@components/MazRating.vue'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const reduced = ref(false)

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: reduced }),
}))

function radios(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('input[type="radio"]')
}

describe('given a MazRating', () => {
  beforeEach(() => {
    reduced.value = false
  })

  describe('when it renders with the defaults', () => {
    it('then it is a radiogroup of 5 radios', () => {
      const wrapper = mount(MazRating, { props: { modelValue: 3 } })

      expect(wrapper.attributes('role')).toBe('radiogroup')
      expect(radios(wrapper)).toHaveLength(5)
    })

    it('then only the current value is checked', () => {
      const wrapper = mount(MazRating, { props: { modelValue: 3 } })

      expect(radios(wrapper).map(radio => (radio.element as HTMLInputElement).checked)).toEqual([false, false, true, false, false])
    })

    it('then the icons up to the value are lit', () => {
      const wrapper = mount(MazRating, { props: { modelValue: 2 } })

      expect(wrapper.findAll('.m-rating__item.--on')).toHaveLength(2)
    })

    it('then no radio is checked without a value', () => {
      const wrapper = mount(MazRating)

      expect(radios(wrapper).every(radio => !(radio.element as HTMLInputElement).checked)).toBe(true)
    })

    it('then the radios share one name', () => {
      const wrapper = mount(MazRating, { props: { name: 'quality' } })

      expect(new Set(radios(wrapper).map(radio => radio.attributes('name')))).toEqual(new Set(['quality']))
    })
  })

  describe('when max is set', () => {
    it('then it renders as many radios', () => {
      const wrapper = mount(MazRating, { props: { max: 3 } })

      expect(radios(wrapper)).toHaveLength(3)
    })
  })

  describe('when the user picks a radio', () => {
    it('then it emits the value', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 1 } })

      await radios(wrapper)[3]!.setValue(true)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([4])
    })

    it('then it does not emit the current value again', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 4 } })

      await radios(wrapper)[3]!.trigger('change')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when it is clearable', () => {
    it('then clicking the current value emits null', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 4, clearable: true } })

      await radios(wrapper)[3]!.trigger('click')

      expect(wrapper.emitted('update:model-value')).toEqual([[null]])
    })

    it('then clicking another value emits it', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 4, clearable: true } })

      await radios(wrapper)[1]!.trigger('click')
      await radios(wrapper)[1]!.trigger('change')

      expect(wrapper.emitted('update:model-value')).toEqual([[2]])
    })

    it('then the change event of the current value does not emit twice', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 4, clearable: true } })

      await radios(wrapper)[3]!.trigger('change')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when it is not clearable', () => {
    it('then clicking the current value emits nothing', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 4 } })

      await radios(wrapper)[3]!.trigger('click')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when the pointer is over an icon', () => {
    it('then the icons up to it light up and they go back on leave', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 1 } })

      await wrapper.findAll('.m-rating__item')[3]!.trigger('mouseenter')
      expect(wrapper.findAll('.m-rating__item.--on')).toHaveLength(4)

      await wrapper.trigger('mouseleave')
      expect(wrapper.findAll('.m-rating__item.--on')).toHaveLength(1)
    })

    it('then it does nothing when disabled', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 1, disabled: true } })

      await wrapper.findAll('.m-rating__item')[3]!.trigger('mouseenter')

      expect(wrapper.findAll('.m-rating__item.--on')).toHaveLength(1)
    })

    it('then the icons lit later get a stagger delay', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 0 } })

      await wrapper.findAll('.m-rating__item')[3]!.trigger('mouseenter')

      expect(wrapper.findAll('.m-rating__fill')[3]!.attributes('style')).toContain('transition-delay: 90ms')
      expect(wrapper.findAll('.m-rating__fill')[0]!.attributes('style')).toContain('transition-delay: 0ms')
    })

    it('then there is no delay with reduced motion', async () => {
      reduced.value = true
      const wrapper = mount(MazRating)

      await wrapper.findAll('.m-rating__item')[3]!.trigger('mouseenter')

      expect(wrapper.findAll('.m-rating__fill')[3]!.attributes('style')).toContain('transition-delay: 0ms')
    })
  })

  describe('when it is disabled', () => {
    it('then the radios are disabled and nothing is emitted', async () => {
      const wrapper = mount(MazRating, { props: { disabled: true } })

      expect(radios(wrapper).every(radio => radio.attributes('disabled') !== undefined)).toBe(true)
      await radios(wrapper)[0]!.trigger('change')
      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when it is readonly', () => {
    it('then it is an image without radios', () => {
      const wrapper = mount(MazRating, { props: { modelValue: 4.3, readonly: true } })

      expect(wrapper.attributes('role')).toBe('img')
      expect(radios(wrapper)).toHaveLength(0)
    })

    it('then the fill is clipped to the decimal part', () => {
      const wrapper = mount(MazRating, { props: { modelValue: 4.3, readonly: true } })
      const fills = wrapper.findAll('.m-rating__fill')

      expect(fills[3]!.attributes('style')).toContain('inline-size: 100%')
      expect(fills[4]!.attributes('style')).toMatch(/inline-size: (29\.9|30)/)
    })

    it('then the label includes the group name and the text of the nearest label', () => {
      const wrapper = mount(MazRating, { props: { modelValue: 4.3, readonly: true, labels: ['a', 'b', 'c', 'd', 'e'], label: 'Quality' } })

      expect(wrapper.attributes('aria-label')).toContain('Quality')
      expect(wrapper.attributes('aria-label')).toContain('d')
    })

    it('then the pointer does not light anything up', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 1, readonly: true } })

      await wrapper.findAll('.m-rating__item')[3]!.trigger('mouseenter')

      expect(wrapper.findAll('.m-rating__item.--on')).toHaveLength(1)
    })
  })

  describe('when labels are given', () => {
    it('then the label of the value is shown and the radios carry it', () => {
      const wrapper = mount(MazRating, { props: { modelValue: 2, labels: ['Bad', 'Fair', 'Good', 'Great', 'Perfect'] } })

      expect(wrapper.find('.m-rating__label').text()).toContain('Fair')
      expect(radios(wrapper)[1]!.attributes('aria-label')).toContain('Fair')
    })

    it('then the label follows the hovered icon', async () => {
      const wrapper = mount(MazRating, { props: { modelValue: 1, labels: ['Bad', 'Fair', 'Good', 'Great', 'Perfect'] } })

      await wrapper.findAll('.m-rating__item')[4]!.trigger('mouseenter')

      expect(wrapper.find('.m-rating__label').text()).toContain('Perfect')
    })

    it('then no label is shown without labels', () => {
      const wrapper = mount(MazRating, { props: { modelValue: 2 } })

      expect(wrapper.find('.m-rating__label').exists()).toBe(false)
    })
  })

  describe('when the variant is scale', () => {
    it('then it renders the boxes from min to max', () => {
      const wrapper = mount(MazRating, { props: { variant: 'scale', min: 0, max: 10, modelValue: 7 } })

      expect(wrapper.findAll('.m-rating__box')).toHaveLength(11)
      expect(wrapper.findAll('.m-rating__box-text').map(box => box.text())[0]).toBe('0')
      expect(wrapper.findAll('.m-rating__item.--on')).toHaveLength(1)
    })

    it('then the lowest value is 1 by default', () => {
      const wrapper = mount(MazRating, { props: { variant: 'scale', max: 5 } })

      expect(wrapper.findAll('.m-rating__box-text').map(box => box.text())).toEqual(['1', '2', '3', '4', '5'])
    })

    it('then it shows the end labels', () => {
      const wrapper = mount(MazRating, { props: { variant: 'scale', max: 5, minLabel: 'Never', maxLabel: 'Always' } })

      expect(wrapper.find('.m-rating__ends').text()).toContain('Never')
      expect(wrapper.find('.m-rating__ends').text()).toContain('Always')
    })

    it('then the first box can be picked', async () => {
      const wrapper = mount(MazRating, { props: { variant: 'scale', min: 0, max: 10 } })

      await radios(wrapper)[0]!.trigger('change')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([0])
    })
  })
})
