import MazMiddleTruncate from '@components/MazMiddleTruncate.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const CHAR_WIDTH = 10
const FILE = 'rapport-financier-annuel-2026.pdf'

function mockCanvas() {
  const context = {
    font: '',
    measureText: vi.fn((value: string) => ({ width: [...value].length * CHAR_WIDTH })),
  }

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D)

  return context
}

function mockWidth(width: number) {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width)
}

function visible(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.m-middle-truncate__text').text()
}

describe('given a MazMiddleTruncate', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when the text fits', () => {
    it('then it shows the whole text and is not focusable', async () => {
      mockCanvas()
      mockWidth(1000)
      const wrapper = mount(MazMiddleTruncate, { props: { text: FILE } })
      await flushPromises()

      expect(visible(wrapper)).toBe(FILE)
      expect(wrapper.attributes('tabindex')).toBeUndefined()
      expect(wrapper.find('.m-middle-truncate__full').exists()).toBe(false)
    })
  })

  describe('when the text is too long', () => {
    it('then it cuts in the middle and keeps the extension', async () => {
      mockCanvas()
      mockWidth(200)
      const wrapper = mount(MazMiddleTruncate, { props: { text: FILE } })
      await flushPromises()

      expect(visible(wrapper)).toBe('rapport-fi…-2026.pdf')
      expect(visible(wrapper).length * CHAR_WIDTH).toBeLessThanOrEqual(200)
    })

    it('then the full text is the accessible name and the visible text is hidden from readers', async () => {
      mockCanvas()
      mockWidth(200)
      const wrapper = mount(MazMiddleTruncate, { props: { text: FILE } })
      await flushPromises()

      expect(wrapper.find('.maz\\:sr-only').text()).toBe(FILE)
      expect(wrapper.find('.m-middle-truncate__text').attributes('aria-hidden')).toBe('true')
    })

    it('then it is focusable and holds the reveal overlay', async () => {
      mockCanvas()
      mockWidth(200)
      const wrapper = mount(MazMiddleTruncate, { props: { text: FILE } })
      await flushPromises()

      expect(wrapper.attributes('tabindex')).toBe('0')
      expect(wrapper.find('.m-middle-truncate__full').text()).toBe(FILE)
      expect(wrapper.find('.m-middle-truncate__full').attributes('aria-hidden')).toBe('true')
    })

    it('then reveal false removes the overlay and the focus', async () => {
      mockCanvas()
      mockWidth(200)
      const wrapper = mount(MazMiddleTruncate, { props: { text: FILE, reveal: false } })
      await flushPromises()

      expect(wrapper.attributes('tabindex')).toBeUndefined()
      expect(wrapper.find('.m-middle-truncate__full').exists()).toBe(false)
    })

    it('then endChars sets the length of the end', async () => {
      mockCanvas()
      mockWidth(200)
      const wrapper = mount(MazMiddleTruncate, { props: { text: FILE, endChars: 3 } })
      await flushPromises()

      expect(visible(wrapper).endsWith('…pdf')).toBe(true)
    })

    it('then it keeps a default end for a text without extension', async () => {
      mockCanvas()
      mockWidth(150)
      const wrapper = mount(MazMiddleTruncate, { props: { text: 'abcdefghijklmnopqrstuvwxyz' } })
      await flushPromises()

      expect(visible(wrapper)).toBe('abcdefgh…uvwxyz')
    })

    it('then it uses the ellipsis prop', async () => {
      mockCanvas()
      mockWidth(200)
      const wrapper = mount(MazMiddleTruncate, { props: { text: FILE, ellipsis: '...' } })
      await flushPromises()

      expect(visible(wrapper)).toContain('...')
    })

    it('then it computes again when the text changes', async () => {
      mockCanvas()
      mockWidth(200)
      const wrapper = mount(MazMiddleTruncate, { props: { text: FILE } })
      await flushPromises()

      await wrapper.setProps({ text: 'short.txt' })
      await flushPromises()

      expect(visible(wrapper)).toBe('short.txt')
      expect(wrapper.attributes('tabindex')).toBeUndefined()
    })
  })

  describe('when it cannot measure', () => {
    it('then it keeps the full text without a canvas or without width', async () => {
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
      mockWidth(200)
      const noCanvas = mount(MazMiddleTruncate, { props: { text: FILE } })
      await flushPromises()

      expect(visible(noCanvas)).toBe(FILE)

      vi.restoreAllMocks()
      mockCanvas()
      mockWidth(0)
      const noWidth = mount(MazMiddleTruncate, { props: { text: FILE } })
      await flushPromises()

      expect(visible(noWidth)).toBe(FILE)
    })
  })

  describe('when it renders on the server', () => {
    it('then it renders the full text', async () => {
      const html = await renderToString(createSSRApp(MazMiddleTruncate, { text: FILE }))

      expect(html).toContain(FILE)
      expect(html).not.toContain('tabindex')
    })
  })
})
