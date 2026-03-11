import { execPromise } from '../execPromise'

describe('given execPromise function', () => {
  describe('given basic execution', () => {
    describe('when executing a simple command', () => {
      it('then returns stdout with the command output', async () => {
        const result = await execPromise('echo "hello"', { noSuccess: true })
        expect(result.stdout.trim()).toBe('hello')
      })
    })

    describe('when executing a command with noStdout option', () => {
      it('then resolves with stdout and stderr properties', async () => {
        const result = await execPromise('echo "output"', { noSuccess: true, noStdout: true })
        expect(result).toHaveProperty('stdout')
        expect(result).toHaveProperty('stderr')
      })
    })

    describe('when executing a non-existent command', () => {
      it('then rejects with an error', async () => {
        await expect(
          execPromise('nonexistent_command_xyz', { noError: true }),
        ).rejects.toThrow()
      })
    })
  })

  describe('given logging options', () => {
    describe('when no options are provided', () => {
      it('then logs success message', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "test"', { logger })
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Success'))
      })
    })

    describe('when noSuccess is true', () => {
      it('then does not log the success message', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "test"', { logger, noSuccess: true })
        expect(logger.info).not.toHaveBeenCalled()
      })
    })

    describe('when stdout has output', () => {
      it('then logs the stdout output', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "output"', { logger, noSuccess: true })
        expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('stdout'), expect.any(String))
      })
    })

    describe('when noStdout is true', () => {
      it('then does not log the stdout output', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "output"', { logger, noStdout: true, noSuccess: true })
        expect(logger.log).not.toHaveBeenCalledWith(
          expect.stringContaining('stdout'),
          expect.any(String),
        )
      })
    })

    describe('when stderr has output', () => {
      it('then logs the stderr output', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "err" >&2', { logger, noSuccess: true })
        expect(logger.log).toHaveBeenCalledWith(
          expect.stringContaining('stderr'),
          expect.any(String),
        )
      })
    })

    describe('when noStderr is true', () => {
      it('then does not log the stderr output', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "err" >&2', { logger, noStderr: true, noSuccess: true })
        expect(logger.log).not.toHaveBeenCalledWith(
          expect.stringContaining('stderr'),
          expect.any(String),
        )
      })
    })

    describe('when command fails without noError', () => {
      it('then logs the error', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await expect(
          execPromise('nonexistent_command_xyz', { logger }),
        ).rejects.toThrow()
        expect(logger.error).toHaveBeenCalled()
      })
    })

    describe('when command fails with noError', () => {
      it('then does not log the error', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await expect(
          execPromise('nonexistent_command_xyz', { logger, noError: true }),
        ).rejects.toThrow()
        expect(logger.error).not.toHaveBeenCalled()
      })
    })
  })

  describe('given packageName option', () => {
    describe('when packageName is set', () => {
      it('then prefixes logs with the package name', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "test"', { logger, packageName: 'my-pkg' })
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('[my-pkg]'))
      })
    })

    describe('when packageName is not set', () => {
      it('then does not prefix logs with brackets', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "test"', { logger })
        expect(logger.info).toHaveBeenCalledWith(expect.not.stringContaining('['))
      })
    })

    describe('when command fails with packageName set', () => {
      it('then prefixes error logs with the package name', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await expect(
          execPromise('nonexistent_command_xyz', { logger, packageName: 'my-pkg' }),
        ).rejects.toThrow()
        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('[my-pkg]'),
          expect.anything(),
        )
      })
    })
  })

  describe('given cwd option', () => {
    describe('when cwd is set to /tmp', () => {
      it('then executes the command in the specified directory', async () => {
        const result = await execPromise('pwd', { cwd: '/tmp', noSuccess: true })
        expect(result.stdout.trim() === '/tmp' || result.stdout.trim() === '/private/tmp').toBe(true)
      })
    })
  })

  describe('given logLevel option', () => {
    describe('when logLevel is set to silent', () => {
      it('then does not throw', () => {
        expect(() => execPromise('echo "test"', { logLevel: 'silent', noSuccess: true })).to.not.throw()
      })
    })
  })

  describe('given no options', () => {
    describe('when called with only a command', () => {
      it('then works with default options', async () => {
        const result = await execPromise('echo "no-opts"')
        expect(result.stdout.trim()).toBe('no-opts')
      })
    })
  })

  describe('given debug logging', () => {
    describe('when command produces both stdout and stderr', () => {
      it('then logs debug messages for both outputs', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await execPromise('echo "out" && echo "err" >&2', { logger, noSuccess: true })
        expect(logger.debug).toHaveBeenCalledWith(
          expect.stringContaining('stdout output'),
          expect.any(String),
        )
        expect(logger.debug).toHaveBeenCalledWith(
          expect.stringContaining('stderr output'),
          expect.any(String),
        )
      })
    })
  })
})
