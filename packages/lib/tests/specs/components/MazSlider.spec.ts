import MazSlider from '@components/MazSlider.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('given MazSlider component', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('when mounted with single value', () => {
    beforeEach(() => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: 25,
          min: 0,
          max: 100,
          step: 1,
        },
      })
    })

    it('then it displays the correct value', () => {
      // @ts-expect-error - modelValue is private
      expect(wrapper.vm.modelValue).toBe(25)
      expect(wrapper.find('.m-slider__btn span').text()).toBe('25')
    })

    it('then it has correct accessibility attributes', () => {
      const slider = wrapper.find('[role="slider"]')
      expect(slider.attributes('aria-valuenow')).toBe('25')
      expect(slider.attributes('aria-valuemin')).toBe('0')
      expect(slider.attributes('aria-valuemax')).toBe('100')
    })
  })

  describe('when mounted with multiple values', () => {
    beforeEach(() => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: [25, 50, 75],
          labels: ['Small', 'Middle', 'Big'],
          min: 0,
          max: 100,
        },
      })
    })

    it('then it displays all values', () => {
      // @ts-expect-error - modelValue is private
      expect(wrapper.vm.modelValue).toStrictEqual([25, 50, 75])
      const buttons = wrapper.findAll('.m-slider__btn span')
      expect(buttons).toHaveLength(3)
      expect(buttons[0].text()).toBe('25')
      expect(buttons[1].text()).toBe('50')
      expect(buttons[2].text()).toBe('75')
    })

    it('then it displays labels correctly', () => {
      const buttons = wrapper.findAll('.m-slider__btn')
      expect(buttons[0].attributes('data-label')).toBe('Small')
      expect(buttons[1].attributes('data-label')).toBe('Middle')
      expect(buttons[2].attributes('data-label')).toBe('Big')
    })
  })

  describe('when value is outside range', () => {
    beforeEach(() => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: 150,
          min: 0,
          max: 100,
        },
      })
    })

    it('then it clamps value to maximum', async () => {
      await nextTick()
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      const emittedEvents = wrapper.emitted('update:model-value')
      expect(emittedEvents?.[0][0]).toBe(100)
    })
  })

  describe('when value is below minimum', () => {
    beforeEach(() => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: -10,
          min: 0,
          max: 100,
        },
      })
    })

    it('then it clamps value to minimum', async () => {
      await nextTick()
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      const emittedEvents = wrapper.emitted('update:model-value')
      expect(emittedEvents?.[0][0]).toBe(0)
    })
  })

  describe('when noDivider prop is true', () => {
    beforeEach(() => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: [25, 75],
          noDivider: true,
        },
      })
    })

    it('then it does not render dividers', () => {
      const dividers = wrapper.findAll('.m-slider__divider')
      expect(dividers).toHaveLength(0)
    })
  })

  describe('when size prop is provided', () => {
    beforeEach(() => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: 50,
          size: '2rem',
        },
      })
    })

    it('then it applies the size style', () => {
      const slider = wrapper.find('.m-slider')
      expect(slider.attributes('style')).toContain('font-size: 2rem')
    })
  })

  describe('when color prop is provided', () => {
    beforeEach(() => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: 50,
          color: 'secondary',
        },
      })
    })

    it('then it applies the color class', () => {
      const slider = wrapper.find('.m-slider')
      expect(slider.classes()).toContain('m-slider--secondary')
    })
  })

  describe('when button is focused', () => {
    beforeEach(async () => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: 50,
        },
      })
      const button = wrapper.find('.m-slider__btn')
      await button.trigger('focus')
    })

    it('then it activates the cursor', () => {
      const button = wrapper.find('.m-slider__btn')
      expect(button.classes()).toContain('active-cursor')
    })
  })

  describe('when button is blurred', () => {
    beforeEach(async () => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: 50,
        },
      })
      const button = wrapper.find('.m-slider__btn')
      await button.trigger('focus')
      await button.trigger('blur')
    })

    it('then it deactivates the cursor', () => {
      const button = wrapper.find('.m-slider__btn')
      expect(button.classes()).not.toContain('active-cursor')
    })
  })
})
