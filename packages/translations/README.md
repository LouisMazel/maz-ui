# @maz-ui/translations

Simple and lightweight translation system for Maz-UI components.

## Installation

```bash
npm install @maz-ui/translations
```

## Features

- 🌍 **Simple internationalization** for Maz-UI components
- 🔄 **Reactive locale switching**
- 📝 **Variable interpolation** in translations
- 🎯 **TypeScript support** with full type safety
- 🔧 **Plugin-based** integration with Vue applications
- 📦 **Lightweight** - minimal bundle size impact
- 🎨 **Customizable** - override default translations easily

## Usage

### Basic Configuration

```typescript
import { MazTranslationsPlugin } from '@maz-ui/translations'
import { createApp } from 'vue'

const app = createApp(App)

app.use(MazTranslationsPlugin, {
  locale: 'fr',
  translations: {
    fr: {
      select: { noOptions: 'Aucune option disponible' },
      input: { required: 'Ce champ est requis' }
    },
    es: {
      select: { noOptions: 'No hay opciones disponibles' },
      input: { required: 'Este campo es obligatorio' }
    }
  }
})
```

### In Vue Components

```vue
<script setup>
import { useTranslations } from '@maz-ui/translations'

const { t, locale, setLocale } = useTranslations()

// Basic usage
const message = t('select.noOptions')

// With variables
const welcomeMessage = t('input.welcome', { name: 'John' })

// Change language
function switchLanguage(lang) {
  setLocale(lang)
}
</script>

<template>
  <div>
    <p>{{ t('select.noOptions') }}</p>
    <p>{{ t('input.welcome', { name: 'User' }) }}</p>

    <div class="language-switcher">
      <button @click="setLocale('en')">
        English
      </button>
      <button @click="setLocale('fr')">
        Français
      </button>
      <button @click="setLocale('es')">
        Español
      </button>
    </div>

    <p>Current locale: {{ locale }}</p>
  </div>
</template>
```

### Variable Interpolation

The translation system supports variable interpolation using curly braces:

```typescript
// Configuration
const translations = {
  en: {
    welcome: 'Hello {name}!',
    itemCount: 'You have {count} {count, plural, one {item} other {items}}'
  }
}

// Usage
t('welcome', { name: 'John' }) // "Hello John!"
t('itemCount', { count: 1 }) // "You have 1 item"
t('itemCount', { count: 5 }) // "You have 5 items"
```

### Advanced Usage

#### Manual Instance Creation

```typescript
import { createMazTranslations } from '@maz-ui/translations'

const i18n = createMazTranslations({
  locale: 'en',
  translations: {
    en: { /* your translations */ },
    fr: { /* your translations */ }
  }
})

// Use directly
const message = i18n.t('select.noOptions')
```

#### Custom Translation Keys

```typescript
// Define your own translation structure
const customTranslations = {
  en: {
    navigation: {
      home: 'Home',
      about: 'About',
      contact: 'Contact'
    },
    form: {
      validation: {
        required: 'This field is required',
        email: 'Please enter a valid email'
      }
    }
  }
}
```

## API Reference

### `useTranslations()`

Returns an object with:

- **`t(key, variables?)`** - Translation function
  - `key`: Translation key (dot notation supported)
  - `variables`: Optional object with variable substitutions
  - Returns: Translated string or key if not found

- **`locale`** - Current locale (reactive ref)
  - Type: `Ref<string>`
  - Reactive property that updates when locale changes

- **`setLocale(locale)`** - Change current locale
  - `locale`: New locale string
  - Triggers reactivity for all components using translations

### Plugin Options

```typescript
interface MazTranslationsOptions {
  locale?: string // Default locale (default: 'en')
  translations?: Record<string, Partial<MazTranslations>> // Custom translations
}
```

### Type Definitions

```typescript
interface MazTranslationsInstance {
  locale: Ref<string>
  t: (key: string, variables?: Record<string, any>) => string
  setLocale: (locale: string) => void
}

interface MazTranslations {
  select: { noOptions: string }
  input: { required: string }
  datePicker: { placeholder: string }
  // ... other component translations
}
```

## Default Translations

The package includes default English translations for Maz-UI components. You can override any of these by providing your own translations.

### Default Structure

```typescript
const defaultTranslations = {
  select: {
    noOptions: 'No options available'
  },
  input: {
    required: 'This field is required'
  },
  datePicker: {
    placeholder: 'Select date...'
  }
}
```

### Adding New Languages

```typescript
app.use(MazTranslationsPlugin, {
  locale: 'fr',
  translations: {
    fr: {
      select: { noOptions: 'Aucune option disponible' },
      input: { required: 'Ce champ est requis' },
      datePicker: { placeholder: 'Sélectionner une date...' }
    },
    de: {
      select: { noOptions: 'Keine Optionen verfügbar' },
      input: { required: 'Dieses Feld ist erforderlich' },
      datePicker: { placeholder: 'Datum auswählen...' }
    }
  }
})
```

### Handle Pluralization

```typescript
// Simple approach
const simpleTranslations = {
  en: {
    itemCount: '{count} item(s)'
  }
}

// Better approach
const betterTranslations = {
  en: {
    itemCountSingular: '{count} item',
    itemCountPlural: '{count} items'
  }
}
```

## Contributing

Contributions are welcome! Please ensure:

- New translations follow the existing key structure
- TypeScript types are properly updated
- Tests are added for new features
- Documentation is updated accordingly

## License

MIT License - see LICENSE file for details.
