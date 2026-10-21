import { isIos } from '@maz-ui/utils/helpers/isIos'
import { useHead } from 'nuxt/app'
import { afterEach, describe, expect, it, vi } from 'vitest'

import preventIosInputZoomPlugin from '../prevent-ios-input-zoom.client'

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: (plugin: unknown) => plugin,
  useHead: vi.fn(),
}))

vi.mock('@maz-ui/utils/helpers/isIos', () => ({
  isIos: vi.fn(),
}))

function runPlugin({ ios, viewport }: { ios: boolean, viewport?: string }) {
  vi.mocked(isIos).mockReturnValue(ios)
  vi.stubGlobal('document', {
    querySelector: () => viewport === undefined ? null : { getAttribute: () => viewport },
  })

  ;(preventIosInputZoomPlugin as unknown as () => void)()
}

describe('given the prevent-ios-input-zoom plugin', () => {
  afterEach(() => {
    vi.mocked(useHead).mockClear()
    vi.unstubAllGlobals()
  })

  describe('when the device is iOS and the page has a viewport', () => {
    it('then it sets the viewport with maximum-scale=1 through useHead', () => {
      runPlugin({ ios: true, viewport: 'width=device-width, initial-scale=1' })

      expect(useHead).toHaveBeenCalledWith({
        meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }],
      })
    })
  })

  describe('when the device is not iOS', () => {
    it('then it does not change the viewport', () => {
      runPlugin({ ios: false, viewport: 'width=device-width, initial-scale=1' })

      expect(useHead).not.toHaveBeenCalled()
    })
  })

  describe('when the page has no viewport', () => {
    it('then it does not add one', () => {
      runPlugin({ ios: true })

      expect(useHead).not.toHaveBeenCalled()
    })
  })
})
