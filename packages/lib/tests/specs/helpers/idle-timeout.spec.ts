import {
  IdleTimeoutOptions,
  IdleTimeoutCallback,
  IdleTimeout,
} from '@package/helpers/idle-timeout'

import { sleep } from '@package/helpers'

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

describe('package/helpers/idle-timeout', () => {
  describe('Given app want trigger user idle', () => {
    describe('When instance is launch', () => {
      it('Then instance is IdleTimeout', () => {
        expect(instance).toBeInstanceOf(IdleTimeout)
      })

      it('Then idle to be false', () => {
        expect(instance?.idle).toBeFalsy()
      })

      it('Then instance returns timeout option', () => {
        expect(instance?.timeout).toBe(DEFAULT_TIMEOUT)
      })

      it('Then user is new not idle callback called and idle equal "false"', async () => {
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
        expect(callback).toHaveBeenCalledWith({
          isIdle: true,
        })

        /* eslint-disable */
        // @ts-ignore
        instance?.handleEvent(
          new MouseEvent('mousemove', {
            clientX: 150,
            clientY: 5,
          }),
        )
        /* eslint-enable */

        // expect(instance?.idle).toBeFalsy()
        expect(callback).toHaveBeenCalledWith({
          isIdle: false,
          eventType: 'mousemove',
        })
      })

      it('Then idle is "true" and callback called after time', async () => {
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
        expect(callback).toHaveBeenCalledWith({ isIdle: true })
      })
    })

    describe('When instance is paused', () => {
      it('Then the timeout is paused and idle is falsy', async () => {
        instance?.pause()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeFalsy()
        expect(callback).not.toHaveBeenCalled()
      })

      it('Then the timeout is resumed and idle is truthy after timeout', async () => {
        instance?.pause()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeFalsy()
        expect(callback).not.toHaveBeenCalled()
        instance?.resume()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
        expect(callback).toHaveBeenCalledWith({ isIdle: true })
      })
    })

    describe('When instance is reset', () => {
      it('Then instance idle is "false" and callback called', async () => {
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
        instance?.reset()
        expect(instance?.idle).toBeFalsy()
        await sleep(DEFAULT_TIMEOUT)
      })

      it('Then the timeout is resumed and idle is truthy after timeout', async () => {
        instance?.pause()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeFalsy()
        instance?.resume()
        await sleep(DEFAULT_TIMEOUT)
        expect(instance?.idle).toBeTruthy()
      })
    })

    describe('When instance idle has been set', () => {
      it('Then instance idle set to "true"', () => {
        if (instance) {
          expect(instance.idle).toBeFalsy()
          instance.idle = true
          expect(instance.idle).toBeTruthy()
          expect(callback).toHaveBeenCalledWith({ isIdle: true })
        }
      })

      it('Then instance idle set to "false"', async () => {
        if (instance) {
          await sleep(DEFAULT_TIMEOUT)
          expect(instance.idle).toBeTruthy()
          instance.idle = false
          expect(instance.idle).toBeFalsy()
          expect(callback).toHaveBeenCalledWith({ isIdle: false })
        }
      })
    })

    describe('When instance timeout is set', () => {
      it('Then instance timeout returns new value', () => {
        if (instance) {
          expect(instance.timeout).toBe(DEFAULT_TIMEOUT)
          instance.timeout = 1000
          expect(instance.timeout).toBe(1000)
        }
      })
    })

    describe('When instance is destroy', () => {
      it('Then instance not have called callback after timeout', async () => {
        instance?.destroy()
        await sleep(DEFAULT_TIMEOUT)
        expect(callback).not.toHaveBeenCalled()
        expect(instance?.destroyed).toBeTruthy()
      })
    })

    describe('When instance is destroy and reset', () => {
      it('Then instance is not destroyed', () => {
        instance?.destroy()
        expect(instance?.destroyed).toBeTruthy()
        instance?.reset()
        expect(instance?.destroyed).toBeFalsy()
      })
    })

    describe('When instance has immediate option', () => {
      it('Then callback is called immediately', () => {
        const immediateCallback: IdleTimeoutCallback = vitest.fn()
        const _immediateInstance = new IdleTimeout(immediateCallback, {
          ...options,
          immediate: true,
        })
        expect(immediateCallback).toHaveBeenCalled()
      })
    })

    describe('When instance has once option to "true"', () => {
      it('Then the instance is destroy after timeout', async () => {
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
