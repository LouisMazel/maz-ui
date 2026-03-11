import process from 'node:process'
import { createLogger, logger } from '../logger'

describe('logger', () => {
  describe('createLogger', () => {
    it('should create a logger instance with default level', () => {
      const log = createLogger()
      expect(log.getLevel()).toBe(3)
    })

    it('should create a logger instance with custom level', () => {
      const log = createLogger({ level: 0 })
      expect(log.getLevel()).toBe(0)
    })
  })

  describe('default logger', () => {
    it('should be an instance created with default options', () => {
      expect(logger).toBeDefined()
      expect(logger.getLevel()).toBe(3)
    })
  })

  describe('setLevel / getLevel', () => {
    it('should set and get log level', () => {
      const log = createLogger()

      log.setLevel('silent')
      expect(log.getLevel()).toBe(Number.NEGATIVE_INFINITY)

      log.setLevel('error')
      expect(log.getLevel()).toBe(0)

      log.setLevel('warning')
      expect(log.getLevel()).toBe(1)

      log.setLevel('normal')
      expect(log.getLevel()).toBe(2)

      log.setLevel('default')
      expect(log.getLevel()).toBe(3)

      log.setLevel('debug')
      expect(log.getLevel()).toBe(4)

      log.setLevel('trace')
      expect(log.getLevel()).toBe(5)

      log.setLevel('verbose')
      expect(log.getLevel()).toBe(Number.POSITIVE_INFINITY)
    })
  })

  describe('logging methods', () => {
    let log: ReturnType<typeof createLogger>

    beforeEach(() => {
      log = createLogger({ level: Number.POSITIVE_INFINITY })
    })

    it('should call log method', () => {
      expect(() => log.log('test message')).not.toThrow()
    })

    it('should call info method', () => {
      expect(() => log.info('test info')).not.toThrow()
    })

    it('should call warn method', () => {
      expect(() => log.warn('test warn')).not.toThrow()
    })

    it('should call error method', () => {
      expect(() => log.error('test error')).not.toThrow()
    })

    it('should call success method', () => {
      expect(() => log.success('test success')).not.toThrow()
    })

    it('should call debug method', () => {
      expect(() => log.debug('test debug')).not.toThrow()
    })

    it('should call trace method', () => {
      expect(() => log.trace('test trace')).not.toThrow()
    })

    it('should call verbose method', () => {
      expect(() => log.verbose('test verbose')).not.toThrow()
    })

    it('should call fatal method', () => {
      expect(() => log.fatal('test fatal')).not.toThrow()
    })

    it('should call ready method', () => {
      expect(() => log.ready('test ready')).not.toThrow()
    })

    it('should call fail method', () => {
      expect(() => log.fail('test fail')).not.toThrow()
    })

    it('should call start method', () => {
      expect(() => log.start('test start')).not.toThrow()
    })

    it('should call silent method', () => {
      expect(() => log.silent('test silent')).not.toThrow()
    })

    it('should call box method', () => {
      expect(() => log.box('test box')).not.toThrow()
    })

    it('should pass additional arguments to log methods', () => {
      expect(() => log.log('message', 'arg1', 'arg2')).not.toThrow()
      expect(() => log.info('message', { key: 'value' })).not.toThrow()
      expect(() => log.error('message', new Error('test'))).not.toThrow()
    })
  })

  describe('console methods', () => {
    let log: ReturnType<typeof createLogger>

    beforeEach(() => {
      log = createLogger()
    })

    it('should call divider with default character', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      log.divider()
      expect(spy).toHaveBeenCalledTimes(1)
      const output = spy.mock.calls[0][0] as string
      expect(output).toMatch(/^=+$/)
      spy.mockRestore()
    })

    it('should call divider with custom character', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      log.divider('-')
      expect(spy).toHaveBeenCalledTimes(1)
      const output = spy.mock.calls[0][0] as string
      expect(output).toMatch(/^-+$/)
      spy.mockRestore()
    })

    it('should use fallback width when process.stdout.columns is undefined', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const originalColumns = process.stdout.columns
      Object.defineProperty(process.stdout, 'columns', { value: 0, configurable: true })
      log.divider()
      const output = spy.mock.calls[0][0] as string
      expect(output).toBe('='.repeat(20))
      Object.defineProperty(process.stdout, 'columns', { value: originalColumns, configurable: true })
      spy.mockRestore()
    })

    it('should call eot', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      log.eot()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith()
      spy.mockRestore()
    })

    it('should call break with default count', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      log.break()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('')
      spy.mockRestore()
    })

    it('should call break with custom count', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      log.break(3)
      expect(spy).toHaveBeenCalledTimes(3)
      spy.mockRestore()
    })

    it('should call brand with colored message', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      log.brand('test brand')
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })

    it('should call clear', () => {
      const spy = vi.spyOn(console, 'clear').mockImplementation(() => {})
      log.clear()
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })
  })

  describe('reporter management', () => {
    it('should add and remove reporters', () => {
      const log = createLogger()
      const reporter = { log: vi.fn() }
      expect(() => log.addReporter(reporter)).not.toThrow()
      expect(() => log.removeReporter(reporter)).not.toThrow()
    })
  })
})
