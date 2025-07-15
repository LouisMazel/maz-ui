# @maz-ui/node

Node.js utilities for Maz-UI ecosystem - Promise-based command execution and colored logging.

## Installation

```bash
npm install @maz-ui/node
```

## Features

- 🚀 **Promise-based command execution** with detailed logging
- 🎨 **Colored console logging** with multiple log levels
- ⚡ **TypeScript support** with full type safety
- 📦 **Lightweight** - minimal dependencies
- 🔧 **Configurable** - customizable logging behavior
- 🛡️ **Error handling** - comprehensive error management

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

Colored console logging with multiple levels and error handling.

```typescript
import { logger } from '@maz-ui/node'

// Basic logging
logger.log('Regular message')
logger.success('Operation completed successfully!')
logger.warn('Warning message')
logger.error('Error occurred', errorObject)

// Special formatters
logger.brand('🎨 Maz-UI Brand Message') // Blue bright
logger.divider() // Prints separator line
logger.eot() // End of transmission (empty line)

// With error objects
try {
  throw new Error('Something went wrong')
}
catch (error) {
  logger.error('Operation failed:', error)
}
```

#### Logger Methods

- **`log(...message)`** - Standard console log
- **`success(...message)`** - Green colored success messages
- **`warn(message, error?)`** - Yellow colored warnings
- **`error(message, error?)`** - Red colored error messages
- **`brand(message)`** - Blue bright branded messages
- **`divider()`** - Prints a separator line
- **`eot()`** - Prints an empty line (end of transmission)

## Advanced Examples

### Custom Logger Integration

```typescript
import { execPromise, logger, type Logger } from '@maz-ui/node'

// Create custom logger with additional functionality
const customLogger: Logger = {
  ...logger,
  log: (...args) => {
    // eslint-disable-next-line no-console
    console.log('[CUSTOM]', ...args)
  }
}

// Use with execPromise
await execPromise('npm test', {
  logger: customLogger,
  packageName: 'test-suite'
})
```

### Build Script Example

```typescript
import { execPromise, logger } from '@maz-ui/node'

async function buildProject() {
  logger.brand('🚀 Starting build process...')
  logger.divider()

  try {
    // Install dependencies
    await execPromise('npm install', {
      packageName: 'setup',
      noStdout: true
    })

    // Run tests
    await execPromise('npm test', {
      packageName: 'test',
      noStdout: true
    })

    // Build project
    await execPromise('npm run build', {
      packageName: 'build'
    })

    logger.eot()
    logger.success('✅ Build completed successfully!')
  }
  catch (error) {
    logger.error('❌ Build failed:', error)
    process.exit(1)
  }
}

buildProject()
```

### CI/CD Integration

```typescript
import { execPromise, logger } from '@maz-ui/node'

async function ciPipeline() {
  const steps = [
    { name: 'Lint', command: 'npm run lint' },
    { name: 'Test', command: 'npm test' },
    { name: 'Build', command: 'npm run build' },
    { name: 'Package', command: 'npm pack' }
  ]

  logger.brand('🔄 CI Pipeline Started')
  logger.divider()

  for (const step of steps) {
    logger.log(`⏳ Running ${step.name}...`)

    try {
      await execPromise(step.command, {
        packageName: step.name.toLowerCase(),
        noStdout: true
      })
    }
    catch (error) {
      logger.error(`❌ ${step.name} failed:`, error)
      process.exit(1)
    }
  }

  logger.eot()
  logger.success('🎉 All pipeline steps completed!')
}
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

- **colorette** - Terminal colors
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
