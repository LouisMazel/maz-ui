import MazInlineEdit from '@components/MazInlineEdit.vue'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: { value: false } }),
}))

function mountEdit(props: Record<string, unknown> = {}) {
  return mount(MazInlineEdit, { props: { modelValue: 'Title', ...props }, attachTo: document.body })
}

async function startEditing(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.m-inline-edit__display').trigger('click')
  await flushPromises()

  return wrapper.find<HTMLInputElement>('.m-inline-edit__input')
}

describe('given a MazInlineEdit', () => {
  describe('when it renders', () => {
    it('then it shows the text in a button, without a field', () => {
      const wrapper = mountEdit()

      expect(wrapper.find('button.m-inline-edit__display').text()).toContain('Title')
      expect(wrapper.find('input').exists()).toBe(false)
      wrapper.unmount()
    })

    it('then it uses the tag of the text', () => {
      const wrapper = mountEdit({ tag: 'h1' })

      expect(wrapper.element.tagName).toBe('H1')
      wrapper.unmount()
    })

    it('then it shows the placeholder when the text is empty', () => {
      const wrapper = mountEdit({ modelValue: '', placeholder: 'Untitled' })

      expect(wrapper.find('.m-inline-edit__display').classes()).toContain('--empty')
      expect(wrapper.find('.m-inline-edit__display').text()).toContain('Untitled')
      wrapper.unmount()
    })

    it('then the pencil hint is present', () => {
      const wrapper = mountEdit()

      expect(wrapper.find('.m-inline-edit__hint').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when the text changes from the outside', () => {
    it('then it is shown', async () => {
      const wrapper = mountEdit()

      await wrapper.setProps({ modelValue: 'Other' })

      expect(wrapper.find('.m-inline-edit__display').text()).toContain('Other')
      wrapper.unmount()
    })

    it('then it is not replaced while editing', async () => {
      const wrapper = mountEdit()
      await startEditing(wrapper)

      await wrapper.setProps({ modelValue: 'Other' })

      expect(wrapper.find('.m-inline-edit__display').text()).toContain('Title')
      wrapper.unmount()
    })
  })

  describe('when the button is clicked', () => {
    it('then the field replaces it, focused, with the text', async () => {
      const wrapper = mountEdit()
      const input = await startEditing(wrapper)

      expect(input.exists()).toBe(true)
      expect(input.element.value).toBe('Title')
      expect(document.activeElement).toBe(input.element)
      expect(wrapper.find('.m-inline-edit__display').classes()).toContain('--hidden')
      wrapper.unmount()
    })

    it('then the sizer follows the typed text', async () => {
      const wrapper = mountEdit()
      const input = await startEditing(wrapper)

      await input.setValue('A longer text')

      expect(wrapper.find('.m-inline-edit__sizer').text()).toBe('A longer text')
      wrapper.unmount()
    })

    it('then it does nothing when disabled', async () => {
      const wrapper = mountEdit({ disabled: true })

      await wrapper.find('.m-inline-edit__display').trigger('click')

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.find('.m-inline-edit__hint').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when F2 is pressed on the button', () => {
    it('then the field opens', async () => {
      const wrapper = mountEdit()

      await wrapper.find('.m-inline-edit__display').trigger('keydown', { key: 'F2' })
      await flushPromises()

      expect(wrapper.find('input').exists()).toBe(true)
      wrapper.unmount()
    })

    it('then another key does nothing', async () => {
      const wrapper = mountEdit()

      await wrapper.find('.m-inline-edit__display').trigger('keydown', { key: 'a' })

      expect(wrapper.find('input').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when Enter is pressed', () => {
    it('then the text is saved and the check is drawn', async () => {
      const wrapper = mountEdit()
      const input = await startEditing(wrapper)

      await input.setValue('New')
      await input.trigger('keydown', { key: 'Enter' })
      await flushPromises()

      expect(wrapper.emitted('update:model-value')).toEqual([['New']])
      expect(wrapper.emitted('submit')).toEqual([['New']])
      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).exists()).toBe(true)
      expect(document.activeElement).toBe(wrapper.find('.m-inline-edit__display').element)
      wrapper.unmount()
    })

    it('then an unchanged text only emits submit', async () => {
      const wrapper = mountEdit()
      const input = await startEditing(wrapper)

      await input.trigger('keydown', { key: 'Enter' })
      await flushPromises()

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      expect(wrapper.emitted('submit')).toEqual([['Title']])
      wrapper.unmount()
    })

    it('then the check goes away after a moment', async () => {
      vi.useFakeTimers()
      const wrapper = mountEdit()
      const input = await startEditing(wrapper)

      await input.trigger('keydown', { key: 'Enter' })
      await flushPromises()
      vi.advanceTimersByTime(2000)
      await flushPromises()

      expect(wrapper.find('.m-inline-edit__saved').exists()).toBe(false)
      vi.useRealTimers()
      wrapper.unmount()
    })

    it('then it is ignored while composing', async () => {
      const wrapper = mountEdit()
      const input = await startEditing(wrapper)

      await input.trigger('keydown', { key: 'Enter', isComposing: true })

      expect(wrapper.emitted('submit')).toBeUndefined()
      wrapper.unmount()
    })
  })

  describe('when validate fails', () => {
    it('then the message is shown, the field stays open and nothing is saved', async () => {
      const wrapper = mountEdit({ validate: (value: string) => value.length > 3 || 'Too short' })
      const input = await startEditing(wrapper)

      await input.setValue('ab')
      await input.trigger('keydown', { key: 'Enter' })
      await flushPromises()

      expect(wrapper.find('.m-inline-edit__error').text()).toBe('Too short')
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
      expect(wrapper.find('input').attributes('aria-describedby')).toBe(wrapper.find('.m-inline-edit__error').attributes('id'))
      expect(wrapper.emitted('submit')).toBeUndefined()
      wrapper.unmount()
    })

    it('then typing clears the message', async () => {
      const wrapper = mountEdit({ validate: () => 'Nope' })
      const input = await startEditing(wrapper)

      await input.trigger('keydown', { key: 'Enter' })
      await flushPromises()
      await input.setValue('abc')

      expect(wrapper.find('.m-inline-edit__error').exists()).toBe(false)
      wrapper.unmount()
    })

    it('then leaving the field restores the old text', async () => {
      const wrapper = mountEdit({ validate: () => 'Nope' })
      const input = await startEditing(wrapper)

      await input.setValue('abc')
      await input.trigger('blur')
      await flushPromises()

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.emitted('cancel')).toHaveLength(1)
      expect(wrapper.emitted('submit')).toBeUndefined()
      wrapper.unmount()
    })
  })

  describe('when Escape is pressed', () => {
    it('then the old text comes back and cancel is emitted', async () => {
      const wrapper = mountEdit()
      const input = await startEditing(wrapper)

      await input.setValue('Draft')
      await input.trigger('keydown', { key: 'Escape' })
      await flushPromises()

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.find('.m-inline-edit__display').text()).toContain('Title')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      wrapper.unmount()
    })
  })

  describe('when the field loses the focus', () => {
    it('then the text is saved', async () => {
      const wrapper = mountEdit()
      const input = await startEditing(wrapper)

      await input.setValue('Blurred')
      await input.trigger('blur')
      await flushPromises()

      expect(wrapper.emitted('update:model-value')).toEqual([['Blurred']])
      wrapper.unmount()
    })

    it('then the old text is restored with submit-on-blur off', async () => {
      const wrapper = mountEdit({ submitOnBlur: false })
      const input = await startEditing(wrapper)

      await input.setValue('Blurred')
      await input.trigger('blur')
      await flushPromises()

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      expect(wrapper.emitted('cancel')).toHaveLength(1)
      wrapper.unmount()
    })
  })
})
