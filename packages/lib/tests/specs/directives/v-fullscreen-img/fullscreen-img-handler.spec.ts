import type { vFullscreenImgBinding } from '@directives/vFullscreenImg/fullscreen-img.handler'
import {
  FullscreenImgHandler,

} from '@directives/vFullscreenImg/fullscreen-img.handler'

describe('fullscreenImgHandler', () => {
  let el: HTMLElement
  let binding: any
  let handler: FullscreenImgHandler
  // let mountSpy: SpyInstance

  beforeEach(() => {
    el = document.createElement('img')
    binding = {
      value: 'https://example.com/image.jpg',
    }
    handler = new FullscreenImgHandler()
    // mountSpy = vi.spyOn(mount)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should set data-src and data-alt attributes', () => {
    el.setAttribute('src', 'https://example.com/image.jpg')
    el.setAttribute('alt', 'Alt Text')

    handler.create(el, binding)

    expect(el.getAttribute('data-src')).toEqual('https://example.com/image.jpg')
    expect(el.getAttribute('data-alt')).toEqual('Alt Text')
    expect(el.classList.contains('m-fullscreen-img-instance')).toBeTruthy()
  })

  it('should use value object when provided', () => {
    binding.value = { src: 'https://example.com/image.jpg', alt: 'Alt Text' }

    handler.create(el, binding)

    expect(el.getAttribute('data-src')).toEqual('https://example.com/image.jpg')
    expect(el.getAttribute('data-alt')).toEqual('Alt Text')
  })

  it('should delete class on remove', () => {
    binding.value = { src: 'https://example.com/image.jpg', alt: 'Alt Text' }

    handler.create(el, binding)

    expect(el.classList.contains('m-fullscreen-img-instance')).toBeTruthy()

    handler.remove(el)

    expect(el.classList.contains('m-fullscreen-img-instance')).toBeFalsy()
  })

  it('should update options', () => {
    // @ts-expect-error - test case
    const buildOptionsSpy = vi.spyOn(handler, 'buildOptions')

    handler.create(el, binding)
    handler.update(el, { value: { scaleOnHover: true } } as vFullscreenImgBinding)

    expect(buildOptionsSpy).toHaveBeenCalledTimes(2)
    expect(buildOptionsSpy).toHaveBeenCalledWith(el, binding)
    expect(buildOptionsSpy).toHaveBeenCalledWith(el, { value: { scaleOnHover: true } })
  })

  it('should add mouse event listeners to the element', () => {
    const addEventListenerSpy = vi.spyOn(el, 'addEventListener')
    handler.create(el, binding)
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
  })

  it('should build options object with src and alt attributes from value object', () => {
    // @ts-expect-error - private method
    const result = handler.buildOptions(el, binding)
    // @ts-expect-error - private method
    expect(result).toEqual({ src: binding.value, alt: null, ...handler.defaultOptions })
  })

  it('should prioritize src and alt attributes from value object over attributes of the element', () => {
    el.setAttribute('src', 'some.png')
    el.setAttribute('alt', 'some image')
    // @ts-expect-error - private method
    const result = handler.buildOptions(el, binding)
    // @ts-expect-error - private method
    expect(result).toEqual({ src: binding.value, alt: 'some image', ...handler.defaultOptions })
  })

  it('preserves other attributes on the element', () => {
    el.setAttribute('id', 'test-id')
    el.setAttribute('class', 'existing-class')
    handler.create(el, binding)
    expect(el.getAttribute('id')).toBe('test-id')
    expect(el.classList.contains('existing-class')).toBeTruthy()
  })
})
