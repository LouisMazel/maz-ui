import type { Mock } from 'vitest'

interface ConsolaSpies {
  level: number
  info: Mock
  debug: Mock
  verbose: Mock
  box: Mock
}

const { consolaSpies } = vi.hoisted<{ consolaSpies: ConsolaSpies }>(() => {
  const spies: ConsolaSpies = {
    level: 0,
    info: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
    box: vi.fn(),
  }
  return { consolaSpies: spies }
})

vi.mock('consola', () => ({
  createConsola: () => consolaSpies,
}))

const { createLogger } = await import('../src/configs/logger')

describe('createLogger', () => {
  beforeEach(() => {
    consolaSpies.info.mockClear()
    consolaSpies.debug.mockClear()
    consolaSpies.verbose.mockClear()
    consolaSpies.box.mockClear()
    consolaSpies.level = 0
  })

  describe('when forwarding methods', () => {
    it('forwards info, debug, verbose and box calls to the consola instance', () => {
      const logger = createLogger()

      logger.info('info message')
      logger.debug('debug message')
      logger.verbose('verbose message')
      logger.box({ title: 'title', message: 'body' })

      expect(consolaSpies.info).toHaveBeenCalledWith('info message')
      expect(consolaSpies.debug).toHaveBeenCalledWith('debug message')
      expect(consolaSpies.verbose).toHaveBeenCalledWith('verbose message')
      expect(consolaSpies.box).toHaveBeenCalledWith({ title: 'title', message: 'body' })
    })
  })

  describe('when calling setLevel', () => {
    it('maps "silent" to negative infinity on the consola instance', () => {
      const logger = createLogger()
      logger.setLevel('silent')
      expect(consolaSpies.level).toBe(Number.NEGATIVE_INFINITY)
    })

    it('maps "error" to 0', () => {
      const logger = createLogger()
      logger.setLevel('error')
      expect(consolaSpies.level).toBe(0)
    })

    it('maps "warning" to 1', () => {
      const logger = createLogger()
      logger.setLevel('warning')
      expect(consolaSpies.level).toBe(1)
    })

    it('maps "normal" to 2', () => {
      const logger = createLogger()
      logger.setLevel('normal')
      expect(consolaSpies.level).toBe(2)
    })

    it('maps "default" to 3', () => {
      const logger = createLogger()
      logger.setLevel('default')
      expect(consolaSpies.level).toBe(3)
    })

    it('maps "debug" to 4', () => {
      const logger = createLogger()
      logger.setLevel('debug')
      expect(consolaSpies.level).toBe(4)
    })

    it('maps "trace" to 5', () => {
      const logger = createLogger()
      logger.setLevel('trace')
      expect(consolaSpies.level).toBe(5)
    })

    it('maps "verbose" to positive infinity', () => {
      const logger = createLogger()
      logger.setLevel('verbose')
      expect(consolaSpies.level).toBe(Number.POSITIVE_INFINITY)
    })
  })
})
