import type { ExecOptions } from 'node:child_process'
import type { LogLevel } from './logger.js'
import { exec } from 'node:child_process'
import process from 'node:process'
import { logger as defaultLogger } from './logger.js'
import { redactError, redactSecrets } from './redactSecrets.js'

interface CustomLogger {
  log: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
}

/**
 * Options for {@link execPromise}.
 *
 * The following fields are forwarded as-is to `child_process.exec`:
 * - `cwd` - working directory of the command. Defaults to the current one.
 * - `env` - environment variables, **merged on top of `process.env`**.
 * - `timeout` - maximum run time in milliseconds before the command is killed. No timeout by default.
 * - `maxBuffer` - maximum bytes allowed on stdout/stderr before the command is killed. Defaults to `1024 * 1024` (1 MiB).
 * - `killSignal` - signal used to kill the command on timeout or abort. Defaults to `'SIGTERM'`.
 * - `shell` - shell used to run the command. Defaults to `/bin/sh` (Unix) or `cmd.exe` (Windows).
 * - `signal` - an `AbortSignal` that, once aborted, kills the command and rejects the promise.
 */
export type ExecPromiseOptions = Pick<
  ExecOptions,
  'cwd' | 'timeout' | 'env' | 'maxBuffer' | 'killSignal' | 'shell' | 'signal'
> & {
  /**
   * Custom logger used for every output. Falls back to the package logger.
   */
  logger?: CustomLogger
  /**
   * Prefix added to every log line, formatted as `[packageName]: `.
   */
  packageName?: string
  /**
   * Don't log the success message.
   * @default false
   */
  noSuccess?: boolean
  /**
   * Don't log stdout.
   * @default false
   */
  noStdout?: boolean
  /**
   * Don't log stderr.
   * @default false
   */
  noStderr?: boolean
  /**
   * Don't log the error when the command fails.
   * @default false
   */
  noError?: boolean
  /**
   * Logging level applied to the default logger before running the command.
   */
  logLevel?: LogLevel
}

/**
 * Runs a shell command and resolves with its `stdout` and `stderr`.
 *
 * Secrets (npm auth tokens, `--token`/`--password` flags, provider tokens,
 * JWTs, basic-auth URLs) are automatically masked in every log line and in the
 * rejected error via {@link redactSecrets}. The resolved `stdout`/`stderr` are
 * returned untouched.
 *
 * @param command - The shell command to execute.
 * @returns A promise resolving with the command `stdout` and `stderr`.
 * @throws If the command exits with a non-zero code, times out, is aborted, or
 * exceeds `maxBuffer`. The rejected error is redacted.
 *
 * @example Basic usage
 * ```ts
 * const { stdout } = await execPromise('node --version')
 * ```
 *
 * @example Fail the command after 5 seconds
 * ```ts
 * await execPromise('pnpm install', { timeout: 5000 })
 * ```
 *
 * @example Inject environment variables (merged on top of `process.env`)
 * ```ts
 * await execPromise('node build.mjs', { env: { NODE_ENV: 'production' } })
 * ```
 *
 * @example Cancel the command with an `AbortController`
 * ```ts
 * const controller = new AbortController()
 * const promise = execPromise('long-task', { signal: controller.signal })
 * controller.abort()
 * ```
 */
export async function execPromise(
  command: string,
  {
    logger,
    packageName,
    noSuccess = false,
    noStdout = false,
    noStderr = false,
    noError = false,
    logLevel,
    cwd,
    timeout,
    env,
    maxBuffer,
    killSignal,
    shell,
    signal,
  }: ExecPromiseOptions = {},
): Promise<{ stdout: string, stderr: string }> {
  if (logLevel) {
    defaultLogger.setLevel(logLevel)
  }

  const internalLogger = logger ?? defaultLogger
  const packageNameStr = packageName ? `[${packageName}]: ` : ''

  const safeCommand = redactSecrets(command)

  return await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
    // eslint-disable-next-line sonarjs/os-command
    exec(command, {
      cwd,
      timeout,
      maxBuffer,
      killSignal,
      shell,
      signal,
      env: env ? { ...process.env, ...env } : undefined,
    }, (error, stdout, stderr) => {
      if (stdout) {
        internalLogger.debug(`${safeCommand} - stdout output:`, redactSecrets(stdout))
      }

      if (stderr) {
        internalLogger.debug(`${safeCommand} - stderr output:`, redactSecrets(stderr))
      }

      if (stdout && !noStdout) {
        internalLogger.log(`${packageNameStr}stdout -`, redactSecrets(stdout.trim()))
      }

      if (stderr && !noStderr) {
        internalLogger.log(`${packageNameStr}stderr -`, redactSecrets(stderr.trim()))
      }

      if (error) {
        const safeError = redactError(error)
        if (!noError) {
          const reason = error.killed && timeout ? `timed out after ${timeout}ms` : 'failed'
          internalLogger.error(`${packageNameStr}${safeCommand} ${reason}`, safeError)
        }
        reject(safeError)
      }
      else {
        if (!noSuccess) {
          internalLogger.info(`${packageNameStr}${safeCommand} - Success!`)
        }
        resolve({ stdout, stderr })
      }
    })
  })
}
