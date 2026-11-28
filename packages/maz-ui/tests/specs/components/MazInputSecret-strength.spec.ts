import type { MazInputSecretProps } from '@components/MazInputSecret.vue'
import MazInputSecret from '@components/MazInputSecret.vue'
import { flushPromises, mount } from '@vue/test-utils'

async function mountComponent(props: Partial<MazInputSecretProps> = {}) {
  const wrapper = mount(MazInputSecret, { props: { label: 'Password', modelValue: '', strength: true, ...props } })
  await flushPromises()

  return wrapper
}

async function type(wrapper: Awaited<ReturnType<typeof mountComponent>>, value: string) {
  await wrapper.setProps({ modelValue: value })
  await flushPromises()
}

describe('given MazInputSecret with the strength option', () => {
  describe('when strength is not set', () => {
    it('then no meter is rendered', async () => {
      const wrapper = await mountComponent({ strength: false })

      expect(wrapper.find('.m-input-secret__strength').exists()).toBe(false)
      expect(wrapper.find('.m-input-secret').classes()).not.toContain('maz:flex-wrap')
    })
  })

  describe('when strength is true and the field is empty', () => {
    it('then the meter is empty and the five default rules are listed', async () => {
      const wrapper = await mountComponent()
      const meter = wrapper.find('[role="meter"]')

      expect(meter.attributes('aria-valuenow')).toBe('0')
      expect(meter.attributes('aria-valuetext')).toBeUndefined()
      expect(wrapper.findAll('.m-input-secret__rule')).toHaveLength(5)
      expect(wrapper.findAll('.m-input-secret__rule').every(rule => rule.attributes('data-passed') === 'false')).toBe(true)
    })

    it('then the input is described by the strength panel', async () => {
      const wrapper = await mountComponent()
      const describedBy = wrapper.find('input').attributes('aria-describedby')

      expect(wrapper.find(`#${describedBy}`).classes()).toContain('m-input-secret__strength')
    })
  })

  describe('when the secret gets stronger', () => {
    it('then a short secret scores 1 at most', async () => {
      const wrapper = await mountComponent()
      await type(wrapper, 'aB3$')

      expect(wrapper.find('[role="meter"]').attributes('aria-valuenow')).toBe('1')
    })

    it('then a secret following every rule scores 4', async () => {
      const wrapper = await mountComponent()
      await type(wrapper, 'abcDEF123$%^')

      expect(wrapper.find('[role="meter"]').attributes('aria-valuenow')).toBe('4')
      expect(wrapper.findAll('.m-input-secret__rule').every(rule => rule.attributes('data-passed') === 'true')).toBe(true)
    })

    it('then the level class follows the score', async () => {
      const wrapper = await mountComponent()
      await type(wrapper, 'abcDEF123$%^')

      expect(wrapper.find('.m-input-secret__strength').classes()).toContain('--level-4')
    })

    it('then the ratio of the bar follows the score', async () => {
      const wrapper = await mountComponent()
      await type(wrapper, 'abcdefgh')

      expect(wrapper.find('.m-input-secret__meter-bar').attributes('style')).toContain('--m-strength-ratio: 0.25')
    })

    it('then the strength event is emitted when the score changes', async () => {
      const wrapper = await mountComponent()
      await type(wrapper, 'abcDEF123$%^')

      expect(wrapper.emitted('strength')?.at(-1)).toEqual([4])
    })

    it('then the rules count unicode letters, digits and symbols', async () => {
      const wrapper = await mountComponent()
      await type(wrapper, 'éÉ1!')
      const passed = wrapper.findAll('.m-input-secret__rule').map(rule => rule.attributes('data-passed'))

      expect(passed).toEqual(['false', 'true', 'true', 'true', 'true'])
    })

    it('then each rule tells its state to screen readers', async () => {
      const wrapper = await mountComponent()
      await type(wrapper, 'abc')

      expect(wrapper.find('.m-input-secret__rule .maz\\:sr-only').exists()).toBe(true)
    })
  })

  describe('when the options are customized', () => {
    it('then custom rules replace the default ones', async () => {
      const wrapper = await mountComponent({
        strength: { rules: ['number', { label: 'No spaces', test: value => !value.includes(' ') }] },
      })
      await type(wrapper, 'abc1')

      const rules = wrapper.findAll('.m-input-secret__rule')

      expect(rules).toHaveLength(2)
      expect(rules[1].text()).toContain('No spaces')
      expect(rules.every(rule => rule.attributes('data-passed') === 'true')).toBe(true)
    })

    it('then the minimum length is configurable', async () => {
      const wrapper = await mountComponent({ strength: { minLength: 3, rules: ['length'] } })
      await type(wrapper, 'abc')

      expect(wrapper.find('[role="meter"]').attributes('aria-valuenow')).toBe('4')
    })

    it('then a custom score is used and clamped', async () => {
      const score = vi.fn().mockReturnValue(9)
      const wrapper = await mountComponent({ strength: { score } })
      await type(wrapper, 'x')

      expect(wrapper.find('[role="meter"]').attributes('aria-valuenow')).toBe('4')
      expect(score).toHaveBeenCalledWith('x', expect.arrayContaining([expect.objectContaining({ passed: expect.any(Boolean) })]))
    })

    it('then showRules false hides the list', async () => {
      const wrapper = await mountComponent({ strength: { showRules: false } })

      expect(wrapper.find('.m-input-secret__rules').exists()).toBe(false)
      expect(wrapper.find('[role="meter"]').exists()).toBe(true)
    })

    it('then an empty list of rules scores 0', async () => {
      const wrapper = await mountComponent({ strength: { rules: [], minLength: 0 } })
      await type(wrapper, 'abc')

      expect(wrapper.find('[role="meter"]').attributes('aria-valuenow')).toBe('0')
    })

    it('then animated false marks the panel as static', async () => {
      const wrapper = await mountComponent({ animated: false })

      expect(wrapper.find('.m-input-secret__strength').classes()).toContain('--static')
    })
  })

  describe('when a secret is saved', () => {
    it('then the meter is hidden while the secret is masked', async () => {
      const wrapper = await mountComponent({ saved: true })

      expect(wrapper.find('.m-input-secret__strength').exists()).toBe(false)
    })

    it('then the meter shows while replacing the secret', async () => {
      const wrapper = await mountComponent({ saved: true })
      await wrapper.find('.m-input-secret__replace').trigger('click')
      await flushPromises()

      expect(wrapper.find('.m-input-secret__strength').exists()).toBe(true)
    })
  })
})
