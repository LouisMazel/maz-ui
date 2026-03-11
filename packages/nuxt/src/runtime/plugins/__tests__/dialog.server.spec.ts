import { describe, expect, it, vi } from 'vitest'

import dialogPlugin from '../dialog'

const { MockDialogHandler } = vi.hoisted(() => {
  class MockDialogHandler {
    open = vi.fn()
  }
  return { MockDialogHandler }
})

vi.mock('maz-ui/plugins/dialog', () => ({
  DialogHandler: MockDialogHandler,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('dialog plugin (server)', () => {
  it('should provide server stub on server', () => {
    const vueApp = {}
    const context = {
      $config: { public: { mazUi: { plugins: { dialog: true } } } },
      vueApp,
    }

    const result = (dialogPlugin as (...args: any[]) => any)(context)

    const stub = result.provide.mazDialog
    expect(stub).not.toBeInstanceOf(MockDialogHandler)
    const openResult = stub.open()
    expect(openResult).toHaveProperty('promise')
    expect(openResult).toHaveProperty('destroy')
    expect(openResult).toHaveProperty('close')
    openResult.destroy()
    openResult.close()
  })
})
