import { describe, expect, it, vi } from 'vitest'

import { useWait } from '../useWait'

const mockWaitHandler = { start: vi.fn(), stop: vi.fn() }

vi.mock('nuxt/app', () => ({
  useNuxtApp: vi.fn(() => ({
    $mazWait: mockWaitHandler,
  })),
}))

describe('useWait', () => {
  it('should return the $mazWait instance from nuxt app', () => {
    const result = useWait()
    expect(result).toBe(mockWaitHandler)
  })
})
