import MazInputCode from '@components/MazInputCode.vue'
import { flushPromises, mount } from '@vue/test-utils'

describe('given MazInputCode with motion', () => {
  const animate = vi.fn()
  const cancel = vi.fn()

  beforeEach(() => {
    animate.mockReset()
    cancel.mockReset()
    animate.mockReturnValue({ cancel })
    Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true, writable: true })
  })

  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  })

  describe('when a character is typed', () => {
    it('then the character rises into place', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4 } })
      const input = wrapper.findAll('input')[1]

      input.element.value = '7'
      await input.trigger('input')
      await flushPromises()

      expect(animate).toHaveBeenCalledTimes(1)
      expect(animate.mock.calls[0][0][0]).toEqual({ transform: 'translateY(40%)', opacity: 0 })
    })

    it('then nothing animates when the character is refused', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4 } })
      const input = wrapper.findAll('input')[1]

      input.element.value = 'a'
      await input.trigger('input')
      await flushPromises()

      expect(animate).not.toHaveBeenCalled()
    })

    it('then animated false disables the animation', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4, animated: false } })
      const input = wrapper.findAll('input')[1]

      input.element.value = '7'
      await input.trigger('input')
      await flushPromises()

      expect(animate).not.toHaveBeenCalled()
      expect(wrapper.find('.m-input-code').classes()).toContain('--static')
    })
  })

  describe('when several characters are filled at once', () => {
    it('then they rise one after the other', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4 } })
      const first = wrapper.findAll('input')[0]

      first.element.value = '1234'
      await first.trigger('input')
      await flushPromises()

      expect(animate).toHaveBeenCalledTimes(4)
      expect(animate.mock.calls.map(call => call[1].delay)).toEqual([0, 30, 60, 90])
    })

    it('then a paste rises the pasted characters', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4 } })
      const event = new Event('paste', { bubbles: true }) as ClipboardEvent
      Object.defineProperty(event, 'clipboardData', { value: { getData: () => '12' } })

      wrapper.findAll('input')[0].element.dispatchEvent(event)
      await flushPromises()

      expect(animate).toHaveBeenCalledTimes(2)
    })

    it('then a running animation of the same cell is cancelled', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4 } })
      const input = wrapper.findAll('input')[1]

      input.element.value = '7'
      await input.trigger('input')
      await flushPromises()
      input.element.value = '8'
      await input.trigger('input')
      await flushPromises()

      expect(cancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the code is complete', () => {
    it('then the complete class is set', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4, modelValue: '123' } })

      expect(wrapper.find('.m-input-code').classes()).not.toContain('--complete')

      await wrapper.setProps({ modelValue: '1234' })

      expect(wrapper.find('.m-input-code').classes()).toContain('--complete')
    })
  })

  describe('when error becomes true', () => {
    it('then the cells shake', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4, error: false } })

      await wrapper.setProps({ error: true })

      expect(animate).toHaveBeenCalledTimes(1)
      expect(animate.mock.calls[0][0].some((frame: Keyframe) => frame.transform === 'translateX(-6px)')).toBe(true)
    })

    it('then nothing shakes when error becomes false', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4, error: true } })

      await wrapper.setProps({ error: false })

      expect(animate).not.toHaveBeenCalled()
    })

    it('then unmounting cancels the running animation', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4, error: false } })

      await wrapper.setProps({ error: true })
      wrapper.unmount()

      expect(cancel).toHaveBeenCalledTimes(1)
    })
  })
})
