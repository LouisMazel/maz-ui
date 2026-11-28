import MazAlert from '@components/MazAlert.vue'
import { mount } from '@vue/test-utils'

describe('given MazAlert motion', () => {
  describe('when rendered with the default icon', () => {
    it.each([
      ['success', 'check-circle'],
      ['warning', 'exclamation-circle'],
      ['destructive', 'x-circle'],
      ['info', 'information-circle'],
    ] as const)('then the %s alert draws its own icon', (color, name) => {
      const wrapper = mount(MazAlert, { props: { color, title: 'Title' } })

      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).props('name')).toBe(name)
      expect(wrapper.find('.m-alert-icon').attributes('aria-hidden')).toBe('true')
    })

    it('then animated false draws the icon instantly', () => {
      const wrapper = mount(MazAlert, { props: { animated: false } })

      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).props('duration')).toBe('0s')
    })
  })

  describe('when a custom icon is given', () => {
    it('then it is not replaced by a drawn icon', async () => {
      const wrapper = mount(MazAlert, { props: { icon: '<svg></svg>' } })
      await vi.dynamicImportSettled()

      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).exists()).toBe(false)
    })
  })

  describe('when dismissible', () => {
    it('then the close button hides the alert and emits close and update:open', async () => {
      const wrapper = mount(MazAlert, { props: { dismissible: true, title: 'Title', animated: false } })

      await wrapper.find('.m-alert-close').trigger('click')

      expect(wrapper.emitted('close')).toHaveLength(1)
      expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    })

    it('then the close button has an accessible name', () => {
      const wrapper = mount(MazAlert, { props: { dismissible: true } })

      expect(wrapper.find('.m-alert-close').attributes('aria-label')).toBeTruthy()
    })

    it('then there is no close button by default', () => {
      const wrapper = mount(MazAlert)

      expect(wrapper.find('.m-alert-close').exists()).toBe(false)
    })
  })

  describe('when open becomes false', () => {
    it('then the alert is hidden at once without animation support', async () => {
      const wrapper = mount(MazAlert, { props: { open: true, animated: false } })

      await wrapper.setProps({ open: false })

      expect(wrapper.attributes('style')).toContain('display: none')
    })

    it('then the alert folds away with the Web Animations API then is hidden', async () => {
      const finished = Promise.resolve()
      const cancel = vi.fn()
      const animate = vi.fn(() => ({ finished, cancel }))
      const wrapper = mount(MazAlert, { props: { open: true }, attachTo: document.body })
      wrapper.element.animate = animate as unknown as typeof wrapper.element.animate

      await wrapper.setProps({ open: false })
      await finished
      await wrapper.vm.$nextTick()

      expect(animate).toHaveBeenCalledTimes(1)
      expect(cancel).toHaveBeenCalledTimes(1)
      expect(wrapper.attributes('style')).toContain('display: none')

      wrapper.unmount()
    })

    it('then reopening it cancels the fold and shows it again', async () => {
      const cancel = vi.fn()
      const animate = vi.fn(() => ({ finished: new Promise(() => {}), cancel }))
      const wrapper = mount(MazAlert, { props: { open: true }, attachTo: document.body })
      wrapper.element.animate = animate as unknown as typeof wrapper.element.animate

      await wrapper.setProps({ open: false })
      await wrapper.setProps({ open: true })

      expect(cancel).toHaveBeenCalled()
      expect(wrapper.attributes('style') ?? '').not.toContain('display: none')

      wrapper.unmount()
    })
  })

  describe('when open is true', () => {
    it('then the alert is displayed', () => {
      const wrapper = mount(MazAlert)

      expect(wrapper.attributes('style') ?? '').not.toContain('display: none')
    })
  })
})
