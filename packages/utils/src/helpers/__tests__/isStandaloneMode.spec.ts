import type { Mock } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isClient } from '../isClient'
import { isStandaloneMode } from '../isStandaloneMode'

// Mock the isClient module
vi.mock('../isClient', () => ({
  isClient: vi.fn(),
}))

describe('given isStandaloneMode function', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when not in a client environment', () => {
    it('then it should return false', () => {
      (isClient as Mock).mockReturnValue(false)
      expect(isStandaloneMode()).toBe(false)
    })
  })

  describe('when in a client environment', () => {
    beforeEach(() => {
      (isClient as Mock).mockReturnValue(true)
    })

    describe('and navigator.standalone is true', () => {
      it('then it should return true', () => {
        vi.stubGlobal('navigator', {
          standalone: true,
        })
        vi.stubGlobal('matchMedia', () => ({ matches: false }))

        expect(isStandaloneMode()).toBe(true)
      })
    })

    describe('and window.matchMedia matches standalone mode', () => {
      it('then it should return true', () => {
        vi.stubGlobal('navigator', {
          standalone: false,
        })
        vi.stubGlobal('matchMedia', () => ({ matches: true }))

        expect(isStandaloneMode()).toBe(true)
      })
    })

    describe('and neither navigator.standalone is true nor window.matchMedia matches', () => {
      it('then it should return false', () => {
        vi.stubGlobal('navigator', {})
        vi.stubGlobal('matchMedia', () => ({ matches: false }))

        expect(isStandaloneMode()).toBe(false)
      })
    })
  })
})
