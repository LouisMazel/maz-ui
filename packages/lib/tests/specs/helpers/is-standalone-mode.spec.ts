import type { Mock } from 'vitest'
import { isClient } from '@modules/helpers/is-client'
import { isInStandaloneMode } from '@modules/helpers/is-standalone-mode'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the is-client module
vi.mock('@modules/helpers/is-client', () => ({
  isClient: vi.fn(),
}))

describe('given isInStandaloneMode function', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when not in a client environment', () => {
    it('then it should return false', () => {
      (isClient as Mock).mockReturnValue(false)
      expect(isInStandaloneMode()).toBe(false)
    })
  })

  describe('when in a client environment', () => {
    beforeEach(() => {
      (isClient as Mock).mockReturnValue(true)
    })

    describe('and navigator.standalone is true', () => {
      it('then it should return true', () => {
        globalThis.navigator = { standalone: true } as any
        globalThis.window = {
          matchMedia: () => ({ matches: false }),
        } as any

        expect(isInStandaloneMode()).toBe(true)
      })
    })

    describe('and window.matchMedia matches standalone mode', () => {
      it('then it should return true', () => {
        globalThis.navigator = {} as any
        globalThis.window = {
          matchMedia: () => ({ matches: true }),
        } as any

        expect(isInStandaloneMode()).toBe(true)
      })
    })

    describe('and neither navigator.standalone is true nor window.matchMedia matches', () => {
      it('then it should return false', () => {
        globalThis.navigator = {} as any
        globalThis.window = {
          matchMedia: () => ({ matches: false }),
        } as any

        expect(isInStandaloneMode()).toBe(false)
      })
    })
  })
})
