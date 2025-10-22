# @maz-ui/node

Node.js utilities for Maz-UI ecosystem - Promise-based command execution and colored logging.

## Installation

```bash
npm install @maz-ui/node
```

## Features

- 🚀 **Promise-based command execution** with detailed logging
- 🎨 **Elegant console logging** powered by [consola](https://github.com/unjs/consola)
- 📊 **Configurable log levels** (0-5) with fancy formatting
- ⚡ **TypeScript support** with full type safety
- 📦 **Lightweight** - minimal dependencies
- 🔧 **Highly configurable** - custom loggers with different levels and reporters
- 🛡️ **Error handling** - comprehensive error management
- 🎯 **Multiple log types** - info, debug, trace, start, ready, fail, box

## Usage

### execPromise

Execute shell commands with promise-based interface and automatic logging.

```typescript
import { execPromise, logger } from '@maz-ui/node'

// Basic usage
try {
  const { stdout } = await execPromise('npm --version')
  logger.log('npm version:', stdout.trim())
}
catch (error) {
  logger.error('Command failed:', error)
}

// With options
await execPromise('npm run build', {
  packageName: 'my-package', // Adds [my-package] prefix to logs
  noSuccess: true, // Skip success log
  noStdout: true, // Skip stdout log
  noStderr: true, // Skip stderr log
  logger: customLogger // Use custom logger
})
```

#### Options

```typescript
interface ExecOptions {
  logger?: Logger // Custom logger instance
  packageName?: string // Package name for log prefixes
  noSuccess?: boolean // Skip success logging
  noStdout?: boolean // Skip stdout logging
  noStderr?: boolean // Skip stderr logging
}
```

### Logger

Elegant console logging powered by [consola](https://github.com/unjs/consola) with configurable log levels and fancy formatting.

```typescript
import { logger } from '@maz-ui/node'

// Basic logging
logger.log('Regular message')
logger.info('Information message')
logger.success('Operation completed successfully!')
logger.warn('Warning message')
logger.error('Error occurred', errorObject)

// Development logging (requires level >= 4)
logger.debug('Debug information')
logger.trace('Detailed trace information')

// Status logging
logger.ready('System is ready!')
logger.fail('Operation failed')
logger.fatal('Fatal error occurred')

// Special formatters
logger.brand('🎨 Maz-UI Brand Message') // Blue bright
logger.box('Important Message in a Box')
logger.divider() // Prints separator line (adapts to terminal width)
logger.eot() // End of transmission (empty line)
logger.clear() // Clear console
logger.silent('This message is always silent')
logger.verbose('Verbose information')

// Dynamic log level control using semantic names
logger.setLevel('debug') // Enable debug logs
logger.setLevel('silent') // Disable all logs
logger.setLevel('verbose') // Enable all logs with maximum verbosity
logger.setLevel('default') // Back to default (level 3)
```

#### Logger Methods

All methods accept `InputLogObject | any` and additional arguments for flexibility.

##### Core Logging Methods

- **`log(...args)`** - Standard console log (level 2)
- **`info(...args)`** - Information messages (level 3)
- **`success(...args)`** - Success messages with green styling (level 3)
- **`warn(...args)`** - Warning messages with yellow styling (level 1)
- **`error(...args)`** - Error messages with red styling (level 0)
- **`debug(...args)`** - Debug messages (level 4)
- **`trace(...args)`** - Trace messages for detailed debugging (level 5)
- **`verbose(...args)`** - Verbose messages (highest level)
- **`fatal(...args)`** - Fatal error messages (level 0)
- **`silent(...args)`** - Silent messages (never shown)

##### Status Methods

- **`ready(...args)`** - Ready/completion indicator (level 3)
- **`fail(...args)`** - Failure messages (level 0)

##### Formatting Methods

- **`box(...args)`** - Display message in a fancy box
- **`brand(message)`** - Blue bright branded messages
- **`divider()`** - Prints a separator line that adapts to terminal width
- **`eot()`** - Prints an empty line (end of transmission)
- **`clear()`** - Clear the console

##### Configuration Methods

- **`setLevel(level)`** - Change log level dynamically using semantic names:
  - `'silent'` - No logs (-∞)
  - `'error'` - Fatal and Error only (0)
  - `'warning'` - Warnings and above (1)
  - `'normal'` - Normal logs and above (2)
  - `'default'` - Informational logs (3)
  - `'debug'` - Debug logs and above (4)
  - `'trace'` - All logs including trace (5)
  - `'verbose'` - Maximum verbosity (+∞)

#### Log Levels

The logger supports semantic log levels for better readability. Default is `'default'` (level 3).

| Level       | Value | Description                  |
| ----------- | ----- | ---------------------------- |
| `'silent'`  | -∞    | No logs displayed            |
| `'error'`   | 0     | Fatal and Error only         |
| `'warning'` | 1     | Warnings and above           |
| `'normal'`  | 2     | Normal logs and above        |
| `'default'` | 3     | Informational logs (default) |
| `'debug'`   | 4     | Debug logs and above         |
| `'trace'`   | 5     | All logs including trace     |
| `'verbose'` | +∞    | Maximum verbosity            |

```typescript
import { logger } from '@maz-ui/node'

// Change level at runtime
logger.setLevel('debug')
logger.debug('Debug info') // Now visible

logger.setLevel('error') // Only errors
logger.log('Regular log') // Won't be displayed

logger.setLevel('silent') // Disable all logs
logger.error('Error message') // Won't be displayed

logger.setLevel('verbose') // Maximum verbosity
logger.trace('Trace message') // Will be displayed
```

#### Custom Logger Instances

Create custom logger instances with different configurations:

```typescript
import { createLogger } from '@maz-ui/node'

// Create a debug logger
const debugLogger = createLogger({
  level: 4, // or use the numeric level directly
  tag: 'debug'
})

debugLogger.debug('Debug information')
debugLogger.trace('Detailed trace')

// Create a minimal logger for CI environments
const ciLogger = createLogger({
  level: 2 // normal level
})

// Create a silent logger
const silentLogger = createLogger({
  level: Number.NEGATIVE_INFINITY
})

// Create a verbose logger for development
const devLogger = createLogger({
  level: Number.POSITIVE_INFINITY
})

// Then use setLevel with semantic names
debugLogger.setLevel('verbose')
ciLogger.setLevel('error')
```

## Advanced Examples

### Custom Logger Integration

```typescript
import { createLogger, execPromise } from '@maz-ui/node'

// Create custom logger for specific use case
const buildLogger = createLogger({
  level: 3, // default level
  tag: 'build'
})

// Use with execPromise
await execPromise('npm test', {
  logger: buildLogger,
  packageName: 'test-suite'
})

// Create a logger for different environments
const isCI = process.env.CI === 'true'
const envLogger = createLogger({
  level: isCI ? 2 : 4 // normal in CI, debug in dev
})
```

### Build Script Example

```typescript
import { createLogger, execPromise } from '@maz-ui/node'

async function buildProject() {
  const logger = createLogger({
    level: 3, // default level
    tag: 'build'
  })

  logger.box('🚀 Starting build process')
  logger.divider()

  try {
    // Install dependencies
    logger.info('Installing dependencies...')
    await execPromise('npm install', {
      packageName: 'setup',
      noStdout: true,
      logger
    })
    logger.ready('Dependencies installed')

    // Run tests
    logger.info('Running tests...')
    await execPromise('npm test', {
      packageName: 'test',
      noStdout: true,
      logger
    })
    logger.ready('Tests passed')

    // Build project
    logger.info('Building project...')
    await execPromise('npm run build', {
      packageName: 'build',
      logger
    })
    logger.ready('Build completed')

    logger.eot()
    logger.success('✅ Build completed successfully!')
  }
  catch (error) {
    logger.fail('❌ Build failed')
    logger.error(error)
    process.exit(1)
  }
}

buildProject()
```

### CI/CD Integration

```typescript
import { createLogger, execPromise } from '@maz-ui/node'

async function ciPipeline() {
  const logger = createLogger({
    level: 2 // normal level for CI
  })

  const steps = [
    { name: 'Lint', command: 'npm run lint' },
    { name: 'Test', command: 'npm test' },
    { name: 'Build', command: 'npm run build' },
    { name: 'Package', command: 'npm pack' }
  ]

  logger.box('🔄 CI Pipeline Started')
  logger.divider()

  for (const step of steps) {
    logger.info(`Running ${step.name}...`)

    try {
      await execPromise(step.command, {
        packageName: step.name.toLowerCase(),
        noStdout: true,
        logger
      })
      logger.ready(`${step.name} completed`)
    }
    catch (error) {
      logger.fail(`${step.name} failed`)
      logger.error(error)
      process.exit(1)
    }
  }

  logger.eot()
  logger.success('🎉 All pipeline steps completed!')
}

ciPipeline()
```

## API Reference

### `execPromise(command, options?)`

Executes a shell command and returns a promise.

**Parameters:**

- `command` (string): Shell command to execute
- `options` (ExecOptions, optional): Execution options

**Returns:**

- `Promise<{ stdout: string, stderr: string }>`: Command output

**Throws:**

- Command execution errors with detailed logging

### `logger`

Console logger with colored output and error handling.

**Type:** `Logger`

All logger methods automatically handle error objects using `getErrorMessage` utility for consistent error formatting.

## Dependencies

- **consola** - Elegant console logging with fancy formatting
- **@maz-ui/utils** - Error message formatting
- **Node.js built-ins** - child_process for command execution

## Requirements

- Node.js >= 18.0.0
- TypeScript support included

## Contributing

Contributions are welcome! Please ensure:

- New utilities follow existing patterns
- TypeScript types are properly defined
- Error handling is comprehensive
- Documentation is updated accordingly

## License

MIT License - see LICENSE file for details.
