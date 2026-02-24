import type { VFullscreenImgBinding } from '@directives/vFullscreenImg/fullscreen-img.handler'
import { FullscreenImgHandler } from '@directives/vFullscreenImg/fullscreen-img.handler'

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
    handler.update(el, { value: { scaleOnHover: true } } as VFullscreenImgBinding)

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

  it('should not create when disabled', () => {
    binding.value = { src: 'https://example.com/image.jpg', disabled: true }
    handler.create(el, binding)
    expect(el.style.cursor).not.toBe('move')
    expect(el.classList.contains('m-fullscreen-img-instance')).toBeFalsy()
  })

  it('should apply scale on hover', () => {
    binding.value = { src: 'https://example.com/image.jpg', scaleOnHover: true }
    handler.create(el, binding)
    expect(el.style.transition).toBe('all 200ms ease-in-out')
  })

  it('should apply blur on hover', () => {
    binding.value = { src: 'https://example.com/image.jpg', blurOnHover: true }
    handler.create(el, binding)
    expect(el.style.transition).toBe('all 200ms ease-in-out')
  })

  it('should handle mouseenter with scaleOnHover', () => {
    binding.value = { src: 'https://example.com/image.jpg', scaleOnHover: true }
    handler.create(el, binding)
    el.dispatchEvent(new Event('mouseenter'))
    expect(el.style.zIndex).toBe('1')
    expect(el.style.transform).toBe('scale(1.04)')
  })

  it('should handle mouseenter with blurOnHover', () => {
    binding.value = { src: 'https://example.com/image.jpg', blurOnHover: true }
    handler.create(el, binding)
    el.dispatchEvent(new Event('mouseenter'))
    expect(el.style.filter).toBe('blur(3px)')
  })

  it('should handle mouseleave with scaleOnHover', () => {
    binding.value = { src: 'https://example.com/image.jpg', scaleOnHover: true }
    handler.create(el, binding)
    el.dispatchEvent(new Event('mouseenter'))
    el.dispatchEvent(new Event('mouseleave'))
    expect(el.style.transform).toBe('')
    expect(el.style.zIndex).toBe('')
  })

  it('should handle mouseleave with blurOnHover', () => {
    binding.value = { src: 'https://example.com/image.jpg', blurOnHover: true }
    handler.create(el, binding)
    el.dispatchEvent(new Event('mouseenter'))
    el.dispatchEvent(new Event('mouseleave'))
    expect(el.style.filter).toBe('')
  })

  it('should throw error when no src is available', () => {
    const imgEl = document.createElement('div')
    expect(() => {
      handler.create(imgEl, { value: undefined } as VFullscreenImgBinding)
    }).toThrow('[maz-ui](fullscreen-img)')
  })

  it('should use data-src attribute when no other src', () => {
    const imgEl = document.createElement('div')
    imgEl.setAttribute('data-src', 'https://example.com/fallback.jpg')
    handler.create(imgEl, { value: undefined } as VFullscreenImgBinding)
    expect(imgEl.getAttribute('data-src')).toBe('https://example.com/fallback.jpg')
  })

  it('should use data-alt attribute', () => {
    el.setAttribute('data-alt', 'Fallback Alt')
    handler.create(el, binding)
    expect(el.getAttribute('data-alt')).toBe('Fallback Alt')
  })

  it('should remove event listeners on remove', () => {
    const removeEventListenerSpy = vi.spyOn(el, 'removeEventListener')
    handler.create(el, binding)
    handler.remove(el)
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(3)
  })

  it('should get allInstances', () => {
    handler.create(el, binding)
    document.body.appendChild(el)
    const instances = handler.allInstances
    expect(instances.length).toBeGreaterThanOrEqual(1)
    document.body.removeChild(el)
  })
})
