import process from 'node:process'
import { createLogger, logger } from '../logger'

describe('given logger module', () => {
  describe('given createLogger function', () => {
    describe('when called without options', () => {
      it('then creates a logger instance with default level 3', () => {
        const log = createLogger()
        expect(log.getLevel()).toBe(3)
      })
    })

    describe('when called with custom level', () => {
      it('then creates a logger instance with the specified level', () => {
        const log = createLogger({ level: 0 })
        expect(log.getLevel()).toBe(0)
      })
    })
  })

  describe('given default logger instance', () => {
    describe('when imported', () => {
      it('then is defined with default level 3', () => {
        expect(logger).toBeDefined()
        expect(logger.getLevel()).toBe(3)
      })
    })
  })

  describe('given setLevel and getLevel methods', () => {
    describe('when setting various log levels', () => {
      it.each([
        { level: 'silent', value: Number.NEGATIVE_INFINITY },
        { level: 'error', value: 0 },
        { level: 'warning', value: 1 },
        { level: 'normal', value: 2 },
        { level: 'default', value: 3 },
        { level: 'debug', value: 4 },
        { level: 'trace', value: 5 },
        { level: 'verbose', value: Number.POSITIVE_INFINITY },
      ] as const)('then returns the correct numeric level for "$level"', ({ level, value }) => {
        const log = createLogger()
        log.setLevel(level)
        expect(log.getLevel()).toBe(value)
      })
    })
  })

  describe('given logging methods', () => {
    let log: ReturnType<typeof createLogger>

    beforeEach(() => {
      log = createLogger({ level: Number.POSITIVE_INFINITY })
    })

    describe('when calling log method', () => {
      it('then does not throw', () => {
        expect(() => log.log('test message')).not.toThrow()
      })
    })

    describe('when calling info method', () => {
      it('then does not throw', () => {
        expect(() => log.info('test info')).not.toThrow()
      })
    })

    describe('when calling warn method', () => {
      it('then does not throw', () => {
        expect(() => log.warn('test warn')).not.toThrow()
      })
    })

    describe('when calling error method', () => {
      it('then does not throw', () => {
        expect(() => log.error('test error')).not.toThrow()
      })
    })

    describe('when calling success method', () => {
      it('then does not throw', () => {
        expect(() => log.success('test success')).not.toThrow()
      })
    })

    describe('when calling debug method', () => {
      it('then does not throw', () => {
        expect(() => log.debug('test debug')).not.toThrow()
      })
    })

    describe('when calling trace method', () => {
      it('then does not throw', () => {
        expect(() => log.trace('test trace')).not.toThrow()
      })
    })

    describe('when calling verbose method', () => {
      it('then does not throw', () => {
        expect(() => log.verbose('test verbose')).not.toThrow()
      })
    })

    describe('when calling fatal method', () => {
      it('then does not throw', () => {
        expect(() => log.fatal('test fatal')).not.toThrow()
      })
    })

    describe('when calling ready method', () => {
      it('then does not throw', () => {
        expect(() => log.ready('test ready')).not.toThrow()
      })
    })

    describe('when calling fail method', () => {
      it('then does not throw', () => {
        expect(() => log.fail('test fail')).not.toThrow()
      })
    })

    describe('when calling start method', () => {
      it('then does not throw', () => {
        expect(() => log.start('test start')).not.toThrow()
      })
    })

    describe('when calling silent method', () => {
      it('then does not throw', () => {
        expect(() => log.silent('test silent')).not.toThrow()
      })
    })

    describe('when calling box method', () => {
      it('then does not throw', () => {
        expect(() => log.box('test box')).not.toThrow()
      })
    })

    describe('when passing additional arguments to log methods', () => {
      it('then does not throw', () => {
        expect(() => log.log('message', 'arg1', 'arg2')).not.toThrow()
        expect(() => log.info('message', { key: 'value' })).not.toThrow()
        expect(() => log.error('message', new Error('test'))).not.toThrow()
      })
    })
  })

  describe('given console methods', () => {
    let log: ReturnType<typeof createLogger>

    beforeEach(() => {
      log = createLogger()
    })

    describe('when calling divider without arguments', () => {
      it('then logs a line of "=" characters', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
        log.divider()
        expect(spy).toHaveBeenCalledTimes(1)
        const output = spy.mock.calls[0][0] as string
        expect(output).toMatch(/^=+$/)
        spy.mockRestore()
      })
    })

    describe('when calling divider with a custom character', () => {
      it('then logs a line of the custom character', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
        log.divider('-')
        expect(spy).toHaveBeenCalledTimes(1)
        const output = spy.mock.calls[0][0] as string
        expect(output).toMatch(/^-+$/)
        spy.mockRestore()
      })
    })

    describe('when process.stdout.columns is undefined', () => {
      it('then uses fallback width of 20', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
        const originalColumns = process.stdout.columns
        Object.defineProperty(process.stdout, 'columns', { value: 0, configurable: true })
        log.divider()
        const output = spy.mock.calls[0][0] as string
        expect(output).toBe('='.repeat(20))
        Object.defineProperty(process.stdout, 'columns', { value: originalColumns, configurable: true })
        spy.mockRestore()
      })
    })

    describe('when calling eot', () => {
      it('then logs an empty call', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
        log.eot()
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith()
        spy.mockRestore()
      })
    })

    describe('when calling break without arguments', () => {
      it('then logs one empty line', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
        log.break()
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith('')
        spy.mockRestore()
      })
    })

    describe('when calling break with count 3', () => {
      it('then logs three empty lines', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
        log.break(3)
        expect(spy).toHaveBeenCalledTimes(3)
        spy.mockRestore()
      })
    })

    describe('when calling brand', () => {
      it('then logs the colored message', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
        log.brand('test brand')
        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })
    })

    describe('when calling clear', () => {
      it('then calls console.clear', () => {
        const spy = vi.spyOn(console, 'clear').mockImplementation(() => {})
        log.clear()
        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
      })
    })
  })

  describe('given reporter management', () => {
    describe('when adding and removing a reporter', () => {
      it('then does not throw', () => {
        const log = createLogger()
        const reporter = { log: vi.fn() }
        expect(() => log.addReporter(reporter)).not.toThrow()
        expect(() => log.removeReporter(reporter)).not.toThrow()
      })
    })
  })
})
