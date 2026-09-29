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
    it.each([
      ['silent', Number.NEGATIVE_INFINITY],
      ['error', 0],
      ['warning', 1],
      ['normal', 2],
      ['default', 3],
      ['debug', 4],
      ['trace', 5],
      ['verbose', Number.POSITIVE_INFINITY],
    ] as const)('maps "%s" to the matching consola level', (level, expected) => {
      const logger = createLogger()
      logger.setLevel(level)
      expect(consolaSpies.level).toBe(expected)
    })
  })
})
