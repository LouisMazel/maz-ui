import { getNumericScreensFromTailwind } from '@/../tailwindcss/variables/breakpoints'
import { useBreakpoints } from '@composables/useBreakpoints'
import { useWindowSize } from '@composables/useWindowSize'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

vi.mock('@composables/useWindowSize', () => ({
  useWindowSize: vi.fn(),
}))

vi.mock('@/../tailwindcss/variables/breakpoints', () => ({
  getNumericScreensFromTailwind: vi.fn(),
}))

describe('given useBreakpoints', () => {
  const mockBreakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }

  const mockNumericBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getNumericScreensFromTailwind).mockReturnValue(mockNumericBreakpoints)
  })

  describe('when called with default options', () => {
    it('then should return correct breakpoint states for small screen', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(500) } as any)

      const result = useBreakpoints({ breakpoints: mockBreakpoints })

      expect(result.isSmallScreen.value).toBe(true)
      expect(result.isMediumScreen.value).toBe(false)
      expect(result.isLargeScreen.value).toBe(false)
    })

    it('then should return correct breakpoint states for medium screen', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(800) } as any)

      const result = useBreakpoints({ breakpoints: mockBreakpoints })

      expect(result.isSmallScreen.value).toBe(false)
      expect(result.isMediumScreen.value).toBe(true)
      expect(result.isLargeScreen.value).toBe(false)
    })

    it('then should return correct breakpoint states for large screen', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(1100) } as any)

      const result = useBreakpoints({ breakpoints: mockBreakpoints })

      expect(result.isSmallScreen.value).toBe(false)
      expect(result.isMediumScreen.value).toBe(false)
      expect(result.isLargeScreen.value).toBe(true)
    })
  })

  describe('when called with custom medium and large breakpoints', () => {
    it('then should use the custom breakpoints for calculations', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(900) } as any)

      const result = useBreakpoints({
        breakpoints: mockBreakpoints,
        mediumBreakPoint: 'sm',
        largeBreakPoint: 'xl',
      })

      expect(result.isSmallScreen.value).toBe(false)
      expect(result.isMediumScreen.value).toBe(true)
      expect(result.isLargeScreen.value).toBe(false)
    })
  })

  describe('when called with initialWidth', () => {
    it('then should pass initialWidth to useWindowSize', () => {
      useBreakpoints({ breakpoints: mockBreakpoints, initialWidth: 1000 })

      expect(useWindowSize).toHaveBeenCalledWith(expect.objectContaining({
        initialWidth: 1000,
      }))
    })
  })

  describe('when the window size changes', () => {
    it('then should update the breakpoint states', () => {
      const widthRef = ref(500)
      vi.mocked(useWindowSize).mockReturnValue({ width: widthRef } as any)

      const result = useBreakpoints({ breakpoints: mockBreakpoints })

      expect(result.isSmallScreen.value).toBe(true)
      expect(result.isMediumScreen.value).toBe(false)
      expect(result.isLargeScreen.value).toBe(false)

      widthRef.value = 1100

      expect(result.isSmallScreen.value).toBe(false)
      expect(result.isMediumScreen.value).toBe(false)
      expect(result.isLargeScreen.value).toBe(true)
    })
  })
})
