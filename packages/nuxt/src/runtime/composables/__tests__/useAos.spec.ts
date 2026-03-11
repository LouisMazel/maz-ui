import { describe, expect, it, vi } from 'vitest'

import { useAos } from '../useAos'

const mockAosHandler = { observe: vi.fn(), unobserve: vi.fn() }

vi.mock('nuxt/app', () => ({
  useNuxtApp: vi.fn(() => ({
    $mazAos: mockAosHandler,
  })),
}))

describe('useAos', () => {
  it('should return the $mazAos instance from nuxt app', () => {
    const result = useAos()
    expect(result).toBe(mockAosHandler)
  })
})
