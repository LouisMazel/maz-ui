import { describe, expect, it, vi } from 'vitest'

import { useToast } from '../useToast'

const mockToastHandler = { show: vi.fn() }

vi.mock('nuxt/app', () => ({
  useNuxtApp: vi.fn(() => ({
    $mazToast: mockToastHandler,
  })),
}))

describe('useToast', () => {
  it('should return the $mazToast instance from nuxt app', () => {
    const result = useToast()
    expect(result).toBe(mockToastHandler)
  })
})
