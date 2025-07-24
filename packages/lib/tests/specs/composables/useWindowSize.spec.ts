import { useWindowSize } from '@composables/useWindowSize'
import { withSetup } from '@tests/helpers/withSetup'

vi.mock('@utils/isClient', () => ({
  isClient: vi.fn(() => true),
}))

describe('given the useWindowSize composable', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('when the composable is used with default options', () => {
    it('then it should initialize with the default dimensions', () => {
      const [{ width, height }, app] = withSetup(() => useWindowSize())

      expect(width.value).toBe(1024)
      expect(height.value).toBe(768)

      app.unmount()
    })
  })
})
