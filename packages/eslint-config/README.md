# @maz-ui/eslint-config

Reusable ESLint configuration for JavaScript/TypeScript projects.

## Features

- 🚀 **Based on @antfu/eslint-config** - Modern and performant configuration
- 🛡️ **Strict TypeScript** - Full TypeScript support
- 🎨 **Tailwind CSS** - Rules for Tailwind CSS (with Tailwind CSS plugin)
- 🔍 **SonarJS** - Code quality with SonarJS (with SonarJS plugin)
- ⚙️ **Configurable** - Flexible and extensible options
- 📦 **Production ready** - Optimized for production environments

## Installation

```bash
pnpm add -D @maz-ui/eslint-config eslint
```

## Basic usage

```js
// eslint.config.js
import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig()
```

## Custom configuration

```js
// eslint.config.js
import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  // Environment (affects console rules)
  env: 'production', // 'development' | 'production'

  // Enable/disable plugins
  typescript: true,
  tailwindcss: true,
  sonarjs: true,
  formatters: true,

  // Files to ignore
  ignores: ['custom-dist/**'],

  // Custom rules
  rules: {
    'no-console': 'error',
    'prefer-const': 'warn'
  }
})
```

## Available options

```typescript
interface MazESLintOptions {
  typescript?: boolean        // TypeScript support (default: true)
  tailwindcss?: boolean      // Tailwind CSS rules (default: true)
  sonarjs?: boolean          // SonarJS rules (default: true)
  formatters?: boolean       // Formatters support (default: true)
  env?: 'development' | 'production'  // Environment (default: 'development')
  ignores?: string[]         // Files to ignore
  rules?: Record<string, any> // Custom ESLint rules
}
```

## Advanced usage

### Selective rule imports

```js
import { baseRules, sonarjsRules, tailwindcssRules } from '@maz-ui/eslint-config'

export default [
  {
    rules: {
      ...baseRules,
      ...sonarjsRules,
      // Your custom rules
    }
  }
]
```

### Example for Vue project

```js
// eslint.config.js
import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  env: 'production',
  rules: {
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/no-undef-components': ['error', {
      ignorePatterns: ['RouterView', 'RouterLink']
    }]
  }
})
```

## Included rules

### Base (JavaScript/TypeScript)

- Console management by environment
- Code quality rules
- Optimized TypeScript support

### SonarJS

- Limited cognitive complexity
- Duplicate code detection
- Security best practices

### Tailwind CSS

- Consistent class ordering
- Contradictory class detection
- Valid Tailwind syntax

## Compatibility

- **ESLint** ^9.0.0
- **Node.js** >=18.0.0
- **TypeScript** ^5.0.0

## Usage examples

### Simple JavaScript project

```js
export default defineConfig({
  typescript: false,
  tailwindcss: false
})
```

### Project with Tailwind

```js
export default defineConfig({
  tailwindcss: true,
  rules: {
    'tailwindcss/classnames-order': 'error'
  }
})
```

### Production project

```js
export default defineConfig({
  env: 'production',
  sonarjs: true,
  rules: {
    'no-console': 'error',
    'no-debugger': 'error'
  }
})
```
