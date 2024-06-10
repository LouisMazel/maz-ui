import { DEFAULT_OPTIONS, LazyImg } from '@modules/directives/v-lazy-img/lazy-img.handler'

describe('lazyImg', () => {
  let lazyImg: LazyImg

  beforeEach(() => {
    lazyImg = new LazyImg()
  })

  it('should have default options', () => {
    // @ts-expect-error - test case
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
    // @ts-expect-error - test case
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
    // @ts-expect-error - test case
    lazyImg.setBaseClass(el)
    // @ts-expect-error - test case
    expect(el.classList.contains(lazyImg.options.baseClass)).toBe(true)
  })

  it('should add the loading class on the img element when imageIsLoading is called', () => {
    const el = document.createElement('div')
    // @ts-expect-error - test case
    lazyImg.imageIsLoading(el)
    expect(el.classList.contains('m-lazy-loading')).toBe(true)
  })

  it('should remove all state classes', () => {
    const el = document.createElement('div')
    // @ts-expect-error - test case
    el.classList.add(lazyImg.options.baseClass)
    // @ts-expect-error - test case
    el.classList.add(lazyImg.options.loadingClass)
    // @ts-expect-error - test case
    el.classList.add(lazyImg.options.errorClass)
    // @ts-expect-error - test case
    el.classList.add(lazyImg.options.noPhotoClass)
    // @ts-expect-error - test case
    lazyImg.removeAllStateClasses(el)
    // @ts-expect-error - test case
    expect(el.classList.contains(lazyImg.options.baseClass)).toBe(true)
    // @ts-expect-error - test case
    expect(el.classList.contains(lazyImg.options.loadingClass)).toBe(false)
    // @ts-expect-error - test case
    expect(el.classList.contains(lazyImg.options.errorClass)).toBe(false)
    // @ts-expect-error - test case
    expect(el.classList.contains(lazyImg.options.noPhotoClass)).toBe(false)
  })
})
