import { useIdleTimeout } from '@composables/useIdleTimeout.ts'
import { IdleTimeout } from '@maz-ui/utils/helpers/idleTimeout'
import { withSetup } from '@tests/helpers/withSetup.ts'

it('useIdleTimeout should create an instance of IdleTimeout', () => {
  const callback = vi.fn()
  const options = { timeout: 10_000 }
  const idle = useIdleTimeout({ callback, options })

  expect(idle).toBeInstanceOf(IdleTimeout)
  // @ts-expect-error - test case
  expect(idle.callback).toBe(callback)
  // @ts-expect-error - test case
  expect(idle.options).toEqual({
    element: undefined,
    immediate: true,
    once: false,
    timeout: 10_000,
  })
})

it('useIdleTimeout should default options to an empty object if not provided', () => {
  const callback = vi.fn()
  const idle = useIdleTimeout({ callback })
  // @ts-expect-error - test case
  expect(idle.options).toEqual({
    element: undefined,
    immediate: true,
    once: false,
    timeout: 300_000,
  })
})

describe('given useIdleTimeout called in a component', () => {
  describe('when the component is unmounted', () => {
    it('then the instance is destroyed', () => {
      const [idle, app] = withSetup(() => useIdleTimeout({ callback: vi.fn() }))

      app.unmount()

      expect(idle.destroyed).toBe(true)
    })
  })
})
