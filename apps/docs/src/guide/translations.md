---
title: Translations (i18n)
description: Internationalization for Maz-UI components.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/translations"></NpmBadge>

## ✨ Features

- 🌍 **Internationalization** - Translate Maz-UI components into different languages
- 🔄 **Automatic Updates** - Switch languages and everything updates automatically
- 📦 **Lazy Loading** - Load translations only when needed for better performance
- 🛡️ **Strict Types** - Complete types for perfect DX
- 🔧 **Flexible API** - Easy to use and customize
- 🌐 **8 languages included** - English, French, Spanish, German, Italian, Portuguese, Japanese and Chinese

## Built-in Language Support

Maz-UI includes default translations for **8 languages** ready to use out of the box:

| Language | Code | Translations Status |
|----------|------|-------------------|
| 🇺🇸 **English** | `en` | Complete (default) |
| 🇫🇷 **French** | `fr` | Complete |
| 🇪🇸 **Spanish** | `es` | Complete |
| 🇩🇪 **German** | `de` | Complete |
| 🇮🇹 **Italian** | `it` | Complete |
| 🇵🇹 **Portuguese** | `pt` | Complete |
| 🇯🇵 **Japanese** | `ja` | Complete |
| 🇨🇳 **Chinese** | `zh-CN` | Complete |

### Translated Components

All these languages include translations for:

- 📱 **InputPhoneNumber** ([`MazInputPhoneNumber`](/components/maz-input-phone-number))
- 📁 **Dropzone** ([`MazDropzone`](/components/maz-dropzone))
- 📅 **DatePicker** ([`MazDatePicker`](/components/maz-date-picker))
- 📋 **Checklist** ([`MazChecklist`](/components/maz-checklist))
- 📤 **Dropdown** ([`MazDropdown`](/components/maz-dropdown))
- 🔍 **Select** ([`MazSelect`](/components/maz-select))
- 🗂️ **Table** ([`MazTable`](/components/maz-table))
- 📄 **Pagination** ([`MazPagination`](/components/maz-pagination))
- 🎠 **Carousel** ([`MazCarousel`](/components/maz-carousel))
- 🌍 **SelectCountry** ([`MazSelectCountry`](/components/maz-select-country))

### Basic Usage

::: warning

**By default Maz-UI will not load any translations to avoid unused code in your bundle.**

So, to avoid loading hydration issues or any flashes, use the `messages` option to provide the translations for the language you want to use. Otherwise, the translations will be loaded asynchronously.

:::

```typescript
import { fr } from '@maz-ui/translations'

app.use(MazUi, {
  translations: {
    locale: 'fr',
    fallbackLocale: 'en',
    messages: {
      fr,
    }
  }
})
```

## How it works

1. 🌍 **You install the MazUi plugin** - This tells your app to use translations
2. 📝 **You provide your translations** - You give the plugin a list of words in different languages
3. 🔄 **Your app switches languages** - Users can change the language and everything updates automatically!

## Basic Setup

```typescript
import { createApp } from 'vue'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import App from './App.vue'

const app = createApp(App)

app.use(MazUi, {
  translations: {
    locale: 'fr', // Start with French
    fallbackLocale: 'en', // Fallback language
    preloadFallback: true, // Preload fallback language
    messages: {
      // French and English translations are already included!
      // You can add your custom translations
      fr: {
        // Override translations
        inputPhoneNumber: {
          countrySelect: {
            placeholder: 'Code pays',
            error: 'Choisir le pays',
            searchPlaceholder: 'Rechercher le pays'
          },
          phoneInput: {
            example: 'Exemple: {example}'
          }
        }
      },

      // Add an other language
      nl: {
        inputPhoneNumber: {
          countrySelect: {
            placeholder: 'Country code',
            error: 'Choose country',
            searchPlaceholder: 'Search country'
          }
        }
      }
    }
  }
})
```

## preloadFallback Option

The `preloadFallback` option controls whether the fallback language is preloaded when the application starts.

### Default behavior (`preloadFallback: true`)

