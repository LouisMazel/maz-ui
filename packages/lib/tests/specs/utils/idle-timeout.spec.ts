/* eslint-disable ts/ban-ts-comment */

import type { IdleTimeoutCallback, IdleTimeoutOptions } from '@utils/idleTimeout'
import {
  IdleTimeout,

} from '@utils/idleTimeout'
import { sleep } from '@utils/sleep'

const DEFAULT_TIMEOUT = 300

let callback: IdleTimeoutCallback
const options: IdleTimeoutOptions = {
  element: document.body,
  timeout: DEFAULT_TIMEOUT, // 5 minutes
  once: false,
  immediate: false,
}
let instance: IdleTimeout | undefined

beforeEach(() => {
  callback = vitest.fn()
  instance = new IdleTimeout(callback, options)
})

afterAll(() => {
  instance = undefined
})

describe('@utils/idle-timeout', () => {
  describe('given app want trigger user idle', () => {
    describe('when instance is launch', () => {
      it('then instance is IdleTimeout', () => {
        expect(instance).toBeInstanceOf(IdleTimeout)
      })

      it('then idle to be false', () => {
        expect(instance?.idle).toBeFalsy()
      })

      it('then instance returns timeout option', () => {
        expect(instance?.timeout).toBe(DEFAULT_TIMEOUT)
      })

      it('then user is new not idle callback called and idle equal "false"', async () => {
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
        expect(callback).toHaveBeenCalledWith({
          isIdle: true,
          instance: expect.any(IdleTimeout),
        })

        // @ts-expect-error
        instance?.handleEvent(
          new MouseEvent('mousemove', {
            clientX: 150,
            clientY: 5,
          }),
        )

        // expect(instance?.idle).toBeFalsy()
        expect(callback).toHaveBeenCalledWith({
          isIdle: false,
          eventType: 'mousemove',
          instance: expect.any(IdleTimeout),
        })
      })

      it('then idle is "true" and callback called after time', async () => {
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
        expect(callback).toHaveBeenCalledWith({ isIdle: true, instance: expect.any(IdleTimeout) })
      })
    })

    describe('when instance is paused', () => {
      it('then the timeout is paused and idle is falsy', async () => {
        instance?.pause()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeFalsy()
        expect(callback).not.toHaveBeenCalled()
      })

      it('then the timeout is resumed and idle is truthy after timeout', async () => {
        instance?.pause()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeFalsy()
        expect(callback).not.toHaveBeenCalled()
        instance?.resume()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
        expect(callback).toHaveBeenCalledWith({ isIdle: true, instance: expect.any(IdleTimeout) })
      })
    })

    describe('when instance is reset', () => {
      it('then instance idle is "false" and callback called', async () => {
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
        instance?.reset()
        expect(instance?.idle).toBeFalsy()
        await sleep(DEFAULT_TIMEOUT)
      })

      it('then the timeout is resumed and idle is truthy after timeout', async () => {
        instance?.pause()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeFalsy()
        instance?.resume()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
      })
    })

    describe('when instance idle has been set', () => {
      it('then instance idle set to "true"', () => {
        if (instance) {
          expect(instance.idle).toBeFalsy()
          instance.idle = true
          expect(instance.idle).toBeTruthy()
          expect(callback).toHaveBeenCalledWith({ isIdle: true, instance: expect.any(IdleTimeout) })
        }
      })

      it('then instance idle set to "false"', async () => {
        if (instance) {
          await sleep(DEFAULT_TIMEOUT)
          expect(instance.idle).toBeTruthy()
          instance.idle = false
          expect(instance.idle).toBeFalsy()
          expect(callback).toHaveBeenCalledWith({ isIdle: false, instance: expect.any(IdleTimeout) })
        }
      })
    })

    describe('when instance timeout is set', () => {
      it('then instance timeout returns new value', () => {
        if (instance) {
          expect(instance.timeout).toBe(DEFAULT_TIMEOUT)
          instance.timeout = 1000
          expect(instance.timeout).toBe(1000)
        }
      })
    })

    describe('when instance is destroy', () => {
      it('then instance not have called callback after timeout', async () => {
        instance?.destroy()
        await sleep(DEFAULT_TIMEOUT)
        expect(callback).not.toHaveBeenCalled()
        expect(instance?.destroyed).toBeTruthy()
      })
    })

    describe('when instance is destroy and reset', () => {
      it('then instance is not destroyed', () => {
        instance?.destroy()
        expect(instance?.destroyed).toBeTruthy()
        instance?.reset()
        expect(instance?.destroyed).toBeFalsy()
      })
    })

    describe('when instance has immediate option', () => {
      it('then callback is called immediately', () => {
        const immediateCallback: IdleTimeoutCallback = vitest.fn()
        // eslint-disable-next-line sonarjs/no-unused-vars
        const _immediateInstance = new IdleTimeout(immediateCallback, {
          ...options,
          immediate: true,
        })
        expect(immediateCallback).toHaveBeenCalled()
      })
    })

    describe('when instance has once option to "true"', () => {
      it('then the instance is destroy after timeout', async () => {
        const immediateCallback: IdleTimeoutCallback = vitest.fn()
        const immediateInstance = new IdleTimeout(immediateCallback, {
          ...options,
          once: true,
        })
        await sleep(DEFAULT_TIMEOUT)
        expect(immediateInstance.destroyed).toBeTruthy()
      })
    })
  })
})
