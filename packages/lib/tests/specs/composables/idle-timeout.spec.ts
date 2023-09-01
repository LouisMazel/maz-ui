import { IdleTimeout, useIdleTimeout } from '@modules/index'

test('useIdleTimeout should create an instance of IdleTimeout', () => {
  const callback = vitest.fn()
  const options = { timeout: 10_000 }
  const { idle } = useIdleTimeout({ callback, options })

  expect(idle.value).toBeInstanceOf(IdleTimeout)
  // @ts-ignore
  expect(idle.value.callback).toBe(callback)
  // @ts-ignore
  expect(idle.value.options).toEqual({
    element: undefined,
    immediate: true,
    once: false,
    ssr: false,
    timeout: 10_000,
  })
})

test('useIdleTimeout should default options to an empty object if not provided', () => {
  const callback = vitest.fn()
  const { idle } = useIdleTimeout({ callback })
  // @ts-ignore
  expect(idle.value.options).toEqual({
    element: undefined,
    immediate: true,
    once: false,
    ssr: false,
    timeout: 300_000,
  })
})
