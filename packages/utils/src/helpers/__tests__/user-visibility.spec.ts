/* eslint-disable ts/ban-ts-comment */

import type { UserVisibilyCallback, UserVisibilyOptions } from '../userVisibility'

import { sleep } from '../sleep'
import {
  UserVisibility,

} from '../userVisibility'

function documentEmitEvent(event: string) {
  return document.dispatchEvent(new Event(event))
}

function documentEmitVisibilityState(value: 'hidden' | 'visible') {
  Object.defineProperty(document, 'visibilityState', {
    value,
    writable: true,
  })
  documentEmitEvent('visibilitychange')
}

const DEFAULT_TIMEOUT = 300

let callback: UserVisibilyCallback
const options: UserVisibilyOptions = {
  timeout: DEFAULT_TIMEOUT, // 5 minutes
  once: false,
  immediate: false,
}
let instance: UserVisibility | undefined

beforeEach(() => {
  callback = vi.fn()
  documentEmitVisibilityState('visible')
  instance = new UserVisibility(callback, options)
})

afterAll(() => {
  instance = undefined
})

describe('user-visibility.ts', () => {
  describe('given app want trigger user idle', () => {
    describe('when instance is launch', () => {
      it('then instance is IdleTimeout', async () => {
        expect(instance).toBeInstanceOf(UserVisibility)
        await sleep(DEFAULT_TIMEOUT)
        if (instance) {
          // @ts-expect-error
          const startSpy = vitest.spyOn(instance, 'addEventListener')
          // @ts-expect-error
          instance.addEventListener()
          expect(startSpy).toHaveBeenCalled()
        }
      })

      it('then instance emit callback on demand', () => {
        // @ts-expect-error
        instance?.emitCallback()
        expect(callback).toHaveBeenCalled()
      })

      it('then instance emit callback after timeout', async () => {
        documentEmitVisibilityState('hidden')
        expect(callback).not.toHaveBeenCalled()
        await sleep(DEFAULT_TIMEOUT)
        expect(callback).toHaveBeenCalled()
      })

      it('then instance is destroy', () => {
        instance?.destroy()
      })
    })

    describe('when instance has immediate option to "true"', () => {
      it('then instance have called callback', () => {
        // eslint-disable-next-line sonarjs/no-unused-vars
        const _newInstance = new UserVisibility(callback, {
          ...options,
          immediate: true,
        })
        expect(callback).toHaveBeenCalledWith({ isVisible: true })
      })
    })

    describe('when instance has once option to "true"', () => {
      it('then instance have called callback and is destroy', async () => {
        documentEmitVisibilityState('hidden')

        // eslint-disable-next-line sonarjs/no-unused-vars
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
