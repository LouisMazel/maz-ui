# @maz-ui/utils

JavaScript/TypeScript utility functions for the Maz-UI ecosystem - String manipulation, date formatting, debouncing, throttling, and more.

## Installation

```bash
npm install @maz-ui/utils
```

## Features

- **String utilities** - Case conversion, normalization, and manipulation
- **Date and number formatting** - Localized formatting with internationalization support
- **Performance utilities** - Debouncing, throttling, and optimization helpers
- **Browser utilities** - Client/server detection, user visibility, and environment checks
- **TypeScript helpers** - Advanced type utilities for better type safety
- **Phone number formatting** - International phone number utilities
- **Currency formatting** - Multi-currency formatting support
- **Validation utilities** - Deep equality checks and data validation
- **DOM utilities** - Script loading, textarea autogrow, and swipe handling

## Usage

### Basic Import

```typescript
import { camelCase, debounce, formatDate } from '@maz-ui/utils'

// String utilities
const camelCased = camelCase('hello-world') // 'helloWorld'

// Date formatting
const formatted = formatDate(new Date(), 'en-US') // '12/25/2023'

// Performance utilities
const debouncedFn = debounce(() => console.log('Called!'), 300)
```

### Modular Imports

```typescript
// Import TypeScript helpers
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
// Import specific helpers
import { camelCase } from '@maz-ui/utils/helpers/camelCase'
import { debounce } from '@maz-ui/utils/helpers/debounce'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
```

## Available Utilities

### String Utilities

- **camelCase** - Convert strings to camelCase
- **capitalize** - Capitalize first letter of strings
- **kebabCase** - Convert strings to kebab-case
- **pascalCase** - Convert strings to PascalCase
- **snakeCase** - Convert strings to snake_case
- **normalizeString** - Normalize strings for comparison

### Date and Number Formatting

- **formatDate** - Format dates with locale support
- **formatNumber** - Format numbers with locale support
- **formatCurrency** - Format currency values with locale support

### Performance Utilities

- **debounce** - Debounce function calls
- **debounceCallback** - Debounce with callback support
- **debounceId** - Debounce with unique identifiers
- **throttle** - Throttle function calls
- **throttleId** - Throttle with unique identifiers

### Browser and Environment

- **isClient** - Check if running in client environment
- **isServer** - Check if running in server environment
- **isStandaloneMode** - Check if app is in standalone mode
- **userVisibility** - Track user visibility state
- **getBrowserLocale** - Get browser locale settings

### Validation and Comparison

- **isEqual** - Deep equality comparison
- **checkAvailability** - Check resource availability
- **truthyFilter** - Filter truthy values from arrays

### DOM and UI Utilities

- **scriptLoader** - Dynamic script loading
- **TextareaAutogrow** - Automatic textarea height adjustment
- **swipeHandler** - Touch swipe gesture handling
- **idleTimeout** - Idle state management

### Phone and Location

- **formatPhoneNumber** - Format international phone numbers
- **countryCodeToUnicodeFlag** - Convert country codes to flag emojis
- **getCountryFlagUrl** - Get country flag image URLs
- **fetchLocaleIp** - Fetch user locale from IP

### Utility Functions

- **sleep** - Promise-based delay utility
- **getErrorMessage** - Extract error messages safely

## TypeScript Helpers

Advanced type utilities for enhanced TypeScript development:

- **DeepPartial<T>** - Make all properties optional recursively
- **DeepKeyOf<T>** - Get all nested keys of an object type
- **FlattenObjectKeys<T>** - Flatten object keys to dot notation
- **GenericInstanceType<T>** - Extract instance type from constructor
- **InferMaybeRef<T>** - Infer type from Vue ref or regular value

```typescript
import type { DeepKeyOf, DeepPartial } from '@maz-ui/utils'

interface User {
  profile: {
    name: string
    email: string
  }
}

type PartialUser = DeepPartial<User> // All properties optional
type UserKeys = DeepKeyOf<User> // 'profile' | 'profile.name' | 'profile.email'
```

## Performance Examples

```typescript
import { debounce, throttle } from '@maz-ui/utils'

// Debounce search input
const debouncedSearch = debounce((query: string) => {
  performSearch(query)
}, 300)

// Throttle scroll events
const throttledScroll = throttle(() => {
  updateScrollPosition()
}, 16)
```

## Formatting Examples

```typescript
import { formatCurrency, formatDate, formatPhoneNumber } from '@maz-ui/utils'

// Currency formatting
const price = formatCurrency(1234.56, 'USD', 'en-US') // '$1,234.56'

// Date formatting
const date = formatDate(new Date(), 'fr-FR') // '25/12/2023'

// Phone formatting
const phone = formatPhoneNumber('+33123456789', 'international')
```

## Requirements

- Node.js >= 18.0.0
- TypeScript support included
- Tree-shakeable for optimal bundle size

## Contributing

Contributions are welcome! Please ensure:

- New utilities follow existing patterns
- TypeScript types are properly defined
- Unit tests are included
- Documentation is updated accordingly

## License

MIT License - see LICENSE file for details.
