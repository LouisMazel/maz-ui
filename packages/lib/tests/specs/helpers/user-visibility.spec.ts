import {
  UserVisibilyCallback,
  UserVisibilyOptions,
  UserVisibility,
} from '@package/helpers/user-visibility'

import { sleep } from '@package/helpers'

import { documentEmitVisibilityState } from '@tests/helpers/document-event'

const DEFAULT_TIMEOUT = 300

let callback: UserVisibilyCallback
const options: UserVisibilyOptions = {
  timeout: DEFAULT_TIMEOUT, // 5 minutes
  once: false,
  immediate: false,
}
let instance: UserVisibility | undefined

beforeEach(() => {
  callback = vitest.fn()
  documentEmitVisibilityState('visible')
  instance = new UserVisibility(callback, options)
})

afterAll(() => {
  instance = undefined
})

describe('@/plugins/idle-timeout/idle-timeout-handler.ts', () => {
  describe('Given app want trigger user idle', () => {
    describe('When instance is launch', () => {
      it('Then instance is IdleTimeout', async () => {
        expect(instance).toBeInstanceOf(UserVisibility)
        await sleep(DEFAULT_TIMEOUT)
        if (instance) {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          const startSpy = vitest.spyOn(instance, 'addEventListener')
          // @ts-ignore
          instance.addEventListener()
          /* eslint-enable @typescript-eslint/ban-ts-comment */
          expect(startSpy).toHaveBeenCalled()
        }
      })

      it('Then instance emit callback on demand', () => {
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        instance?.emitCallback()
        expect(callback).toHaveBeenCalled()
      })

      it('Then instance emit callback after timeout', async () => {
        documentEmitVisibilityState('hidden')
        expect(callback).not.toHaveBeenCalled()
        await sleep(DEFAULT_TIMEOUT)
        expect(callback).toHaveBeenCalled()
      })

      it('Then instance emit callback on demand', () => {
        instance?.destroy()
      })
    })

    describe('When instance has immediate option to "true"', () => {
      it('Then instance have called callback', () => {
        const _newInstance = new UserVisibility(callback, {
          ...options,
          immediate: true,
        })
        expect(callback).toHaveBeenCalledWith({ isVisible: true })
      })
    })

    describe('When instance has once option to "true"', () => {
      it('Then instance have called callback and is destroy', async () => {
        documentEmitVisibilityState('hidden')
        const _newInstance = new UserVisibility(callback, {
          ...options,
          once: true,
        })
        await sleep(DEFAULT_TIMEOUT)
        expect(callback).toHaveBeenCalledWith({ isVisible: false })
      })
    })
  })
})
