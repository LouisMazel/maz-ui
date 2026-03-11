import { beforeEach, describe, expect, it, vi } from 'vitest'

import toastPlugin from '../toast'

const { MockToastHandler, toastInstances } = vi.hoisted(() => {
  const toastInstances: any[] = []
  class MockToastHandler {
    show = vi.fn()
    success = vi.fn()
    error = vi.fn()
    warning = vi.fn()
    info = vi.fn()
    message = vi.fn()
    constructor(...args: any[]) {
      toastInstances.push({ args, instance: this })
    }
  }
  return { MockToastHandler, toastInstances }
})

vi.mock('maz-ui/plugins/toast', () => ({
  ToastHandler: MockToastHandler,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('toast plugin', () => {
  beforeEach(() => {
    toastInstances.length = 0
  })

  it('should create ToastHandler with vueApp', () => {
    const vueApp = {}
    const context = {
      $config: { public: { mazUi: { plugins: { toast: true } } } },
      vueApp,
    }

    ;(toastPlugin as (...args: any[]) => any)(context)

    expect(toastInstances).toHaveLength(1)
    expect(toastInstances[0].args[0]).toBe(vueApp)
    expect(toastInstances[0].args[1]).toBeUndefined()
  })

  it('should pass toast options when config is an object', () => {
    const vueApp = {}
    const toastOptions = { position: 'top-right', timeout: 5000 }
    const context = {
      $config: { public: { mazUi: { plugins: { toast: toastOptions } } } },
      vueApp,
    }

    ;(toastPlugin as (...args: any[]) => any)(context)

    expect(toastInstances[0].args[1]).toEqual(toastOptions)
  })

  it('should provide mazToast in client mode (import.meta.server is false)', () => {
    const vueApp = {}
    const context = {
      $config: { public: { mazUi: { plugins: { toast: true } } } },
      vueApp,
    }

    const result = (toastPlugin as (...args: any[]) => any)(context)

    expect(result.provide.mazToast).toBeInstanceOf(MockToastHandler)
  })

  it('should pass undefined options when toast is boolean', () => {
    const vueApp = {}
    const context = {
      $config: { public: { mazUi: { plugins: { toast: true } } } },
      vueApp,
    }

    ;(toastPlugin as (...args: any[]) => any)(context)

    expect(toastInstances[0].args[1]).toBeUndefined()
  })
})