```typescript
app.use(MazUi, {
  translations: {
    locale: 'fr',
    fallbackLocale: 'en',
    preloadFallback: true, // Default
  }
})
```

**Advantages:**
- ✅ **No delay** - Fallback translations are immediately available
- ✅ **Smooth experience** - No missing text even if a translation doesn't exist
- ✅ **Reliability** - Guarantees there's always a translation available

**Disadvantages:**
- ❌ **Initial size** - Loads slightly more data at startup

### Disable preloading (`preloadFallback: false`)

```typescript
app.use(MazUi, {
  translations: {
    locale: 'fr',
    fallbackLocale: 'en',
    preloadFallback: false, // Disable preloading
  }
})
```

**Advantages:**
- ✅ **Smaller bundle** - Less data loaded at startup
- ✅ **Optimization** - Loading only on demand

**Disadvantages:**
- ❌ **Possible delay** - May temporarily display translation keys
- ❌ **Complexity** - Requires finer loading state management

### Recommendation

**Keep `preloadFallback: true`** in most cases, except if:
- You have very strict performance constraints
- Your application is very large
- You manually manage loading states

## Enhanced Lazy Loading

::: tip BUILT-IN FEATURE
All supported languages (fr, es, de, it, pt, ja, zh-CN) are automatically loaded lazily. You don't need to configure anything to benefit from this.
:::

The Maz-UI translation system natively supports **lazy loading**, a powerful feature to optimize your application's performance.

### What is lazy loading?

Lazy loading means translations are only loaded when the user needs them, rather than all at once at startup.

**Real example:**
- Your app starts in French → Only French translations are loaded
- User clicks "English" → English translations load at that moment
- User clicks "Español" → Spanish translations load at that moment

### Benefits of lazy loading

- 🚀 **Faster startup** - Less data to load initially
- 📦 **Smaller bundle** - Translations are in separate chunks
- 🌐 **Scalable** - Add as many languages as you want without performance impact
- 💾 **Bandwidth savings** - Users only download what they use

### Lazy loading configuration

#### Method 1: Dynamic imports (Recommended)

```typescript
import { createApp } from 'vue'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import App from './App.vue'

const app = createApp(App)

app.use(MazUi, {
  translations: {
    locale: 'en', // Starting language
    fallbackLocale: 'en',
    preloadFallback: false, // Optimization: no preloading
    messages: {
      // Default translations are automatically loaded lazily
      // You can override with your own files

      // French: loaded only when needed
      fr: () => import('./locales/fr.ts'),

      // Spanish: loaded only when needed
      es: () => import('./locales/es.json'),

      // German: loaded with default export
      de: () => import('./locales/de.ts'),

      // Dutch: custom translations
      nl: () => import('./locales/nl.ts')
    }
  }
})
```

#### Method 2: Loading from API

```typescript
app.use(MazUi, {
  translations: {
    locale: 'en',
    messages: {
      // Load from your API
      fr: async () => {
        const response = await fetch('/api/translations/fr')
        return response.json()
      },

      // Combine multiple sources
      es: async () => {
        const [defaultTranslations, customTranslations] = await Promise.all([
          // Default Maz-UI translations
          import('@maz-ui/translations/locales/es').then(m => m.default),
          // Your custom translations
          fetch('/api/translations/es/custom').then(r => r.json())
        ])
        return { ...defaultTranslations, ...customTranslations }
      }
    }
  }
})
```

#### Method 3: Mix immediate and lazy loading

```typescript
app.use(MazUi, {
  translations: {
    locale: 'fr',
    messages: {
      // French: loaded immediately (direct object)
      fr: {
        inputPhoneNumber: {
          countrySelect: {
            placeholder: 'Country code',
            error: 'Choose country'
          }
        }
      },

      // English: loaded lazily (function)
      en: () => import('./locales/en.ts'),

      // Spanish: loaded lazily (function)
      es: () => import('./locales/es.ts')
    }
  }
})
```

### Create your translation files

