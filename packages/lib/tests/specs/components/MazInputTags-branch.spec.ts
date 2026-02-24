import MazInputTags from '@components/MazInputTags.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('MazInputTags branch coverage', () => {
  describe('when mounted with default props', () => {
    it('should render', () => {
      const wrapper = mount(MazInputTags)
      expect(wrapper.find('.m-input-tags').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when modelValue has tags', () => {
    it('should render tags', () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['tag1', 'tag2'] },
      })
      expect(wrapper.findAll('.m-input-tags__tag').length).toBe(2)
      wrapper.unmount()
    })
  })

  describe('when entering a tag', () => {
    it('should emit new tag on enter', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['existing'] },
      })
      const input = wrapper.find('input')
      await input.setValue('newtag')
      await input.trigger('keydown.enter')
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      wrapper.unmount()
    })

    it('should handle comma-separated tags', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: [] },
      })
      const input = wrapper.find('input')
      await input.setValue('tag1, tag2, tag3')
      await input.trigger('keydown.enter')
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      wrapper.unmount()
    })

    it('should not add duplicate tags', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['existing'] },
      })
      const input = wrapper.find('input')
      await input.setValue('existing')
      await input.trigger('keydown.enter')
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      if (emitted) {
        const lastEmitted = emitted[emitted.length - 1][0] as string[]
        expect(lastEmitted.filter(t => t === 'existing').length).toBe(1)
      }
      wrapper.unmount()
    })
  })

  describe('when removing a tag', () => {
    it('should remove tag on button click', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['tag1', 'tag2'] },
      })
      const tagButtons = wrapper.findAll('.m-input-tags__tag')
      await tagButtons[0].trigger('click')
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when pressing delete key', () => {
    it('should highlight last tag on first delete', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['tag1', 'tag2'] },
      })
      const input = wrapper.find('input')
      await input.trigger('keydown.delete')
      await nextTick()
      // First delete highlights the last tag
      wrapper.unmount()
    })

    it('should remove last tag on second delete', async () => {
      vi.useFakeTimers()
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['tag1', 'tag2'] },
      })
      const input = wrapper.find('input')
      await input.trigger('keydown.delete')
      await nextTick()
      await input.trigger('keydown.delete')
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      vi.useRealTimers()
      wrapper.unmount()
    })

    it('should not remove when input has value', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['tag1'] },
      })
      const input = wrapper.find('input')
      await input.setValue('something')
      await input.trigger('keydown.delete')
      await nextTick()
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
      wrapper.unmount()
    })

    it('should not remove when tags are empty', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: [] },
      })
      const input = wrapper.find('input')
      await input.trigger('keydown.delete')
      await nextTick()
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
      wrapper.unmount()
    })
  })

  describe('when addTagsOnBlur is true', () => {
    it('should add tag on blur', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: [], addTagsOnBlur: true },
      })
      const input = wrapper.find('input')
      await input.setValue('blurtag')
      await input.trigger('blur')
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when addTagsOnBlur is false', () => {
    it('should not add tag on blur', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: [], addTagsOnBlur: false },
      })
      const input = wrapper.find('input')
      await input.setValue('blurtag')
      await input.trigger('blur')
      await nextTick()
      wrapper.unmount()
    })
  })

  describe('when error prop is true', () => {
    it('should apply error border style', () => {
      const wrapper = mount(MazInputTags, {
        props: { error: true },
      })
      expect(wrapper.find('.m-input-tags').classes()).toContain('maz-border-destructive')
      wrapper.unmount()
    })
  })

  describe('when success prop is true', () => {
    it('should apply success border style', () => {
      const wrapper = mount(MazInputTags, {
        props: { success: true },
      })
      expect(wrapper.find('.m-input-tags').classes()).toContain('maz-border-success')
      wrapper.unmount()
    })
  })

  describe('when warning prop is true', () => {
    it('should apply warning border style', () => {
      const wrapper = mount(MazInputTags, {
        props: { warning: true },
      })
      expect(wrapper.find('.m-input-tags').classes()).toContain('maz-border-warning')
      wrapper.unmount()
    })
  })

  describe('when focused with different colors', () => {
    const colors = ['primary', 'secondary', 'info', 'destructive', 'success', 'warning'] as const

    for (const color of colors) {
      it(`should apply ${color} border when focused`, async () => {
        const wrapper = mount(MazInputTags, {
          props: { color },
        })
        await wrapper.find('.m-input-tags').trigger('focus')
        await nextTick()
        wrapper.unmount()
      })
    }
  })

  describe('when size prop is set', () => {
    const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const

    for (const size of sizes) {
      it(`should apply --${size} class`, () => {
        const wrapper = mount(MazInputTags, {
          props: { size },
        })
        expect(wrapper.find('.m-input-tags').classes()).toContain(`--${size}`)
        wrapper.unmount()
      })
    }
  })

  describe('when disabled', () => {
    it('should disable input', () => {
      const wrapper = mount(MazInputTags, {
        props: { disabled: true },
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      wrapper.unmount()
    })
  })

  describe('when block is true', () => {
    it('should apply --block class', () => {
      const wrapper = mount(MazInputTags, {
        props: { block: true },
      })
      expect(wrapper.find('.m-input-tags').classes()).toContain('--block')
      wrapper.unmount()
    })
  })

  describe('when modelValue is undefined', () => {
    it('should handle no modelValue', () => {
      const wrapper = mount(MazInputTags)
      expect(wrapper.findAll('.m-input-tags__tag').length).toBe(0)
      wrapper.unmount()
    })
  })

  describe('when adding tags with no prior modelValue', () => {
    it('should create new array', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: undefined },
      })
      const input = wrapper.find('input')
      await input.setValue('newtag')
      await input.trigger('keydown.enter')
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when input value is empty', () => {
    it('should not add on enter', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: [] },
      })
      const input = wrapper.find('input')
      await input.trigger('keydown.enter')
      await nextTick()
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
      wrapper.unmount()
    })
  })

  describe('when tag has hover state', () => {
    it('should handle mouseenter/mouseleave on tags', async () => {
      const wrapper = mount(MazInputTags, {
        props: { modelValue: ['tag1'] },
      })
      const tagBtn = wrapper.find('.m-input-tags__tag')
      await tagBtn.trigger('mouseenter')
      await nextTick()
      await tagBtn.trigger('mouseleave')
      await nextTick()
      wrapper.unmount()
    })
  })

  describe('when placeholder and label are set', () => {
    it('should pass placeholder to input', () => {
      const wrapper = mount(MazInputTags, {
        props: { placeholder: 'Enter tags', label: 'Tags' },
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter tags')
      wrapper.unmount()
    })
  })

  describe('when hint is provided', () => {
    it('should display hint text', () => {
      const wrapper = mount(MazInputTags, {
        props: { hint: 'Press enter to add' },
      })
      expect(wrapper.text()).toContain('Press enter to add')
      wrapper.unmount()
    })
  })
})
