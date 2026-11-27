import MazInputSecret from '@components/MazInputSecret.vue'
import { flushPromises, mount } from '@vue/test-utils'

async function mountComponent(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazInputSecret, { props: { label: 'API key', ...props } })
  await flushPromises()
  return wrapper
}

describe('given MazInputSecret', () => {
  describe('when no secret is saved', () => {
    it('then it renders a password input without actions', async () => {
      const wrapper = await mountComponent()

      expect(wrapper.find('input').attributes('type')).toBe('password')
      expect(wrapper.find('.m-input-secret__actions').exists()).toBe(false)
    })

    it('then it emits the typed secret', async () => {
      const wrapper = await mountComponent()

      await wrapper.find('input').setValue('s3cret')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['s3cret'])
    })

    it('then it uses a new-password autocomplete', async () => {
      const wrapper = await mountComponent()

      expect(wrapper.find('input').attributes('autocomplete')).toBe('new-password')
    })
  })

  describe('when a secret is saved', () => {
    it('then it renders a masked readonly field', async () => {
      const wrapper = await mountComponent({ saved: true })
      const input = wrapper.find('input')

      expect(input.attributes('readonly')).toBeDefined()
      expect(input.element.value).toMatch(/^•+$/)
      expect(wrapper.find('.m-input-secret').classes()).toContain('--saved')
    })

    it('then it describes the field to screen readers', async () => {
      const wrapper = await mountComponent({ saved: true })

      const describedBy = wrapper.find('input').attributes('aria-describedby')
      expect(wrapper.find(`#${describedBy}`).text()).toBe('test')
    })

    it('then it shows the replace and clear buttons', async () => {
      const wrapper = await mountComponent({ saved: true })

      expect(wrapper.find('.m-input-secret__replace').text()).toBe('test')
      expect(wrapper.find('.m-input-secret__clear').text()).toBe('test')
    })

    it('then it emits clear', async () => {
      const wrapper = await mountComponent({ saved: true })

      await wrapper.find('.m-input-secret__clear').trigger('click')

      expect(wrapper.emitted('clear')).toHaveLength(1)
    })

    it('then it does not emit a value', async () => {
      const wrapper = await mountComponent({ saved: true })

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when replace is clicked', () => {
    it('then it shows an empty password input with a cancel button', async () => {
      const wrapper = await mountComponent({ saved: true })

      await wrapper.find('.m-input-secret__replace').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('replace')).toHaveLength(1)
      expect(wrapper.find('input').attributes('type')).toBe('password')
      expect(wrapper.find('.m-input-secret__replace').exists()).toBe(false)
      expect(wrapper.find('.m-input-secret__cancel').text()).toBe('test')
    })

    it('then it goes back to the masked state and resets the value on cancel', async () => {
      const wrapper = await mountComponent({ saved: true })
      await wrapper.find('.m-input-secret__replace').trigger('click')
      await flushPromises()

      await wrapper.find('.m-input-secret__cancel').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('cancel')).toHaveLength(1)
      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([''])
      expect(wrapper.find('input').attributes('readonly')).toBeDefined()
    })
  })

  describe('when saved changes', () => {
    it('then it leaves the replace mode', async () => {
      const wrapper = await mountComponent({ saved: true })
      await wrapper.find('.m-input-secret__replace').trigger('click')
      await flushPromises()

      await wrapper.setProps({ saved: false })
      await wrapper.setProps({ saved: true })
      await flushPromises()

      expect(wrapper.find('input').attributes('readonly')).toBeDefined()
    })
  })

  describe('when custom texts are given', () => {
    it('then it uses them', async () => {
      const wrapper = await mountComponent({ saved: true, replaceLabel: 'Change', clearLabel: 'Remove', savedText: 'Hidden' })

      expect(wrapper.find('.m-input-secret__replace').text()).toBe('Change')
      expect(wrapper.find('.m-input-secret__clear').text()).toBe('Remove')
      expect(wrapper.text()).toContain('Hidden')
    })
  })

  describe('when disabled', () => {
    it('then it disables the buttons', async () => {
      const wrapper = await mountComponent({ saved: true, disabled: true })

      expect(wrapper.find('.m-input-secret__replace').attributes('disabled')).toBeDefined()
    })
  })
})
