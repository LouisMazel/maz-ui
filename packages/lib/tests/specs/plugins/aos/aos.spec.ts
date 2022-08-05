import { AosHandler, AosOptions } from '@package/plugins/aos'

const options: AosOptions = {
  delay: 100,
  observer: {
    root: undefined,
    rootMargin: '0px',
    threshold: 0.2,
  },
  animation: {
    once: true,
    duration: 400,
  },
}
let instance: AosHandler | undefined

beforeEach(() => {
  instance = new AosHandler(options)
})

afterAll(() => {
  instance = undefined
})

test('plugins/toaster/MazToast.vue', () => {
  expect(instance).toBeDefined()
  expect(instance.options).toStrictEqual({
    delay: 100,
    observer: {
      root: undefined,
      rootMargin: '0px',
      threshold: 0.2,
    },
    animation: {
      once: true,
      duration: 400,
    },
  })
})
