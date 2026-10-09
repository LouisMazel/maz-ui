import type { LogLevel } from '../logger'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLogger } from '../logger'

// consola writes through process.stdout/stderr. Stub them so the test runner
// stays clean and we can verify visibility for each level.
let stdoutSpy: ReturnType<typeof vi.spyOn>
let stderrSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
})

afterEach(() => {
  stdoutSpy.mockRestore()
  stderrSpy.mockRestore()
})

function totalWrites(): number {
  return stdoutSpy.mock.calls.length + stderrSpy.mock.calls.length
}

describe('createLogger', () => {
  it('returns an object with the expected methods', () => {
    const logger = createLogger()
    expect(typeof logger.setLevel).toBe('function')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.debug).toBe('function')
    expect(typeof logger.verbose).toBe('function')
    expect(typeof logger.box).toBe('function')
  })

  it.each([
    'silent',
    'error',
    'warning',
    'normal',
    'default',
    'debug',
    'trace',
    'verbose',
  ] satisfies LogLevel[])('accepts level %s', (level) => {
    const logger = createLogger()
    expect(() => logger.setLevel(level)).not.toThrow()
  })

  it('silent level suppresses output for every method', () => {
    const logger = createLogger()
    logger.setLevel('silent')
    logger.info('hello')
    logger.debug('hello')
    logger.verbose('hello')
    logger.box({ title: 't', message: 'm' })
    expect(totalWrites()).toBe(0)
  })

  it('verbose level lets every method through', () => {
    const logger = createLogger()
    logger.setLevel('verbose')
    logger.info('hello')
    logger.debug('hello')
    logger.verbose('hello')
    logger.box({ title: 't', message: 'm' })
    expect(totalWrites()).toBeGreaterThan(0)
  })
})
