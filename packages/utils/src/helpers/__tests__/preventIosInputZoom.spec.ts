import { isIos } from '../isIos'
import { addViewportMaximumScale, preventIosInputZoom } from '../preventIosInputZoom'

vi.mock('../isIos', () => ({
  isIos: vi.fn(),
}))

function setViewport(content?: string) {
  document.head.innerHTML = ''

  if (content === undefined)
    return undefined

  const meta = document.createElement('meta')
  meta.setAttribute('name', 'viewport')
  meta.setAttribute('content', content)
  document.head.appendChild(meta)

  return meta
}

describe('given the addViewportMaximumScale function', () => {
  describe('when the content has no maximum-scale', () => {
    it('then it appends maximum-scale=1', () => {
      expect(addViewportMaximumScale('width=device-width, initial-scale=1')).toBe('width=device-width, initial-scale=1, maximum-scale=1')
    })
  })

  describe('when the content already has a maximum-scale', () => {
    it('then it replaces its value by 1', () => {
      expect(addViewportMaximumScale('width=device-width, maximum-scale = 5, initial-scale=1')).toBe('width=device-width, maximum-scale=1, initial-scale=1')
    })
  })

  describe('when the content is empty', () => {
    it('then it returns maximum-scale=1 only', () => {
      expect(addViewportMaximumScale('  ')).toBe('maximum-scale=1')
    })
  })
})

describe('given the preventIosInputZoom function', () => {
  afterEach(() => {
    document.head.innerHTML = ''
  })

  describe('when the device is not iOS', () => {
    it('then it leaves the viewport untouched and returns a no-op', () => {
      vi.mocked(isIos).mockReturnValue(false)
      const meta = setViewport('width=device-width, initial-scale=1')

      const restore = preventIosInputZoom()
      restore()

      expect(meta?.getAttribute('content')).toBe('width=device-width, initial-scale=1')
    })
  })

  describe('when the device is iOS', () => {
    beforeEach(() => {
      vi.mocked(isIos).mockReturnValue(true)
    })

    describe('when the page has a viewport meta', () => {
      it('then it adds maximum-scale=1 to the viewport', () => {
        const meta = setViewport('width=device-width, initial-scale=1')

        preventIosInputZoom()

        expect(meta?.getAttribute('content')).toBe('width=device-width, initial-scale=1, maximum-scale=1')
      })

      it('then the returned function restores the original viewport', () => {
        const meta = setViewport('width=device-width, initial-scale=1')

        const restore = preventIosInputZoom()
        restore()

        expect(meta?.getAttribute('content')).toBe('width=device-width, initial-scale=1')
      })
    })

    describe('when the viewport meta has no content', () => {
      it('then it sets maximum-scale=1 and restores an empty content', () => {
        const meta = setViewport('')
        meta?.removeAttribute('content')

        const restore = preventIosInputZoom()
        const contentAfterPrevent = meta?.getAttribute('content')
        restore()

        expect(contentAfterPrevent).toBe('maximum-scale=1')
        expect(meta?.getAttribute('content')).toBe('')
      })
    })

    describe('when the page has no viewport meta', () => {
      it('then it does not create one', () => {
        setViewport()

        const restore = preventIosInputZoom()
        restore()

        expect(document.querySelector('meta[name="viewport"]')).toBeNull()
      })
    })
  })
})
