import type { VFullscreenImgBinding } from '@directives/vFullscreenImg/fullscreen-img.handler.ts'
import { FullscreenImgHandler } from '@directives/vFullscreenImg/fullscreen-img.handler.ts'

function createBinding(value: object): VFullscreenImgBinding {
  return { value: { src: 'https://example.com/image.jpg', ...value } } as VFullscreenImgBinding
}

describe('given the hover transition of the thumbnail', () => {
  let el: HTMLElement
  let handler: FullscreenImgHandler

  beforeEach(() => {
    el = document.createElement('img')
    handler = new FullscreenImgHandler()
  })

  describe('when scaleOnHover is enabled', () => {
    it('then the transition covers scale and transform with the motion tokens', () => {
      handler.create(el, createBinding({ scaleOnHover: true }))

      expect(el.style.transition).toContain('scale calc')
      expect(el.style.transition).toContain('transform calc')
      expect(el.style.transition).toContain('--maz-motion-normal')
      expect(el.style.transition).toContain('--maz-motion-scale')
      expect(el.style.transition).toContain('--maz-easing-out')
      expect(el.style.transition).not.toContain('filter')
    })
  })

  describe('when blurOnHover is enabled', () => {
    it('then the transition covers filter only', () => {
      handler.create(el, createBinding({ blurOnHover: true }))

      expect(el.style.transition).toContain('filter')
      expect(el.style.transition).not.toContain('transform')
    })
  })

  describe('when no hover option is enabled', () => {
    it('then no transition is set', () => {
      handler.create(el, createBinding({}))

      expect(el.style.transition).toBe('')
    })
  })

  describe('when the options change then the directive is removed', () => {
    it('then the transition follows the options and is cleaned', () => {
      handler.create(el, createBinding({ scaleOnHover: true }))
      handler.update(el, createBinding({}))

      expect(el.style.transition).toBe('')

      handler.update(el, createBinding({ blurOnHover: true }))

      expect(el.style.transition).toContain('filter')

      handler.remove(el)

      expect(el.style.transition).toBe('')
    })
  })
})
