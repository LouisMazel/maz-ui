import { execPromise } from '../execPromise'

describe('execPromise', () => {
  describe('basic execution', () => {
    it('should execute a simple command and return stdout', async () => {
      const result = await execPromise('echo "hello"', { noSuccess: true })
      expect(result.stdout.trim()).toBe('hello')
    })

    it('should resolve with stdout and stderr', async () => {
      const result = await execPromise('echo "output"', { noSuccess: true, noStdout: true })
      expect(result).toHaveProperty('stdout')
      expect(result).toHaveProperty('stderr')
    })

    it('should reject on command failure', async () => {
      await expect(
        execPromise('nonexistent_command_xyz', { noError: true }),
      ).rejects.toThrow()
    })
  })

  describe('logging options', () => {
    it('should log success message by default', async () => {
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

    it('should suppress success message with noSuccess', async () => {
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

    it('should log stdout by default', async () => {
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

    it('should suppress stdout with noStdout', async () => {
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

    it('should log stderr output', async () => {
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

    it('should suppress stderr with noStderr', async () => {
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

    it('should log error by default on failure', async () => {
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

    it('should suppress error logging with noError', async () => {
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

  describe('packageName', () => {
    it('should prefix logs with package name', async () => {
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

    it('should not prefix logs when packageName is not set', async () => {
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

    it('should prefix error logs with package name on failure', async () => {
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

  describe('cwd option', () => {
    it('should execute command in specified directory', async () => {
      const result = await execPromise('pwd', { cwd: '/tmp', noSuccess: true })
      expect(result.stdout.trim()).toBe('/private/tmp')
    })
  })

  describe('logLevel', () => {
    it('should set log level on the default logger', () => {
      expect(() => execPromise('echo "test"', { logLevel: 'silent', noSuccess: true })).to.not.throw()
    })
  })

  describe('default options', () => {
    it('should work with no options', async () => {
      const result = await execPromise('echo "no-opts"')
      expect(result.stdout.trim()).toBe('no-opts')
    })
  })

  describe('debug logging', () => {
    it('should log debug messages for stdout and stderr', async () => {
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
