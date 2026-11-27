import MazInputKeyValue from '@components/MazInputKeyValue.vue'
import { flushPromises, mount } from '@vue/test-utils'

async function mountComponent(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazInputKeyValue, { props })
  await flushPromises()
  return wrapper
}

function lastEmitted(wrapper: Awaited<ReturnType<typeof mountComponent>>) {
  return wrapper.emitted('update:model-value')?.at(-1)?.[0]
}

describe('given MazInputKeyValue', () => {
  describe('when rendered with an object', () => {
    it('then it renders one row per pair', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1', B: '2' } })

      const inputs = wrapper.findAll('input')
      expect(inputs.map(input => input.element.value)).toEqual(['A', '1', 'B', '2'])
    })

    it('then it renders only the add button without pairs', async () => {
      const wrapper = await mountComponent()

      expect(wrapper.findAll('.m-input-key-value__row')).toHaveLength(0)
      expect(wrapper.find('.m-input-key-value__add').exists()).toBe(true)
    })

    it('then it exposes a group named by the label', async () => {
      const wrapper = await mountComponent({ label: 'Variables' })

      expect(wrapper.attributes('role')).toBe('group')
      expect(wrapper.attributes('aria-label')).toBe('Variables')
    })

    it('then it names the group by the top label', async () => {
      const wrapper = await mountComponent({ topLabel: 'Env' })

      const labelId = wrapper.find('.m-input-key-value__top-label').attributes('id')
      expect(wrapper.attributes('aria-labelledby')).toBe(labelId)
    })

    it('then it renders the assistive text', async () => {
      const wrapper = await mountComponent({ assistiveText: 'Help' })

      expect(wrapper.find('.m-input-key-value__assistive-text').text()).toBe('Help')
    })
  })

  describe('when a pair is added', () => {
    it('then it adds an empty row and does not emit an incomplete pair', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' } })

      await wrapper.find('.m-input-key-value__add').trigger('click')

      expect(wrapper.findAll('.m-input-key-value__row')).toHaveLength(2)
      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })

    it('then it emits the object once the key is typed', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' } })
      await wrapper.find('.m-input-key-value__add').trigger('click')

      const inputs = wrapper.findAll('input')
      await inputs[2].setValue('B')
      await inputs[3].setValue('2')

      expect(lastEmitted(wrapper)).toEqual({ A: '1', B: '2' })
    })
  })

  describe('when a pair is removed', () => {
    it('then it emits the object without it', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1', B: '2' } })

      await wrapper.findAll('.m-input-key-value__remove')[0].trigger('click')

      expect(lastEmitted(wrapper)).toEqual({ B: '2' })
      expect(wrapper.findAll('.m-input-key-value__row')).toHaveLength(1)
    })
  })

  describe('when a key is edited', () => {
    it('then it renames the key and keeps the value', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' } })

      await wrapper.findAll('input')[0].setValue('Z')

      expect(lastEmitted(wrapper)).toEqual({ Z: '1' })
    })

    it('then it trims the key', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' } })

      await wrapper.findAll('input')[0].setValue('  Z  ')

      expect(lastEmitted(wrapper)).toEqual({ Z: '1' })
    })

    it('then a __proto__ key is kept as an own pair', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' } })

      await wrapper.findAll('input')[0].setValue('__proto__')

      expect(Object.entries(lastEmitted(wrapper) as Record<string, string>)).toEqual([['__proto__', '1']])
    })
  })

  describe('when two keys are the same', () => {
    it('then it flags the second one and keeps only the first value', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1', B: '2' } })

      await wrapper.findAll('input')[2].setValue('A')

      expect(lastEmitted(wrapper)).toEqual({ A: '1' })
      expect(wrapper.findAll('.m-input-bottom-text')).toHaveLength(1)
    })

    it('then it clears the error once the key is unique', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1', B: '2' } })
      await wrapper.findAll('input')[2].setValue('A')

      await wrapper.findAll('input')[2].setValue('C')

      expect(wrapper.findAll('.m-input-bottom-text')).toHaveLength(0)
      expect(lastEmitted(wrapper)).toEqual({ A: '1', C: '2' })
    })
  })

  describe('when the model changes from outside', () => {
    it('then it rebuilds the rows', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' } })

      await wrapper.setProps({ modelValue: { X: '9', Y: '8' } })

      expect(wrapper.findAll('input').map(input => input.element.value)).toEqual(['X', '9', 'Y', '8'])
    })

    it('then it keeps the incomplete rows when the model matches what was emitted', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' } })
      await wrapper.find('.m-input-key-value__add').trigger('click')

      await wrapper.setProps({ modelValue: { A: '1' } })

      expect(wrapper.findAll('.m-input-key-value__row')).toHaveLength(2)
    })
  })

  describe('when max-items is reached', () => {
    it('then it hides the add button', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' }, maxItems: 1 })

      expect(wrapper.find('.m-input-key-value__add').exists()).toBe(false)
    })
  })

  describe('when disabled', () => {
    it('then it hides the add button and disables the fields', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' }, disabled: true })

      expect(wrapper.find('.m-input-key-value__add').exists()).toBe(false)
      expect(wrapper.findAll('input').every(input => input.element.disabled)).toBe(true)
    })
  })

  describe('when custom labels are given', () => {
    it('then it uses them on the fields and the add button', async () => {
      const wrapper = await mountComponent({ modelValue: { A: '1' }, keyLabel: 'Name', valueLabel: 'Content', addLabel: 'New variable' })

      expect(wrapper.text()).toContain('Name')
      expect(wrapper.text()).toContain('Content')
      expect(wrapper.find('.m-input-key-value__add').text()).toBe('New variable')
    })
  })

  describe('when addRow is exposed', () => {
    it('then it adds a row', async () => {
      const wrapper = await mountComponent()

      ;(wrapper.vm as unknown as { addRow: () => void }).addRow()
      await flushPromises()

      expect(wrapper.findAll('.m-input-key-value__row')).toHaveLength(1)
    })
  })
})
