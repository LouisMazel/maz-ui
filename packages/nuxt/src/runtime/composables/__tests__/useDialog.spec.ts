import { describe, expect, it, vi } from 'vitest'

import { useDialog } from '../useDialog'

const mockDialogHandler = { open: vi.fn() }

vi.mock('nuxt/app', () => ({
  useNuxtApp: vi.fn(() => ({
    $mazDialog: mockDialogHandler,
  })),
}))

describe('useDialog', () => {
  it('should return the $mazDialog instance from nuxt app', () => {
    const result = useDialog()
    expect(result).toBe(mockDialogHandler)
  })
})
