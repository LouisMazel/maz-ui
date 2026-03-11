import { beforeEach, describe, expect, it, vi } from 'vitest'

import dialogPlugin from '../dialog'

const { MockDialogHandler, dialogInstances } = vi.hoisted(() => {
  const dialogInstances: any[] = []
  class MockDialogHandler {
    open = vi.fn()
    constructor(...args: any[]) {
      dialogInstances.push({ args, instance: this })
    }
  }
  return { MockDialogHandler, dialogInstances }
})

vi.mock('maz-ui/plugins/dialog', () => ({
  DialogHandler: MockDialogHandler,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('dialog plugin', () => {
  beforeEach(() => {
    dialogInstances.length = 0
  })

  it('should create DialogHandler with vueApp', () => {
    const vueApp = {}
    const context = {
      $config: { public: { mazUi: { plugins: { dialog: true } } } },
      vueApp,
    }

    ;(dialogPlugin as (...args: any[]) => any)(context)

    expect(dialogInstances).toHaveLength(1)
    expect(dialogInstances[0].args[0]).toBe(vueApp)
    expect(dialogInstances[0].args[1]).toBeUndefined()
  })

  it('should pass dialog options when config is an object', () => {
    const vueApp = {}
    const dialogOptions = { closable: false }
    const context = {
      $config: { public: { mazUi: { plugins: { dialog: dialogOptions } } } },
      vueApp,
    }

    ;(dialogPlugin as (...args: any[]) => any)(context)

    expect(dialogInstances[0].args[1]).toEqual(dialogOptions)
  })

  it('should provide mazDialog in client mode (import.meta.server is false)', () => {
    const vueApp = {}
    const context = {
      $config: { public: { mazUi: { plugins: { dialog: true } } } },
      vueApp,
    }

    const result = (dialogPlugin as (...args: any[]) => any)(context)

    expect(result.provide.mazDialog).toBeInstanceOf(MockDialogHandler)
  })

  it('should pass undefined options when dialog is boolean', () => {
    const vueApp = {}
    const context = {
      $config: { public: { mazUi: { plugins: { dialog: true } } } },
      vueApp,
    }

    ;(dialogPlugin as (...args: any[]) => any)(context)

    expect(dialogInstances[0].args[1]).toBeUndefined()
  })
})
