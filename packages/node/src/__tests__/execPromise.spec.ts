import process from 'node:process'
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

  describe('given a command containing a secret', () => {
    describe('when the command fails', () => {
      it('then masks the secret in the error log', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await expect(
          execPromise('nonexistent_command_xyz --token=supersecret123456', { logger }),
        ).rejects.toThrow()
        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('--token=supe***3456'),
          expect.anything(),
        )
        expect(logger.error).not.toHaveBeenCalledWith(
          expect.stringContaining('supersecret123456'),
          expect.anything(),
        )
      })
    })

    describe('when the command fails and the error is caught', () => {
      it('then the rejected error no longer carries the secret', async () => {
        await expect(
          execPromise('nonexistent_command_xyz --token=supersecret123456', { noError: true }),
        ).rejects.toThrow('--token=supe***3456')
        await expect(
          execPromise('nonexistent_command_xyz --token=supersecret123456', { noError: true }),
        ).rejects.not.toThrow('supersecret123456')
      })
    })
  })

  describe('given timeout option', () => {
    describe('when the command exceeds the timeout', () => {
      it('then rejects', async () => {
        await expect(
          execPromise('sleep 2', { timeout: 50, noError: true }),
        ).rejects.toThrow()
      })

      it('then logs a timeout message with the duration', async () => {
        const logger = {
          log: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          debug: vi.fn(),
        }
        await expect(execPromise('sleep 2', { timeout: 50, logger })).rejects.toThrow()
        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('timed out after 50ms'),
          expect.anything(),
        )
      })
    })

    describe('when the command finishes before the timeout', () => {
      it('then resolves normally', async () => {
        const result = await execPromise('echo "fast"', { timeout: 5000, noSuccess: true })
        expect(result.stdout.trim()).toBe('fast')
      })
    })
  })

  describe('given env option', () => {
    describe('when env is provided', () => {
      it('then merges it with process.env', async () => {
        process.env.EXEC_PROMISE_EXISTING = 'from-process'
        const result = await execPromise('echo "$EXEC_PROMISE_EXISTING-$EXEC_PROMISE_NEW"', {
          env: { EXEC_PROMISE_NEW: 'from-option' },
          noSuccess: true,
        })
        delete process.env.EXEC_PROMISE_EXISTING
        expect(result.stdout.trim()).toBe('from-process-from-option')
      })
    })
  })

  describe('given maxBuffer option', () => {
    describe('when the output exceeds maxBuffer', () => {
      it('then rejects', async () => {
        await expect(
          execPromise('seq 1 1000', { maxBuffer: 100, noError: true }),
        ).rejects.toThrow()
      })
    })
  })

  describe('given signal option', () => {
    describe('when the signal is aborted', () => {
      it('then rejects', async () => {
        const controller = new AbortController()
        const promise = execPromise('sleep 2', { signal: controller.signal, noError: true })
        controller.abort()
        await expect(promise).rejects.toThrow()
      })
    })
  })

  describe('given shell option', () => {
    describe('when a custom shell is provided', () => {
      it('then runs the command with it', async () => {
        const result = await execPromise('echo shell-ok', { shell: '/bin/bash', noSuccess: true })
        expect(result.stdout.trim()).toBe('shell-ok')
      })
    })
  })

  describe('given killSignal option', () => {
    describe('when the command times out with a custom kill signal', () => {
      it('then rejects', async () => {
        await expect(
          execPromise('sleep 2', { timeout: 50, killSignal: 'SIGKILL', noError: true }),
        ).rejects.toThrow()
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
