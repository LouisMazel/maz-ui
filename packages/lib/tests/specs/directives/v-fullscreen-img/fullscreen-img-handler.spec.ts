import {
  FullscreenImgHandler,
  type vFullscreenImgBinding,
} from '@modules/directives/v-fullscreen-img/fullscreen-img.handler'

describe('FullscreenImgHandler', () => {
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

  test('should set data-src and data-alt attributes', () => {
    el.setAttribute('src', 'https://example.com/image.jpg')
    el.setAttribute('alt', 'Alt Text')

    handler.create(el, binding)

    expect(el.getAttribute('data-src')).toEqual('https://example.com/image.jpg')
    expect(el.getAttribute('data-alt')).toEqual('Alt Text')
    expect(el.classList.contains('m-fullscreen-img-instance')).toBeTruthy()
  })

  test('should use value object when provided', () => {
    binding.value = { src: 'https://example.com/image.jpg', alt: 'Alt Text' }

    handler.create(el, binding)

    expect(el.getAttribute('data-src')).toEqual('https://example.com/image.jpg')
    expect(el.getAttribute('data-alt')).toEqual('Alt Text')
  })

  test('should delete class on remove', () => {
    binding.value = { src: 'https://example.com/image.jpg', alt: 'Alt Text' }

    handler.create(el, binding)

    expect(el.classList.contains('m-fullscreen-img-instance')).toBeTruthy()

    handler.remove(el)

    expect(el.classList.contains('m-fullscreen-img-instance')).toBeFalsy()
  })

  it('should update options', () => {
    // @ts-expect-error
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
    const result = handler['buildOptions'](el, binding)
    expect(result).toEqual({ src: binding.value, alt: null, ...handler['defaultOptions'] })
  })

  it('should prioritize src and alt attributes from value object over attributes of the element', () => {
    el.setAttribute('src', 'some.png')
    el.setAttribute('alt', 'some image')
    // @ts-expect-error
    const result = handler.buildOptions(el, binding)
    // @ts-expect-error
    expect(result).toEqual({ src: binding.value, alt: 'some image', ...handler.defaultOptions })
  })
})
