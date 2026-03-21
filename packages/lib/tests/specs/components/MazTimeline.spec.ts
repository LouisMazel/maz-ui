import type { MazTimelineRoundedSize } from '@components/MazTimeline.vue'
import MazTimeline from '@components/MazTimeline.vue'
import { mount } from '@vue/test-utils'

const defaultSteps = [
  { title: 'Step 1', subtitle: 'First step' },
  { title: 'Step 2', subtitle: 'Second step' },
  { title: 'Step 3', subtitle: 'Third step' },
]

function mountTimeline(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MazTimeline, {
    props: {
      steps: defaultSteps,
      direction: 'horizontal' as const,
      ...props,
    },
    slots,
  })
}

describe('given MazTimeline component', () => {
  describe('when rendered with default props', () => {
    it('then it renders with m-reset-css class', () => {
      const wrapper = mountTimeline()

      expect(wrapper.classes()).toContain('m-reset-css')
    })

    it('then it renders the correct number of steps', () => {
      const wrapper = mountTimeline()

      expect(wrapper.findAll('.m-timeline-step')).toHaveLength(3)
    })

    it('then it has role="list" on root', () => {
      const wrapper = mountTimeline()

      expect(wrapper.attributes('role')).toBe('list')
    })

    it('then it has aria-label="Timeline" by default', () => {
      const wrapper = mountTimeline()

      expect(wrapper.attributes('aria-label')).toBe('Timeline')
    })

    it('then it shows step numbers by default', () => {
      const wrapper = mountTimeline()

      const numbers = wrapper.findAll('.m-timeline-step-number')
      expect(numbers).toHaveLength(3)
      expect(numbers[0]!.text()).toBe('1')
      expect(numbers[1]!.text()).toBe('2')
      expect(numbers[2]!.text()).toBe('3')
    })

    it('then it applies --md size class by default', () => {
      const wrapper = mountTimeline()

      expect(wrapper.classes()).toContain('--md')
    })

    it('then it applies --rounded-base class by default', () => {
      const wrapper = mountTimeline()

      expect(wrapper.classes()).toContain('--rounded-base')
    })

    it('then it applies --animated class by default', () => {
      const wrapper = mountTimeline()

      expect(wrapper.classes()).toContain('--animated')
    })

    it('then it renders N-1 connectors for N steps', () => {
      const wrapper = mountTimeline()

      expect(wrapper.findAll('.m-timeline-connector')).toHaveLength(2)
    })
  })

  describe('when rendered with direction prop', () => {
    it('then it applies --horizontal class when direction is horizontal', () => {
      const wrapper = mountTimeline({ direction: 'horizontal' })

      expect(wrapper.classes()).toContain('--horizontal')
      expect(wrapper.classes()).not.toContain('--vertical')
    })

    it('then it applies --vertical class when direction is vertical', async () => {
      const wrapper = mountTimeline({ direction: 'vertical' })

      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('--vertical')
      expect(wrapper.classes()).not.toContain('--horizontal')
    })
  })

  describe('when rendered with modelValue', () => {
    it('then it marks steps before modelValue as completed', () => {
      const wrapper = mountTimeline({ modelValue: 2 })

      const steps = wrapper.findAll('.m-timeline-step')
      expect(steps[0]!.classes()).toContain('--completed')
      expect(steps[1]!.classes()).toContain('--completed')
    })

    it('then it marks step at modelValue as active', () => {
      const wrapper = mountTimeline({ modelValue: 1 })

      const steps = wrapper.findAll('.m-timeline-step')
      expect(steps[1]!.classes()).toContain('--active')
    })

    it('then it marks steps after modelValue as pending', () => {
      const wrapper = mountTimeline({ modelValue: 0 })

      const steps = wrapper.findAll('.m-timeline-step')
      expect(steps[1]!.classes()).toContain('--pending')
      expect(steps[2]!.classes()).toContain('--pending')
    })

    it('then it sets aria-current="step" on active step', () => {
      const wrapper = mountTimeline({ modelValue: 1 })

      const steps = wrapper.findAll('.m-timeline-step')
      expect(steps[1]!.attributes('aria-current')).toBe('step')
      expect(steps[0]!.attributes('aria-current')).toBeUndefined()
      expect(steps[2]!.attributes('aria-current')).toBeUndefined()
    })
  })

  describe('when rendered with manual step states', () => {
    it('then it applies --error class when step.state is error', () => {
      const wrapper = mountTimeline({
        steps: [
          { title: 'Step 1', state: 'error' },
          { title: 'Step 2' },
        ],
      })

      expect(wrapper.findAll('.m-timeline-step')[0]!.classes()).toContain('--error')
    })

    it('then it applies --warning class when step.state is warning', () => {
      const wrapper = mountTimeline({
        steps: [
          { title: 'Step 1', state: 'warning' },
          { title: 'Step 2' },
        ],
      })

      expect(wrapper.findAll('.m-timeline-step')[0]!.classes()).toContain('--warning')
    })

    it('then manual state overrides modelValue-based state', () => {
      const wrapper = mountTimeline({
        modelValue: 2,
        steps: [
          { title: 'Step 1', state: 'error' },
          { title: 'Step 2' },
          { title: 'Step 3' },
        ],
      })

      const steps = wrapper.findAll('.m-timeline-step')
      expect(steps[0]!.classes()).toContain('--error')
      expect(steps[0]!.classes()).not.toContain('--completed')
    })
  })

  describe('when rendered with color prop', () => {
    it('then it applies color CSS variables for primary (default)', () => {
      const wrapper = mountTimeline()

      const style = wrapper.attributes('style')
      expect(style).toContain('--m-timeline-color: var(--maz-primary-700)')
      expect(style).toContain('--m-timeline-color-dark: var(--maz-primary-400)')
      expect(style).toContain('--m-timeline-bg: var(--maz-primary)')
      expect(style).toContain('--m-timeline-fg: var(--maz-primary-foreground)')
    })

    it('then it applies color CSS variables for success', () => {
      const wrapper = mountTimeline({ color: 'success' })

      const style = wrapper.attributes('style')
      expect(style).toContain('--m-timeline-color: var(--maz-success-700)')
      expect(style).toContain('--m-timeline-color-dark: var(--maz-success-400)')
      expect(style).toContain('--m-timeline-bg: var(--maz-success)')
      expect(style).toContain('--m-timeline-fg: var(--maz-success-foreground)')
    })
  })

  describe('when rendered with size prop', () => {
    it.each(['mini', 'xs', 'sm', 'md', 'lg', 'xl'])('then it applies --%s size class', (size) => {
      const wrapper = mountTimeline({ size })

      expect(wrapper.classes()).toContain(`--${size}`)
    })
  })

  describe('when rendered with roundedSize prop', () => {
    it.each([
      'none',
      'sm',
      'md',
      'base',
      'lg',
      'xl',
      '2xl',
      '3xl',
      'full',
    ] as MazTimelineRoundedSize[])('then it applies --rounded-%s class', (roundedSize) => {
      const wrapper = mountTimeline({ roundedSize })

      expect(wrapper.classes()).toContain(`--rounded-${roundedSize}`)
    })
  })

  describe('when rendered with clickable prop', () => {
    it('then it applies --clickable class when clickable is true', () => {
      const wrapper = mountTimeline({ clickable: true })

      expect(wrapper.classes()).toContain('--clickable')
    })

    it('then it emits update:modelValue on step click when clickable', async () => {
      const wrapper = mountTimeline({ clickable: true })

      await wrapper.findAll('.m-timeline-step')[1]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    })

    it('then it emits click-step with step data and index on click', async () => {
      const wrapper = mountTimeline({ clickable: true })

      await wrapper.findAll('.m-timeline-step')[1]!.trigger('click')

      expect(wrapper.emitted('click-step')).toEqual([
        [{ step: defaultSteps[1], index: 1 }],
      ])
    })

    it('then it does not emit on click when clickable is false', async () => {
      const wrapper = mountTimeline({ clickable: false })

      await wrapper.findAll('.m-timeline-step')[1]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('click-step')).toBeUndefined()
    })

    it('then it does not emit on click when step is disabled', async () => {
      const wrapper = mountTimeline({
        clickable: true,
        steps: [
          { title: 'Step 1' },
          { title: 'Step 2', disabled: true },
          { title: 'Step 3' },
        ],
      })

      await wrapper.findAll('.m-timeline-step')[1]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('click-step')).toBeUndefined()
    })
  })

  describe('when rendered with disabled steps', () => {
    it('then it applies --disabled class on disabled steps', () => {
      const wrapper = mountTimeline({
        steps: [
          { title: 'Step 1' },
          { title: 'Step 2', disabled: true },
          { title: 'Step 3' },
        ],
      })

      const steps = wrapper.findAll('.m-timeline-step')
      expect(steps[1]!.classes()).toContain('--disabled')
      expect(steps[0]!.classes()).not.toContain('--disabled')
    })

    it('then it sets aria-disabled on disabled steps', () => {
      const wrapper = mountTimeline({
        steps: [
          { title: 'Step 1' },
          { title: 'Step 2', disabled: true },
          { title: 'Step 3' },
        ],
      })

      const steps = wrapper.findAll('.m-timeline-step')
      expect(steps[1]!.attributes('aria-disabled')).toBe('true')
      expect(steps[0]!.attributes('aria-disabled')).toBeUndefined()
    })
  })

  describe('when rendered with showStepNumbers set to false', () => {
    it('then it hides step numbers', () => {
      const wrapper = mountTimeline({ showStepNumbers: false })

      expect(wrapper.findAll('.m-timeline-step-number')).toHaveLength(0)
    })
  })

  describe('when rendered with autoValidateSteps set to false', () => {
    it('then it does not show checkmark for completed steps', () => {
      const wrapper = mountTimeline({ autoValidateSteps: false, modelValue: 2 })

      expect(wrapper.findAll('.m-timeline-check-icon')).toHaveLength(0)
    })
  })

  describe('when rendered with step data', () => {
    it('then it renders title from step data', () => {
      const wrapper = mountTimeline()

      const titles = wrapper.findAll('.m-timeline-title')
      expect(titles[0]!.text()).toBe('Step 1')
      expect(titles[1]!.text()).toBe('Step 2')
    })

    it('then it renders subtitle from step data', () => {
      const wrapper = mountTimeline()

      const subtitles = wrapper.findAll('.m-timeline-subtitle')
      expect(subtitles[0]!.text()).toBe('First step')
      expect(subtitles[1]!.text()).toBe('Second step')
    })
  })

  describe('when rendered with content slot', () => {
    it('then it renders content slot when provided', () => {
      const wrapper = mountTimeline({}, {
        content: '<span class="custom-content">Custom</span>',
      })

      expect(wrapper.find('.custom-content').exists()).toBe(true)
    })
  })

  describe('when rendered with modelValue affecting connectors', () => {
    it('then connector has --completed class when preceding step is completed', () => {
      const wrapper = mountTimeline({ modelValue: 2 })

      const connectors = wrapper.findAll('.m-timeline-connector')
      expect(connectors[0]!.classes()).toContain('--completed')
      expect(connectors[1]!.classes()).toContain('--completed')
    })

    it('then connector has --active class when preceding step is active', () => {
      const wrapper = mountTimeline({ modelValue: 0 })

      const connectors = wrapper.findAll('.m-timeline-connector')
      expect(connectors[0]!.classes()).toContain('--active')
      expect(connectors[0]!.classes()).not.toContain('--completed')
    })
  })

  describe('when rendered with animated set to false', () => {
    it('then it does not apply --animated class', () => {
      const wrapper = mountTimeline({ animated: false })

      expect(wrapper.classes()).not.toContain('--animated')
    })
  })

  describe('when rendered with clickable and keyboard interaction', () => {
    it('then Enter key on a step emits update:modelValue and click-step', async () => {
      const wrapper = mountTimeline({ clickable: true })

      await wrapper.findAll('.m-timeline-step')[1]!.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
      expect(wrapper.emitted('click-step')).toEqual([[{ step: defaultSteps[1], index: 1 }]])
    })

    it('then Space key on a step emits update:modelValue and click-step', async () => {
      const wrapper = mountTimeline({ clickable: true })

      await wrapper.findAll('.m-timeline-step')[1]!.trigger('keydown', { key: ' ' })

      expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
      expect(wrapper.emitted('click-step')).toEqual([[{ step: defaultSteps[1], index: 1 }]])
    })

    it('then ArrowRight moves focus to next step in horizontal mode', async () => {
      const wrapper = mountTimeline({ clickable: true, direction: 'horizontal' })
      const stepElements = wrapper.findAll('.m-timeline-step')
      const focusSpy = vi.spyOn(stepElements[1]!.element as HTMLElement, 'focus')

      await stepElements[0]!.trigger('keydown', { key: 'ArrowRight' })

      expect(focusSpy).toHaveBeenCalled()
    })

    it('then ArrowLeft moves focus to previous step in horizontal mode', async () => {
      const wrapper = mountTimeline({ clickable: true, direction: 'horizontal' })
      const stepElements = wrapper.findAll('.m-timeline-step')
      const focusSpy = vi.spyOn(stepElements[0]!.element as HTMLElement, 'focus')

      await stepElements[1]!.trigger('keydown', { key: 'ArrowLeft' })

      expect(focusSpy).toHaveBeenCalled()
    })

    it('then arrow navigation skips disabled steps', async () => {
      const stepsWithDisabled = [
        { title: 'Step 1' },
        { title: 'Step 2', disabled: true },
        { title: 'Step 3' },
      ]
      const wrapper = mountTimeline({ clickable: true, direction: 'horizontal', steps: stepsWithDisabled })
      const stepElements = wrapper.findAll('.m-timeline-step')
      const focusSpy = vi.spyOn(stepElements[2]!.element as HTMLElement, 'focus')

      await stepElements[0]!.trigger('keydown', { key: 'ArrowRight' })

      expect(focusSpy).toHaveBeenCalled()
    })

    it('then arrow navigation does nothing at boundaries', async () => {
      const wrapper = mountTimeline({ clickable: true, direction: 'horizontal' })
      const stepElements = wrapper.findAll('.m-timeline-step')

      await stepElements[0]!.trigger('keydown', { key: 'ArrowLeft' })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('then arrow navigation does nothing for unrelated keys', async () => {
      const wrapper = mountTimeline({ clickable: true, direction: 'horizontal' })
      const stepElements = wrapper.findAll('.m-timeline-step')

      await stepElements[0]!.trigger('keydown', { key: 'Tab' })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when rendered with state-specific styles', () => {
    it('then error state step has destructive CSS variables', () => {
      const wrapper = mountTimeline({
        steps: [
          { title: 'Step 1', state: 'error' },
          { title: 'Step 2' },
        ],
      })

      const style = wrapper.findAll('.m-timeline-step')[0]!.attributes('style')
      expect(style).toContain('--m-timeline-state-bg: var(--maz-destructive)')
    })

    it('then warning state step has warning CSS variables', () => {
      const wrapper = mountTimeline({
        steps: [
          { title: 'Step 1', state: 'warning' },
          { title: 'Step 2' },
        ],
      })

      const style = wrapper.findAll('.m-timeline-step')[0]!.attributes('style')
      expect(style).toContain('--m-timeline-state-bg: var(--maz-warning)')
    })

    it('then completed state step has success CSS variables', () => {
      const wrapper = mountTimeline({
        steps: [
          { title: 'Step 1', state: 'completed' },
          { title: 'Step 2' },
        ],
      })

      const style = wrapper.findAll('.m-timeline-step')[0]!.attributes('style')
      expect(style).toContain('--m-timeline-state-bg: var(--maz-success)')
    })

    it('then active state step has no state CSS variables', () => {
      const wrapper = mountTimeline({ modelValue: 0 })

      const style = wrapper.findAll('.m-timeline-step')[0]!.attributes('style') ?? ''
      expect(style).not.toContain('--m-timeline-state-bg')
    })

    it('then pending state step has no state CSS variables', () => {
      const wrapper = mountTimeline({ modelValue: 0 })

      const style = wrapper.findAll('.m-timeline-step')[1]!.attributes('style') ?? ''
      expect(style).not.toContain('--m-timeline-state-bg')
    })
  })

  describe('when rendered with ARIA attributes', () => {
    it('then step aria-label includes title and state', () => {
      const wrapper = mountTimeline({ modelValue: 0 })

      const step = wrapper.findAll('.m-timeline-step')[0]!
      expect(step.attributes('aria-label')).toBe('Step 1, Step 1: active')
    })

    it('then step aria-label without title only includes index and state', () => {
      const wrapper = mountTimeline({
        steps: [{ subtitle: 'No title' }, { title: 'Step 2' }],
      })

      const step = wrapper.findAll('.m-timeline-step')[0]!
      expect(step.attributes('aria-label')).toBe('Step 1: pending')
    })

    it('then clickable step has role="button" and tabindex="0"', () => {
      const wrapper = mountTimeline({ clickable: true })

      const step = wrapper.findAll('.m-timeline-step')[0]!
      expect(step.attributes('role')).toBe('button')
      expect(step.attributes('tabindex')).toBe('0')
    })

    it('then non-clickable step has role="listitem" and no tabindex', () => {
      const wrapper = mountTimeline({ clickable: false })

      const step = wrapper.findAll('.m-timeline-step')[0]!
      expect(step.attributes('role')).toBe('listitem')
      expect(step.attributes('tabindex')).toBeUndefined()
    })

    it('then clickable disabled step has no role="button" and no tabindex', () => {
      const wrapper = mountTimeline({
        clickable: true,
        steps: [{ title: 'Step 1', disabled: true }, { title: 'Step 2' }],
      })

      const step = wrapper.findAll('.m-timeline-step')[0]!
      expect(step.attributes('role')).toBe('listitem')
      expect(step.attributes('tabindex')).toBeUndefined()
    })
  })

  describe('when rendered with direction auto', () => {
    it('then it renders --horizontal when matchMedia matches', async () => {
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
      })

      const wrapper = mount(MazTimeline, {
        props: { steps: defaultSteps, direction: 'auto' },
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('--horizontal')
    })

    it('then it renders --vertical when matchMedia does not match', async () => {
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
      })

      const wrapper = mount(MazTimeline, {
        props: { steps: defaultSteps, direction: 'auto' },
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('--vertical')
    })
  })

  describe('when rendered with autoValidateSteps and completed steps', () => {
    it('then it renders checkmark icons for completed steps', () => {
      const wrapper = mountTimeline({ modelValue: 2 })

      expect(wrapper.findAll('.m-timeline-check-icon')).toHaveLength(2)
    })
  })

  describe('when rendered with step icons', () => {
    it('then step with icon does not render step number', () => {
      const wrapper = mountTimeline({
        steps: [
          { title: 'Step 1', icon: 'home' },
          { title: 'Step 2' },
        ],
      })

      const indicators = wrapper.findAll('.m-timeline-indicator')
      expect(indicators[0]!.find('.m-timeline-step-number').exists()).toBe(false)
      expect(indicators[1]!.find('.m-timeline-step-number').exists()).toBe(true)
    })
  })

  describe('when rendered without modelValue', () => {
    it('then all steps are pending', () => {
      const wrapper = mountTimeline()

      const steps = wrapper.findAll('.m-timeline-step')
      expect(steps[0]!.classes()).toContain('--pending')
      expect(steps[1]!.classes()).toContain('--pending')
      expect(steps[2]!.classes()).toContain('--pending')
    })
  })

  describe('when direction or breakpoint prop changes', () => {
    it('then it updates layout when direction changes from horizontal to vertical', async () => {
      const wrapper = mount(MazTimeline, {
        props: { steps: defaultSteps, direction: 'horizontal' },
      })

      expect(wrapper.classes()).toContain('--horizontal')

      await wrapper.setProps({ direction: 'vertical' })
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('--vertical')
    })
  })

  describe('when rendered with vertical direction and keyboard navigation', () => {
    it('then ArrowDown moves focus to next step', async () => {
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
      })

      const wrapper = mount(MazTimeline, {
        props: { steps: defaultSteps, direction: 'vertical', clickable: true },
      })
      await wrapper.vm.$nextTick()

      const stepElements = wrapper.findAll('.m-timeline-step')
      const focusSpy = vi.spyOn(stepElements[1]!.element as HTMLElement, 'focus')

      await stepElements[0]!.trigger('keydown', { key: 'ArrowDown' })

      expect(focusSpy).toHaveBeenCalled()
    })

    it('then ArrowUp moves focus to previous step', async () => {
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
      })

      const wrapper = mount(MazTimeline, {
        props: { steps: defaultSteps, direction: 'vertical', clickable: true },
      })
      await wrapper.vm.$nextTick()

      const stepElements = wrapper.findAll('.m-timeline-step')
      const focusSpy = vi.spyOn(stepElements[0]!.element as HTMLElement, 'focus')

      await stepElements[1]!.trigger('keydown', { key: 'ArrowUp' })

      expect(focusSpy).toHaveBeenCalled()
    })
  })

  describe('when rendered with auto direction and media query changes', () => {
    it('then it responds to matchMedia change event', async () => {
      let changeCallback: ((e: MediaQueryListEvent) => void) | undefined
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({
          matches: true,
          addEventListener: vi.fn((_: string, cb: (e: MediaQueryListEvent) => void) => {
            changeCallback = cb
          }),
          removeEventListener: vi.fn(),
        }),
      })

      const wrapper = mount(MazTimeline, {
        props: { steps: defaultSteps, direction: 'auto' },
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('--horizontal')

      changeCallback!({ matches: false } as MediaQueryListEvent)
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('--vertical')
    })

    it('then it cleans up media query listener on unmount', async () => {
      const removeEventListenerMock = vi.fn()
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: removeEventListenerMock,
        }),
      })

      const wrapper = mount(MazTimeline, {
        props: { steps: defaultSteps, direction: 'auto' },
      })
      await wrapper.vm.$nextTick()

      wrapper.unmount()

      expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })

  describe('when keyboard event on disabled step with clickable', () => {
    it('then keydown on disabled step does not emit', async () => {
      const stepsWithDisabled = [
        { title: 'Step 1' },
        { title: 'Step 2', disabled: true },
        { title: 'Step 3' },
      ]
      const wrapper = mountTimeline({
        clickable: true,
        direction: 'horizontal',
        steps: stepsWithDisabled,
      })

      await wrapper.findAll('.m-timeline-step')[1]!.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when all remaining steps are disabled during navigation', () => {
    it('then arrow navigation does not move focus', async () => {
      const stepsAllDisabledAfterFirst = [
        { title: 'Step 1' },
        { title: 'Step 2', disabled: true },
        { title: 'Step 3', disabled: true },
      ]
      const wrapper = mountTimeline({
        clickable: true,
        direction: 'horizontal',
        steps: stepsAllDisabledAfterFirst,
      })

      const stepElements = wrapper.findAll('.m-timeline-step')
      const focusSpy1 = vi.spyOn(stepElements[1]!.element as HTMLElement, 'focus')
      const focusSpy2 = vi.spyOn(stepElements[2]!.element as HTMLElement, 'focus')

      await stepElements[0]!.trigger('keydown', { key: 'ArrowRight' })

      expect(focusSpy1).not.toHaveBeenCalled()
      expect(focusSpy2).not.toHaveBeenCalled()
    })
  })
})
