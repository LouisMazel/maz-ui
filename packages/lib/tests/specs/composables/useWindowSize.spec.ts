import { useWindowSize } from '@modules/composables/useWindowSize'

vi.mock('@modules/helpers/is-client', () => ({
  isClient: vi.fn(() => true),
}))

describe('given the useWindowSize composable', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('when the composable is used with default options', () => {
    it('then it should initialize with the default dimensions', () => {
      const { width, height } = useWindowSize()

      expect(width.value).toBe(1024)
      expect(height.value).toBe(768)
    })
  })
})
