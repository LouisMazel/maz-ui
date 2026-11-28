import MazBtn from '@components/MazBtn.vue'
import { mount } from '@vue/test-utils'

async function settle() {
  await vi.dynamicImportSettled()
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('given MazBtn with the success state', () => {
  describe('when success is false then true with a success text', () => {
    it('then the label rolls to the success text and the button keeps one width', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Save', successText: 'Saved' } })
      await settle()

      expect(wrapper.find('.m-btn__label').exists()).toBe(true)
      expect(wrapper.find('.m-rolling-text').text()).toContain('Save')
      expect(wrapper.findAll('.m-btn__label > [aria-hidden="true"]').map(node => node.text())).toEqual(['Save', 'Saved'])

      await wrapper.setProps({ success: true })

      expect(wrapper.classes()).toContain('--success')
      expect(wrapper.find('.m-rolling-text .maz\\:sr-only').text()).toBe('Saved')
    })

    it('then the label is announced politely', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Save', successText: 'Saved' } })
      await settle()

      expect(wrapper.find('.m-btn__label').attributes('aria-live')).toBe('polite')
    })
  })

  describe('when success is true after a loading with the overlay position', () => {
    it('then a drawn check replaces the spinner in the loader container', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Save', loading: true } })
      await settle()

      expect(wrapper.find('.m-btn-loader-container svg.m-spinner').exists()).toBe(true)

      await wrapper.setProps({ loading: false, success: true })
      await settle()

      expect(wrapper.find('.m-btn-loader-container svg.m-drawn-icon').exists()).toBe(true)
      expect(wrapper.find('.m-btn-loader-container svg.m-spinner').exists()).toBe(false)
    })
  })

  describe('when success is true with the start loading position', () => {
    it('then the check takes the place of the start loader', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Save', loading: true, loadingPosition: 'start' } })
      await settle()

      await wrapper.setProps({ loading: false, success: true })
      await settle()

      expect(wrapper.find('.m-btn-loader-container').exists()).toBe(false)
      expect(wrapper.find('svg.m-drawn-icon').exists()).toBe(true)
      expect(wrapper.classes()).toContain('--has-start-icon')
    })
  })

  describe('when no success text is given', () => {
    it('then the label is the plain text', () => {
      const wrapper = mount(MazBtn, { props: { text: 'Save' } })

      expect(wrapper.find('.m-btn__label').exists()).toBe(false)
      expect(wrapper.text()).toBe('Save')
    })
  })

  describe('when the button is loading', () => {
    it('then it is marked as busy', () => {
      const wrapper = mount(MazBtn, { props: { text: 'Save', loading: true } })

      expect(wrapper.attributes('aria-busy')).toBe('true')
    })
  })
})

describe('given MazBtn with the hold prop', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when rendered', () => {
    it('then it has a fill and an accessible description', () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true } })
      const describedBy = wrapper.attributes('aria-describedby')

      expect(wrapper.find('.m-btn__hold-fill').exists()).toBe(true)
      expect(describedBy).toBeTruthy()
      expect(wrapper.find(`[id="${describedBy}"]`).exists()).toBe(true)
    })

    it('then the hold duration is a CSS variable', () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, holdDuration: 800 } })

      expect(wrapper.attributes('style')).toContain('--m-btn-hold-duration: 800ms')
    })
  })

  describe('when the pointer is held for the whole duration', () => {
    it('then hold-confirm is emitted once', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, holdDuration: 500 } })

      await wrapper.trigger('pointerdown', { button: 0 })

      expect(wrapper.classes()).toContain('--holding')

      vi.advanceTimersByTime(499)

      expect(wrapper.emitted('hold-confirm')).toBeUndefined()

      vi.advanceTimersByTime(1)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('hold-confirm')).toHaveLength(1)
      expect(wrapper.classes()).not.toContain('--holding')
    })
  })

  describe('when the pointer is released early', () => {
    it('then nothing is emitted and the fill drains', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, holdDuration: 500 } })

      await wrapper.trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(200)
      await wrapper.trigger('pointerup')
      vi.advanceTimersByTime(1000)

      expect(wrapper.emitted('hold-confirm')).toBeUndefined()
      expect(wrapper.classes()).not.toContain('--holding')
    })

    it('then the pointer leaving the button also cancels the hold', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, holdDuration: 500 } })

      await wrapper.trigger('pointerdown', { button: 0 })
      await wrapper.trigger('pointerleave')
      vi.advanceTimersByTime(1000)

      expect(wrapper.emitted('hold-confirm')).toBeUndefined()
    })
  })

  describe('when Space or Enter is held', () => {
    it.each([' ', 'Enter'])('then %j confirms after the duration', async (key) => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, holdDuration: 500 } })

      await wrapper.trigger('keydown', { key })
      await wrapper.trigger('keydown', { key, repeat: true })
      vi.advanceTimersByTime(500)

      expect(wrapper.emitted('hold-confirm')).toHaveLength(1)
    })

    it('then releasing the key early cancels the hold', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, holdDuration: 500 } })

      await wrapper.trigger('keydown', { key: ' ' })
      await wrapper.trigger('keyup', { key: ' ' })
      vi.advanceTimersByTime(1000)

      expect(wrapper.emitted('hold-confirm')).toBeUndefined()
    })

    it('then another key does nothing', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, holdDuration: 500 } })

      await wrapper.trigger('keydown', { key: 'a' })
      await wrapper.trigger('keyup', { key: 'a' })
      vi.advanceTimersByTime(1000)

      expect(wrapper.emitted('hold-confirm')).toBeUndefined()
    })
  })

  describe('when the button is simply clicked', () => {
    it('then the click listener of the parent is not called', async () => {
      const onClick = vi.fn()
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true }, attrs: { onClick } })

      await wrapper.trigger('click')

      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('when the button is disabled', () => {
    it('then holding it does nothing', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, disabled: true, holdDuration: 100 } })

      await wrapper.trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(500)

      expect(wrapper.emitted('hold-confirm')).toBeUndefined()
    })
  })

  describe('when the button is unmounted while held', () => {
    it('then the timer is cleared', async () => {
      const wrapper = mount(MazBtn, { props: { text: 'Delete', hold: true, holdDuration: 100 } })

      await wrapper.trigger('pointerdown', { button: 0 })
      wrapper.unmount()
      vi.advanceTimersByTime(500)

      expect(wrapper.emitted('hold-confirm')).toBeUndefined()
    })
  })

  describe('when the hold prop is not set', () => {
    it('then a click reaches the parent and no hold markup is rendered', async () => {
      const onClick = vi.fn()
      const wrapper = mount(MazBtn, { props: { text: 'Delete' }, attrs: { onClick } })

      await wrapper.trigger('click')

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(wrapper.find('.m-btn__hold-fill').exists()).toBe(false)
      expect(wrapper.attributes('aria-describedby')).toBeUndefined()
    })
  })
})
