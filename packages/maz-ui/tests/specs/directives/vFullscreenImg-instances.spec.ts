import { vFullscreenImg } from '@directives/vFullscreenImg.ts'

function mountImage(src: string) {
  const element = document.createElement('img')
  vFullscreenImg.mounted!(element, { value: src } as any, null as any, null as any)
  return element
}

describe('given two images with the directive', () => {
  describe('when the first one is unmounted', () => {
    it('then only the first one loses its listeners and its class', () => {
      const first = mountImage('https://example.com/first.jpg')
      const second = mountImage('https://example.com/second.jpg')

      vFullscreenImg.unmounted!(first, {} as any, null as any, null as any)

      expect(first.classList.contains('m-fullscreen-img-instance')).toBe(false)
      expect(second.classList.contains('m-fullscreen-img-instance')).toBe(true)
    })

    it('then a click on the first one opens nothing', () => {
      const first = mountImage('https://example.com/first.jpg')
      mountImage('https://example.com/second.jpg')

      vFullscreenImg.unmounted!(first, {} as any, null as any, null as any)
      first.click()

      expect(document.querySelector('.m-fullscreen-img')).toBeNull()
    })
  })

  describe('when the first one is updated', () => {
    it('then the second one keeps its own source', () => {
      const first = mountImage('https://example.com/first.jpg')
      const second = mountImage('https://example.com/second.jpg')

      vFullscreenImg.updated!(first, { value: 'https://example.com/new.jpg' } as any, null as any, null as any)

      expect(second.getAttribute('data-src')).toBe('https://example.com/second.jpg')
    })
  })
})
