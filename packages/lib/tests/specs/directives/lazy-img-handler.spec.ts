import { LazyImg, DEFAULT_OPTIONS } from '@package/directives/v-lazy-img/lazy-img-handler'

describe('LazyImg', () => {
  let lazyImg: LazyImg

  beforeEach(() => {
    lazyImg = new LazyImg()
  })

  it('should have default options', () => {
    // @ts-ignore
    expect(lazyImg.options).toEqual(DEFAULT_OPTIONS)
  })

  it('should merge default options with given options', () => {
    const lazyImg = new LazyImg()
    const options = {
      baseClass: 'custom-base-class',
      observerOptions: {
        threshold: 0.5,
      },
    }
    // @ts-ignore
    const builtOptions = lazyImg.buildOptions(options)

    expect(builtOptions).toEqual({
      ...DEFAULT_OPTIONS,
      ...options,
      observerOptions: {
        ...DEFAULT_OPTIONS.observerOptions,
        ...options.observerOptions,
      },
    })
  })

  it('should have the correct base class', () => {
    const el = document.createElement('div')
    // @ts-ignore
    lazyImg.setBaseClass(el)
    // @ts-ignore
    expect(el.classList.contains(lazyImg.options.baseClass)).toBe(true)
  })

  it('should add the loading class on the img element when imageIsLoading is called', () => {
    const el = document.createElement('div')
    // @ts-ignore
    lazyImg.imageIsLoading(el)
    expect(el.classList.contains('m-lazy-loading')).toBe(true)
  })

  it('should remove all state classes', () => {
    const el = document.createElement('div')
    // @ts-ignore
    el.classList.add(lazyImg.options.baseClass)
    // @ts-ignore
    el.classList.add(lazyImg.options.loadingClass)
    // @ts-ignore
    el.classList.add(lazyImg.options.errorClass)
    // @ts-ignore
    el.classList.add(lazyImg.options.noPhotoClass)
    // @ts-ignore
    lazyImg.removeAllStateClasses(el)
    // @ts-ignore
    expect(el.classList.contains(lazyImg.options.baseClass)).toBe(true)
    // @ts-ignore
    expect(el.classList.contains(lazyImg.options.loadingClass)).toBe(false)
    // @ts-ignore
    expect(el.classList.contains(lazyImg.options.errorClass)).toBe(false)
    // @ts-ignore
    expect(el.classList.contains(lazyImg.options.noPhotoClass)).toBe(false)
  })
})
