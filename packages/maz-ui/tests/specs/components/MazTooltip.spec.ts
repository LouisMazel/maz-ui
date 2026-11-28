import MazTooltip from '@components/MazTooltip.vue'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { resetTooltipGroup } from '../../../src/utils/tooltipGroup.ts'
import { getActiveTooltip, releaseActiveTooltip, setActiveTooltip } from '../../../src/utils/tooltipSlideGroup.ts'

const reduced = ref(false)

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: reduced }),
}))

function mountTooltip(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MazTooltip, {
    props: { text: 'Save the file', ...props },
    slots: { default: '<button type="button">Save</button>', ...slots },
    attachTo: document.body,
  })
}

async function flush() {
  await nextTick()
  await nextTick()
}

function bubble(wrapper: ReturnType<typeof mountTooltip>) {
  return wrapper.find('.m-tooltip__content')
}

describe('given a MazTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    reduced.value = false
    resetTooltipGroup()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  describe('when it renders', () => {
    it('then the bubble is closed and the trigger content is shown', () => {
      const wrapper = mountTooltip()

      expect(wrapper.find('button').text()).toBe('Save')
      expect(bubble(wrapper).exists()).toBe(false)
    })
  })

  describe('when the trigger is hovered', () => {
    it('then the bubble opens after the delay', async () => {
      const wrapper = mountTooltip()

      await wrapper.find('.m-tooltip__trigger').trigger('mouseenter')
      vi.advanceTimersByTime(299)
      await flush()
      expect(bubble(wrapper).exists()).toBe(false)

      vi.advanceTimersByTime(1)
      await flush()

      expect(bubble(wrapper).text()).toBe('Save the file')
      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('then it closes on mouseleave', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('mouseenter')
      await flush()
      await trigger.trigger('mouseleave')
      await flush()
      expect(wrapper.emitted('close')).toBeUndefined()

      vi.advanceTimersByTime(100)
      await flush()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then it stays open while the pointer is on the bubble', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('mouseenter')
      await flush()
      await trigger.trigger('mouseleave')
      await wrapper.find('.m-tooltip__content').trigger('mouseenter')
      vi.advanceTimersByTime(1000)
      await flush()

      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('then leaving before the delay cancels the opening', async () => {
      const wrapper = mountTooltip()
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('mouseenter')
      await trigger.trigger('mouseleave')
      vi.advanceTimersByTime(1000)
      await flush()

      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then a second mouseenter while open does nothing', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('mouseenter')
      await trigger.trigger('mouseenter')
      await flush()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('then a leave while closed does nothing', async () => {
      const wrapper = mountTooltip()

      await wrapper.find('.m-tooltip__trigger').trigger('mouseleave')

      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('when the trigger is focused', () => {
    it('then the bubble opens and closes with the focus', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('focusin')
      await flush()
      expect(wrapper.emitted('open')).toHaveLength(1)

      await trigger.trigger('focusout')
      await flush()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when Escape is pressed', () => {
    it('then the open bubble closes', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('focusin')
      await flush()
      await trigger.trigger('keydown', { key: 'Escape' })
      await flush()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then another key does nothing', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('focusin')
      await flush()
      await trigger.trigger('keydown', { key: 'a' })

      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('then Escape on a closed tooltip does nothing', async () => {
      const wrapper = mountTooltip()

      await wrapper.find('.m-tooltip__trigger').trigger('keydown', { key: 'Escape' })

      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('when the trigger is pressed', () => {
    it('then the open bubble closes', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('mouseenter')
      await flush()
      await trigger.trigger('pointerdown')
      await flush()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then the focus that follows the press does not reopen it', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('mouseenter')
      await flush()
      await trigger.trigger('pointerdown')
      await trigger.trigger('focusin')
      await trigger.trigger('mouseenter')
      vi.advanceTimersByTime(1000)
      await flush()

      expect(wrapper.emitted('open')).toHaveLength(1)
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then it opens again once the pointer left and came back', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('mouseenter')
      await flush()
      await trigger.trigger('pointerdown')
      await trigger.trigger('mouseleave')
      await trigger.trigger('mouseenter')
      await flush()

      expect(wrapper.emitted('open')).toHaveLength(2)
    })

    it('then it opens again on the next keyboard focus', async () => {
      const wrapper = mountTooltip({ delay: 0 })
      const trigger = wrapper.find('.m-tooltip__trigger')

      await trigger.trigger('pointerdown')
      await trigger.trigger('focusin')
      await trigger.trigger('focusout')
      await trigger.trigger('focusin')
      await flush()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })
  })

  describe('when there is no content', () => {
    it('then it never opens', async () => {
      const wrapper = mountTooltip({ text: '', delay: 0 })

      await wrapper.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()

      expect(wrapper.emitted('open')).toBeUndefined()
    })
  })

  describe('when it is disabled', () => {
    it('then it never opens', async () => {
      const wrapper = mountTooltip({ disabled: true, delay: 0 })

      await wrapper.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()

      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then disabling an open tooltip closes it', async () => {
      const wrapper = mountTooltip({ delay: 0 })

      await wrapper.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()
      await wrapper.setProps({ disabled: true })
      await flush()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when a shortcut and a content slot are given', () => {
    it('then the kbd is rendered next to the text', async () => {
      const wrapper = mountTooltip({ delay: 0, shortcut: 'Ctrl+S' })

      await wrapper.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()

      expect(wrapper.find('.m-tooltip__kbd').text()).toBe('Ctrl+S')
    })

    it('then the content slot replaces the text', async () => {
      const wrapper = mountTooltip({ text: undefined, delay: 0 }, { content: '<strong class="rich">Rich</strong>' })

      await wrapper.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()

      expect(wrapper.find('.rich').text()).toBe('Rich')
    })
  })

  describe('when the exposed methods are used', () => {
    it('then open and close work without delay', async () => {
      const wrapper = mountTooltip()
      const vm = wrapper.vm as unknown as { open: () => void, close: () => void }

      vm.open()
      await flush()
      expect(wrapper.emitted('open')).toHaveLength(1)

      vm.close()
      await flush()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when the model is set by the parent', () => {
    it('then the open state follows it', async () => {
      const wrapper = mountTooltip({ modelValue: true })
      await flush()

      expect(wrapper.emitted('open')).toBeUndefined()
      expect(bubble(wrapper).exists()).toBe(true)

      await wrapper.setProps({ modelValue: false })
      await flush()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when a tooltip opens right after another one closed', () => {
    it('then it opens without delay', async () => {
      const first = mountTooltip({ delay: 0 })
      const second = mountTooltip()

      await first.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()
      await second.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()

      expect(second.emitted('open')).toHaveLength(1)
    })
  })

  describe('when tooltips share a group', () => {
    function groupPair() {
      const first = mountTooltip({ delay: 0, group: 'toolbar' })
      const second = mountTooltip({ delay: 0, group: 'toolbar', text: 'Open' })

      return { first, second }
    }

    it('then moving to the next one dismisses the previous at once and slides', async () => {
      const { first, second } = groupPair()
      const animate = vi.fn()

      await first.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()

      const panel = document.querySelector('.m-tooltip-panel') as HTMLElement | null

      if (panel)
        panel.animate = animate

      await second.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()
      vi.advanceTimersByTime(50)
      await flush()

      expect(first.emitted('close')).toHaveLength(1)
      expect(second.emitted('open')).toHaveLength(1)
    })

    it('then leaving closes after a short grace period', async () => {
      const { first } = groupPair()
      const trigger = first.find('.m-tooltip__trigger')

      await trigger.trigger('mouseenter')
      await flush()
      await trigger.trigger('mouseleave')
      await flush()
      expect(first.emitted('close')).toBeUndefined()

      vi.advanceTimersByTime(100)
      await flush()

      expect(first.emitted('close')).toHaveLength(1)
      expect(getActiveTooltip('toolbar')).toBeUndefined()
    })

    it('then no slide happens with reduced motion', async () => {
      reduced.value = true

      const { first, second } = groupPair()

      await first.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()
      await second.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()

      expect(second.emitted('open')).toHaveLength(1)
    })

    it('then unmounting releases the group', async () => {
      const { first } = groupPair()

      await first.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()
      first.unmount()

      expect(getActiveTooltip('toolbar')).toBeUndefined()
    })

    it('then the slide animates the bubble from the previous box', async () => {
      const first = mountTooltip({ delay: 0, group: 'slide' })
      const second = mountTooltip({ delay: 0, group: 'slide', text: 'Open' })
      const animate = vi.fn()

      Element.prototype.animate = animate
      vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => callback(0))

      await first.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()
      await second.find('.m-tooltip__trigger').trigger('mouseenter')
      await flush()
      await flush()

      expect(animate).toHaveBeenCalled()

      vi.unstubAllGlobals()
      delete (Element.prototype as { animate?: unknown }).animate
    })
  })

  describe('when the group helpers are used', () => {
    it('then only the registered member is released', () => {
      const member = { dismiss: () => undefined }
      const other = { dismiss: () => undefined }

      setActiveTooltip('helpers', member)
      releaseActiveTooltip('helpers', other)
      expect(getActiveTooltip('helpers')).toBe(member)

      releaseActiveTooltip('helpers', member)
      expect(getActiveTooltip('helpers')).toBeUndefined()
    })
  })
})
