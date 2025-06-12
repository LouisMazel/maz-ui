import { useWindowSize } from '@composables/useWindowSize'

vi.mock('@utils/isClient', () => ({
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
