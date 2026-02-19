import { resolveLinkComponent } from '@/utils/resolveLinkComponent'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    getCurrentInstance: vi.fn(),
  }
})

describe('Given resolveLinkComponent helper', () => {
  describe('When NuxtLink is available', () => {
    it('Then it returns NuxtLink', async () => {
      const mockApp = {
        component: vi.fn(name => name === 'NuxtLink' ? 'NuxtLink' : null),
      }

      const { getCurrentInstance } = await import('vue')
      vi.mocked(getCurrentInstance).mockReturnValue({
        appContext: { app: mockApp },
      } as any)

      const result = resolveLinkComponent()

      expect(result).toBe('NuxtLink')
      expect(mockApp.component).toHaveBeenCalledWith('NuxtLink')
    })
  })

  describe('When only RouterLink is available', () => {
    it('Then it returns RouterLink', async () => {
      const mockApp = {
        component: vi.fn(name => name === 'RouterLink' ? 'RouterLink' : null),
      }

      const { getCurrentInstance } = await import('vue')
      vi.mocked(getCurrentInstance).mockReturnValue({
        appContext: { app: mockApp },
      } as any)

      const result = resolveLinkComponent()

      expect(result).toBe('RouterLink')
      expect(mockApp.component).toHaveBeenCalledWith('NuxtLink')
      expect(mockApp.component).toHaveBeenCalledWith('RouterLink')
    })
  })

  describe('When no router components are available', () => {
    it('Then it returns anchor tag and log warning', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const mockApp = {
        component: vi.fn(() => null),
      }

      const { getCurrentInstance } = await import('vue')
      vi.mocked(getCurrentInstance).mockReturnValue({
        appContext: { app: mockApp },
      } as any)

      const result = resolveLinkComponent()

      expect(result).toBe('a')
      expect(consoleSpy).toHaveBeenCalledWith(
        'Your are using "to" property but no router component found (NuxtLink or RouterLink), falling back to anchor ("<a />" - HTMLAnchorElement) tag',
      )

      consoleSpy.mockRestore()
    })
  })

  describe('When getCurrentInstance returns null', () => {
    it('Then it returns anchor tag and log warning', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { getCurrentInstance } = await import('vue')
      vi.mocked(getCurrentInstance).mockReturnValue(null)

      const result = resolveLinkComponent()

      expect(result).toBe('a')
      expect(consoleSpy).toHaveBeenCalledWith(
        'Your are using "to" property but no router component found (NuxtLink or RouterLink), falling back to anchor ("<a />" - HTMLAnchorElement) tag',
      )

      consoleSpy.mockRestore()
    })
  })

  describe('When app context is not available', () => {
    it('Then it returns anchor tag and log warning', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { getCurrentInstance } = await import('vue')
      vi.mocked(getCurrentInstance).mockReturnValue({
        appContext: { app: null },
      } as any)

      const result = resolveLinkComponent()

      expect(result).toBe('a')
      expect(consoleSpy).toHaveBeenCalledWith(
        'Your are using "to" property but no router component found (NuxtLink or RouterLink), falling back to anchor ("<a />" - HTMLAnchorElement) tag',
      )

      consoleSpy.mockRestore()
    })
  })
})
