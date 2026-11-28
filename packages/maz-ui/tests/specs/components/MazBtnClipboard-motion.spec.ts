import MazBtnClipboard from '@components/MazBtnClipboard.vue'
import { flushPromises, mount } from '@vue/test-utils'

async function settle() {
  await vi.dynamicImportSettled()
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('given MazBtnClipboard motion', () => {
  const writeText = vi.fn()

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
  })

  describe('when it is copied', () => {
    it('then the copy icon morphs into the check', async () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc' } })

      expect(wrapper.find('.m-morph-icon').classes()).not.toContain('m-morph-icon--active')

      await wrapper.trigger('click')
      await flushPromises()

      expect(wrapper.find('.m-morph-icon').classes()).toContain('m-morph-icon--active')
    })
  })

  describe('when the copy fails', () => {
    it('then the error icon replaces the morph icon', async () => {
      writeText.mockRejectedValue(new Error('denied'))
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc' } })

      await wrapper.trigger('click')
      await flushPromises()

      expect(wrapper.find('.m-morph-icon').exists()).toBe(false)
      expect(wrapper.classes()).toContain('--error')
    })
  })

  describe('when rollLabel is set', () => {
    it('then the text rolls to the copied label and keeps room for the longest text', async () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', rollLabel: true, copiedLabel: 'Copied!' } })
      await settle()

      expect(wrapper.findAll('.m-btn-clipboard__text [aria-hidden="true"]').map(node => node.text())).toEqual(expect.arrayContaining(['abc', 'Copied!']))
      expect(wrapper.find('.m-rolling-text .maz\\:sr-only').text()).toBe('abc')

      await wrapper.trigger('click')
      await flushPromises()

      expect(wrapper.find('.m-rolling-text .maz\\:sr-only').text()).toBe('Copied!')
    })
  })

  describe('when rollLabel is set with a default slot', () => {
    it('then the slot is displayed as is', async () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc', rollLabel: true }, slots: { default: 'Custom' } })
      await settle()

      expect(wrapper.find('.m-rolling-text').exists()).toBe(false)
      expect(wrapper.find('.m-btn-clipboard__text').text()).toBe('Custom')
    })
  })

  describe('when rollLabel is not set', () => {
    it('then the text is plain', () => {
      const wrapper = mount(MazBtnClipboard, { props: { value: 'abc' } })

      expect(wrapper.find('.m-rolling-text').exists()).toBe(false)
    })
  })
})
