import MazCheckbox from '@components/MazCheckbox.vue'
import MazDropzone from '@components/MazDropzone.vue'
import MazInputCode from '@components/MazInputCode.vue'
import MazRadio from '@components/MazRadio.vue'
import MazRadioButtons from '@components/MazRadioButtons.vue'
import MazSegmented from '@components/MazSegmented.vue'
import MazSlider from '@components/MazSlider.vue'
import MazSwitch from '@components/MazSwitch.vue'
import { mount, shallowMount } from '@vue/test-utils'

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
]

describe('given the neutral color', () => {
  describe('when MazCheckbox is checked with color neutral', () => {
    const wrapper = mount(MazCheckbox, { props: { modelValue: true, color: 'neutral', name: 'check' } })

    it('then the fill is the neutral foreground and the check icon the neutral color', () => {
      const style = wrapper.attributes('style')
      expect(style).toContain('--checkbox-selected-color: var(--maz-neutral-foreground)')
      expect(wrapper.find('.check-icon').attributes('style')).toContain('color: var(--maz-neutral)')
    })

    it('then the box shadow uses the muted color', () => {
      expect(wrapper.attributes('style')).toContain('--checkbox-box-shadow-color: var(--maz-muted)')
    })
  })

  describe('when MazRadio is selected with color neutral', () => {
    const wrapper = mount(MazRadio, { props: { modelValue: 'a', value: 'a', name: 'radio', color: 'neutral' } })

    it('then the dot is the neutral foreground', () => {
      const style = wrapper.attributes('style')
      expect(style).toContain('--radio-selected-color: var(--maz-neutral-foreground)')
      expect(style).toContain('--radio-box-shadow: var(--maz-muted)')
    })
  })

  describe('when MazSwitch has color neutral', () => {
    const wrapper = mount(MazSwitch, { props: { modelValue: true, color: 'neutral' } })

    it('then the track is the neutral foreground and the thumb the neutral color', () => {
      const style = wrapper.attributes('style')
      expect(style).toContain('--switch-color: var(--maz-neutral-foreground)')
      expect(style).toContain('--switch-foreground: var(--maz-neutral)')
    })
  })

  describe('when MazSlider has color neutral', () => {
    const wrapper = mount(MazSlider, { props: { modelValue: 20, color: 'neutral' } })

    it('then the fill is the neutral foreground', () => {
      expect(wrapper.attributes('style')).toContain('--m-slider-color: var(--maz-neutral-foreground)')
    })
  })

  describe('when MazRadioButtons selects an option with color neutral', () => {
    const wrapper = mount(MazRadioButtons, {
      props: { options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], modelValue: 'a', color: 'neutral', selector: true },
    })

    it('then the selected option has the neutral background, text and a divider border', () => {
      const style = wrapper.find('.m-radio-buttons__items.--is-selected').attributes('style')
      expect(style).toContain('background-color: var(--maz-neutral)')
      expect(style).toContain('color: var(--maz-neutral-foreground)')
      expect(style).toContain('border-color: var(--maz-divider)')
    })

    it('then the selector bubble is graphite', () => {
      const style = wrapper.find('.m-radio-buttons__items__checkbox span').attributes('style')
      expect(style).toContain('background-color: var(--maz-neutral-foreground)')
      expect(style).toContain('color: var(--maz-neutral)')
    })
  })

  describe('when MazSegmented has color neutral', () => {
    const wrapper = mount(MazSegmented, { props: { options, modelValue: 'week', ariaLabel: 'Period', color: 'neutral' } })

    it('then the indicator has the neutral background and a divider border', () => {
      const indicator = wrapper.find('.m-segmented__indicator')
      expect(indicator.attributes('style')).toContain('background-color: var(--maz-neutral)')
      expect(indicator.classes()).toContain('maz:border-divider')
    })

    it('then the selected segment text is the neutral foreground', () => {
      expect(wrapper.findAll('[role="radio"]')[1].attributes('style')).toContain('color: var(--maz-neutral-foreground)')
    })
  })

  describe('when MazInputCode has color neutral', () => {
    const wrapper = shallowMount(MazInputCode, { props: { color: 'neutral' } })

    it('then the focus border is the neutral foreground', () => {
      expect(wrapper.attributes('style')).toContain('--input-border-color: var(--maz-neutral-foreground)')
    })
  })

  describe('when MazDropzone has color neutral', () => {
    const wrapper = shallowMount(MazDropzone, { props: { color: 'neutral' } })

    it('then the active color is the neutral foreground', () => {
      expect(wrapper.find('.m-dropzone').attributes('style')).toContain('--active-color: var(--maz-neutral-foreground)')
    })
  })
})