Check the [all translations keys](#all-translations-keys) section to see all available keys.

Create separate files for each language:

```typescript
// locales/fr.ts
export default {
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Code pays',
      error: 'Choisir le pays',
      searchPlaceholder: 'Rechercher le pays'
    },
    phoneInput: {
      placeholder: 'Numéro de téléphone',
      example: 'Exemple: {example}'
    }
  },
  dropzone: {
    dragAndDrop: 'Déposez vos fichiers',
    selectFile: 'Sélectionner un fichier',
    divider: 'ou'
  },
  // You can omit translations you don't want to override
  // Default Maz-UI translations will be used automatically
}
```

```typescript
// locales/nl.ts (new language)
export default {
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Landcode',
      error: 'Kies land',
      searchPlaceholder: 'Zoek het land'
    },
    phoneInput: {
      placeholder: 'Telefoonnummer',
      example: 'Bijvoorbeeld: {example}'
    }
  },
  dropzone: {
    dragAndDrop: 'Sleep je bestanden hierheen',
    selectFile: 'Bestand selecteren',
    divider: 'of'
  }
}
```

### Using lazy loading in your components

```vue
<script setup>
import { useTranslations } from '@maz-ui/translations'
import { ref } from 'vue'

const { locale, setLocale } = useTranslations()
const isLoading = ref(false)

// Function to change language with loading state
async function switchLanguage(newLocale) {
  isLoading.value = true
  try {
    await setLocale(newLocale) // This will load translations if needed
    console.log(`Language changed to ${newLocale}`)
  } catch (error) {
    console.error('Failed to load translations:', error)
    // Handle error (show toast, etc.)
  } finally {
    isLoading.value = false
  }
}

// Function to preload a language (optional)
async function preloadLanguage(locale) {
  try {
    await setLocale(locale)
    console.log(`Language ${locale} preloaded`)
  } catch (error) {
    console.error(`Failed to preload ${locale}:`, error)
  }
}
</script>

<template>
  <div>
    <div class="language-switcher">
      <button
        :disabled="isLoading"
        @click="switchLanguage('fr')"
      >
        🇫🇷 {{ isLoading && locale === 'fr' ? 'Loading...' : 'Français' }}
      </button>

      <button
        :disabled="isLoading"
        @click="switchLanguage('es')"
      >
        🇪🇸 {{ isLoading && locale === 'es' ? 'Cargando...' : 'Español' }}
      </button>

      <button
        :disabled="isLoading"
        @click="switchLanguage('de')"
      >
        🇩🇪 {{ isLoading && locale === 'de' ? 'Laden...' : 'Deutsch' }}
      </button>
    </div>

    <!-- Global loading indicator -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        Loading translations...
      </div>
    </div>

    <!-- Button to preload a language -->
    <button @click="preloadLanguage('it')" class="preload-btn">
      Preload Italian
    </button>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  background: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
```

### Advanced lazy loading strategies

#### 1. Conditional loading based on geolocation

```typescript
// Automatic language detection based on location
async function detectUserLanguage() {
  try {
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0]

    // Check if we support this language
    const supportedLanguages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ja', 'zh']

    if (supportedLanguages.includes(browserLang)) {
      return browserLang
    }

    // Fallback to English
    return 'en'
  } catch {
    return 'en'
  }
}

// Configuration with automatic detection
app.use(MazUi, {
  translations: {
    locale: await detectUserLanguage(),
    messages: {
      fr: () => import('./locales/fr.ts'),
      es: () => import('./locales/es.ts'),
      de: () => import('./locales/de.ts'),
      // ... other languages
    }
  }
})
```

#### 2. Smart caching

```typescript
// Custom cache for translations
const translationCache = new Map()

const messages = {
  fr: async () => {
    if (translationCache.has('fr')) {
      return translationCache.get('fr')
    }

    const translations = await import('./locales/fr.ts').then(m => m.default)
    translationCache.set('fr', translations)
    return translations
  }
}
```

## Using translations in your components

Once you've configured the plugin, you can control the language in your Vue components:

```vue
<script setup>
import { useTranslations } from '@maz-ui/translations'

// Get the translation tools
const { locale, setLocale } = useTranslations()

// Functions to change language
function switchToFrench() {
  setLocale('fr')
}

function switchToSpanish() {
  setLocale('es')
}

function switchToEnglish() {
  setLocale('en')
}
</script>

<template>
  <div>
    <!-- Language switcher buttons -->
    <div class="language-switcher">
      <button @click="switchToEnglish">
        🇺🇸 English
      </button>
      <button @click="switchToFrench">
        🇫🇷 Français
      </button>
      <button @click="switchToSpanish">
        🇪🇸 Español
      </button>
    </div>

    <!-- Show current language -->
    <p>Current language: {{ locale }}</p>

    <!-- Your Maz-UI components will automatically use the right language! -->
    <MazInput />
    <MazBtn />
    <MazSelect />
  </div>
</template>
```

## Lazy Loading (Performance Optimization)

### Benefits of lazy loading

- **Faster startup** - Less data to load initially
- **Smaller bundle** - Translations are in separate chunks
- **Scalable** - Add as many languages as you want without performance impact
- **Bandwidth savings** - Users only download what they use

For better performance, you can load translation files only when they're needed. This is perfect for large applications with many languages:

### Option 1: Simple lazy loading with dynamic imports

```typescript
import { createApp } from 'vue'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import App from './App.vue'

const app = createApp(App)

app.use(MazUi, {
  translations: {
    locale: 'en', // Start with English (already loaded)
    messages: {
      // French will be loaded only when user switches to French
      fr: () => import('./locales/fr.ts').then(m => m.default),

      // Spanish will be loaded only when user switches to Spanish
      es: () => import('./locales/es.json'),

      // German will be loaded only when user switches to German
      de: () => import('./locales/de.ts').then(m => m.default)
    }
  }
})

app.mount('#app')
```

### Option 2: Loading from API

```typescript
app.use(MazUi, {
  translations: {
    locale: 'en',
    messages: {
      // Load French translations from your API
      fr: async () => {
        const response = await fetch('/api/translations/fr')
        return response.json()
      },

      // Load from multiple sources
      es: async () => {
        const [componentTranslations, customTranslations] = await Promise.all([
          fetch('/api/translations/es/components').then(r => r.json()),
          fetch('/api/translations/es/custom').then(r => r.json())
        ])
        return { ...componentTranslations, ...customTranslations }
      }
    }
  }
})
```

### Create translation files

Create separate files for each language:

```typescript
// locales/fr.ts
export default {
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Code pays',
      error: 'Choisir un pays',
      searchPlaceholder: 'Rechercher le pays'
    },
    phoneInput: {
      placeholder: 'Numéro de téléphone',
      example: 'Exemple: {example}'
    }
  },
  dropzone: {
    dragAndDrop: 'Déposez vos fichiers',
    selectFile: 'Sélectionner un fichier',
    divider: 'ou'
  }
  // ... other translations
}
```

```typescript
// locales/es.ts
export default {
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Código de país',
      error: 'Elegir país',
      searchPlaceholder: 'Buscar el país'
    },
    phoneInput: {
      placeholder: 'Número de teléfono',
      example: 'Ejemplo: {example}'
    }
  },
  dropzone: {
    dragAndDrop: 'Suelta tus archivos',
    selectFile: 'Seleccionar archivo',
    divider: 'o'
  }
  // ... other translations
}
```

### Using lazy loading in your components

```vue
<script setup>
import { useTranslations } from '@maz-ui/translations'
import { ref } from 'vue'

const { locale, setLocale } = useTranslations()
const isLoading = ref(false)

// Function to change language with loading state
async function switchLanguage(newLocale) {
  isLoading.value = true
  try {
    await setLocale(newLocale) // This will load translations if needed
    console.log(`Language changed to ${newLocale}`)
  } catch (error) {
    console.error('Failed to load translations:', error)
    // Handle error (show toast, etc.)
  } finally {
    isLoading.value = false
  }
}

// Function to preload a language (optional)
async function preloadLanguage(locale) {
  try {
    await setLocale(locale)
    console.log(`Language ${locale} preloaded`)
  } catch (error) {
    console.error(`Failed to preload ${locale}:`, error)
  }
}
</script>

<template>
  <div>
    <div class="language-switcher">
      <button
        :disabled="isLoading"
        @click="switchLanguage('fr')"
      >
        🇫🇷 {{ isLoading && locale === 'fr' ? 'Loading...' : 'Français' }}
      </button>

      <button
        :disabled="isLoading"
        @click="switchLanguage('es')"
      >
        🇪🇸 {{ isLoading && locale === 'es' ? 'Cargando...' : 'Español' }}
      </button>

      <button
        :disabled="isLoading"
        @click="switchLanguage('de')"
      >
        🇩🇪 {{ isLoading && locale === 'de' ? 'Laden...' : 'Deutsch' }}
      </button>
    </div>

    <!-- Global loading indicator -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        Loading translations...
      </div>
    </div>

    <!-- Button to preload a language -->
    <button @click="preloadLanguage('it')" class="preload-btn">
      Preload Italian
    </button>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  background: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
```

### Advanced lazy loading strategies

#### 1. Conditional loading based on geolocation

```typescript
// Automatic language detection based on location
async function detectUserLanguage() {
  try {
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0]

    // Check if we support this language
    const supportedLanguages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ja', 'zh']

    if (supportedLanguages.includes(browserLang)) {
      return browserLang
    }

    // Fallback to English
    return 'en'
  } catch {
    return 'en'
  }
}

// Configuration with automatic detection
app.use(MazUi, {
  translations: {
    locale: await detectUserLanguage(),
    messages: {
      fr: () => import('./locales/fr.ts'),
      es: () => import('./locales/es.ts'),
      de: () => import('./locales/de.ts'),
      // ... other languages
    }
  }
})
```

#### 2. Smart caching

```typescript
// Custom cache for translations
const translationCache = new Map()

const messages = {
  fr: async () => {
    if (translationCache.has('fr')) {
      return translationCache.get('fr')
    }

    const translations = await import('./locales/fr.ts').then(m => m.default)
    translationCache.set('fr', translations)
    return translations
  }
}
```

## Variables in translations

Some translations have variables (words in curly braces like `{example}` or `{page}`). These get replaced automatically:

```typescript
// Your translation
phoneInput: {
  example: 'Example: {example}'
}

// Becomes something like
// "Example: +33 6 12 34 56 78"
```

```typescript
// Your translation
pagination: {
  screenReaderPage: 'Page {page}'
}

// Becomes something like
// "Page 3"
```

## Complete example with multiple languages

Here's a full example with English, French, and Spanish:

```typescript
import { createApp } from 'vue'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import App from './App.vue'

const app = createApp(App)

app.use(MazUi, {
  translations: {
    locale: 'en', // Start with English
    messages: {
      // English (default - you don't need to provide this unless you want to override the default translations)
      en: {
        inputPhoneNumber: {
          countrySelect: {
            placeholder: 'Country code',
            error: 'Choose country',
            searchPlaceholder: 'Search the country'
          },
          phoneInput: {
            placeholder: 'Phone number',
            example: 'Example: {example}'
          }
        }
      },

      // French
      fr: {
        inputPhoneNumber: {
          countrySelect: {
            placeholder: 'Code pays',
            error: 'Choisir un pays',
            searchPlaceholder: 'Rechercher le pays'
          },
          phoneInput: {
            placeholder: 'Numéro de téléphone',
            example: 'Exemple: {example}'
          }
        },
        dropzone: {
          dragAndDrop: 'Déposez vos fichiers',
          selectFile: 'Sélectionner un fichier',
          divider: 'ou',
          fileMaxCount: 'Maximum {count} fichiers',
          fileMaxSize: 'Maximum {size} MB',
          fileTypes: 'Types de fichiers autorisés: {types}'
        },
        pagination: {
          navAriaLabel: 'navigation de page',
          screenReader: {
            firstPage: 'Première page, page {page}',
            previousPage: 'Page précédente, page {page}',
            page: 'Page {page}',
            nextPage: 'Page suivante, page {page}',
            lastPage: 'Dernière page, page {page}'
          }
        }
      },

      // Spanish
      es: {
        inputPhoneNumber: {
          countrySelect: {
            placeholder: 'Código de país',
            error: 'Elegir país',
            searchPlaceholder: 'Buscar el país'
          },
          phoneInput: {
            placeholder: 'Número de teléfono',
            example: 'Ejemplo: {example}'
          }
        },
        dropzone: {
          dragAndDrop: 'Suelta tus archivos',
          selectFile: 'Seleccionar archivo',
          divider: 'o',
          fileMaxCount: 'Máximo {count} archivos',
          fileMaxSize: 'Máximo {size} MB',
          fileTypes: 'Tipos de archivo permitidos: {types}'
        },
        pagination: {
          navAriaLabel: 'navegación de página',
          screenReader: {
            firstPage: 'Primera página, página {page}',
            previousPage: 'Página anterior, página {page}',
            page: 'Página {page}',
            nextPage: 'Página siguiente, página {page}',
            lastPage: 'Última página, página {page}'
          }
        }
      }
    }
  }
})

app.mount('#app')
```

## Creating a language switcher component

Here's a nice language switcher you can use in your app:

```vue
<script setup lang="ts">
import { useTranslations } from '@maz-ui/translations'
import type { MazDropdownProps } from 'maz-ui/components'

const { locale, setLocale } = useTranslations()

const languages: MazDropdownProps['items'] = [
  { label: '🇺🇸 English', onClick: () => setLocale('en'),  },
  { label: '🇫🇷 Français', onClick: () => setLocale('fr'),  },
  { label: '🇪🇸 Español', onClick: () => setLocale('es'),  },
  { label: '🇩🇪 Deutsch', onClick: () => setLocale('de'),  },
  { label: '🇮🇹 Italiano', onClick: () => setLocale('it'),  }
]
</script>

<template>
  <MazDropdown class="language-switcher" :items="languages" trigger="click">
    {{ locale }}
  </MazDropdown>
</template>
```

## All translations keys

```typescript
export default {
  /**
   * This is the translation for the input phone number component.
   * The keys are:
   * - countrySelect: The translation for the country select.
   * - phoneInput: The translation for the phone input.
   */
  selectCountry: {
    searchPlaceholder: 'Search country',
  },
  inputPhoneNumber: {
    /**
     * This is the translation for the country select component.
     * The keys are:
     * - placeholder: The translation for the placeholder text.
     * - error: The translation for the error text.
     * - searchPlaceholder: The translation for the search placeholder text.
     */
    countrySelect: {
      placeholder: 'Country code',
      error: 'Choose country',
      searchPlaceholder: 'Search the country',
    },
    /**
     * This is the translation for the phone input component.
     * The keys are:
     * - placeholder: The translation for the placeholder text.
     * - example: The translation for the example text.
     */
    phoneInput: {
      placeholder: 'Phone number',
      example: 'Example: {example}',
    },
  },
  /**
   * This is the translation for the dropzone component.
   * The keys are:
   * - dragAndDrop: The translation for the drag and drop text.
   * - selectFile: The translation for the select file button.
   * - divider: The translation for the divider text.
   * - fileMaxCount: The translation for the maximum number of files.
   * - fileMaxSize: The translation for the maximum size of the files.
   * - fileTypes: The translation for the allowed file types.
   */
  dropzone: {
    dragAndDrop: 'Drop your files',
    selectFile: 'Select file',
    divider: 'or',
    fileMaxCount: 'Maximum {count} files',
    fileMaxSize: 'Maximum {size} MB',
    fileTypes: 'Allowed file types: {types}',
  },
  /**
   * This is the translation for the date picker component.
   * The keys are:
   * - shortcuts: The translation for the shortcuts.
   */
  datePicker: {
    shortcuts: {
      lastSevenDays: 'Last 7 days',
      lastThirtyDays: 'Last 30 days',
      thisWeek: 'This week',
      lastWeek: 'Last week',
      thisMonth: 'This month',
      thisYear: 'This year',
      lastYear: 'Last year',
    },
  },
  /**
   * This is the translation for the dropdown component.
   * The keys are:
   * - screenReaderDescription: The translation for the screen reader description.
   */
  dropdown: {
    screenReaderDescription: 'Open menu dropdown',
  },
  /**
   * This is the translation for the select component.
   * The keys are:
   * - searchPlaceholder: The translation for the search placeholder text.
   */
  select: {
    searchPlaceholder: 'Search',
  },
  /**
   * This is the translation for the table component.
   * The keys are:
   * - noResults: The translation for the no results text.
   * - actionColumnTitle: The translation for the action column title.
   * - searchByInput: The translation for the search by input.
   * - searchInput: The translation for the search input.
   * - pagination: The translation for the pagination component.
   */
  table: {
    noResults: 'No results',
    actionColumnTitle: 'Actions',
    searchByInput: {
      all: 'All',
      placeholder: 'Search by',
    },
    searchInput: {
      placeholder: 'Search',
    },
    pagination: {
      all: 'All',
      rowsPerPage: 'Rows per page',
      of: 'of',
    },
  },
  /**
   * This is the translation for the pagination component.
   * The keys are:
   * - navAriaLabel: The aria-label for the navigation (nav) element.
   * - screenReader.firstPage: The translation for the first page button (screen reader).
   * - screenReader.previousPage: The translation for the previous page button (screen reader).
   * - screenReader.page: The translation for the current page button (screen reader).
   * - screenReader.nextPage: The translation for the next page button (screen reader).
   * - screenReader.lastPage: The translation for the last page button (screen reader).
   */
  pagination: {
    navAriaLabel: 'page navigation',
    screenReader: {
      firstPage: 'First Page, page {page}',
      previousPage: 'Previous Page, page {page}',
      page: 'Page {page}',
      nextPage: 'Next Page, page {page}',
      lastPage: 'Last Page, page {page}',
    },
  },
  /**
   * This is the translation for the carousel component.
   * The keys are:
   * - ariaLabel.previousButton: The aria-label for the previous button.
   * - ariaLabel.nextButton: The aria-label for the next button.
   */
  carousel: {
    ariaLabel: {
      previousButton: 'Scroll to previous items',
      nextButton: 'Scroll to next items',
    },
  },
  /**
   * This is the translation for the checklist component.
   * The keys are:
   * - noResultsFound: The translation for the no results found text.
   * - searchInput.placeholder: The translation for the search input placeholder.
   */
  checklist: {
    noResultsFound: 'No results found',
    searchInput: {
      placeholder: 'Search',
    },
  },
}
```

## Important Notes

1. **All languages are included by default (fr, es, de, it, pt, ja, zh-CN)** - You don't need to provide these languages unless you want to modify them.

2. **Translate only what you need** - You're not required to translate every key. Add only those for the components you use.

3. **The magic happens automatically** - Once you configure translations, all Maz-UI components will automatically use the right language when you call `setLocale()`.

4. **Variables are replaced automatically** - Don't worry about `{example}`, `{page}`, etc. - Maz-UI handles them for you.

5. **Fallback to English** - If a translation is missing in your language and in your fallback language, it will fall back to English.

6. **Lazy loading is asynchronous** - When using lazy loading, `setLocale()` returns a Promise. Use `await setLocale('fr')` in your code.

7. **Translations are cached** - Once a language is loaded, it stays in memory. Switching back to a previously loaded language is instant.

8. **preloadFallback option** - By default (`preloadFallback: true`), the fallback language is preloaded at startup for a smoother experience. Set to `false` to optimize initial loading.

9. **8 ready-to-use languages** - Maz-UI includes complete translations for 8 languages that are automatically loaded with lazy loading.

10. **Partial translations** - You can provide partial translations. Maz-UI will automatically use default translations for missing keys.

## That's it! 🎉

Now your Maz-UI components can speak any language you want. Your users can change languages and everything updates instantly!

With **8 languages included by default** and **automatic lazy loading**, you have a complete and optimized internationalization solution ready to use.

## Need help?

- Check that your translation keys match the examples above
- Make sure to call `setLocale()` with the correct language code
- Remember that component text changes automatically - you don't need to do anything special
- Use `preloadFallback: false` if you want to optimize initial loading
- Default translations are automatically loaded with lazy loading
