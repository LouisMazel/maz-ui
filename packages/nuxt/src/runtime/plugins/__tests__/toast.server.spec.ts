import { describe, expect, it, vi } from 'vitest'

import toastPlugin from '../toast'

const { MockToastHandler } = vi.hoisted(() => {
  class MockToastHandler {
    show = vi.fn()
  }
  return { MockToastHandler }
})

vi.mock('maz-ui/plugins/toast', () => ({
  ToastHandler: MockToastHandler,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('toast plugin (server)', () => {
  it('should provide server stub on server', () => {
    const vueApp = {}
    const context = {
      $config: { public: { mazUi: { plugins: { toast: true } } } },
      vueApp,
    }

    const result = (toastPlugin as (...args: any[]) => any)(context)

    const stub = result.provide.mazToast
    expect(stub).not.toBeInstanceOf(MockToastHandler)
    stub.show('test')
    stub.success('test')
    stub.error('test')
    stub.warning('test')
    stub.info('test')
    stub.message('test')
  })
})
