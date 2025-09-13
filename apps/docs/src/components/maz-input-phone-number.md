---
title: MazInputPhoneNumber
description: MazInputPhoneNumber is a powerful and user-friendly component that helps users enter and validate phone numbers from any country with automatic formatting and validation
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/translated-component.md-->

::: tip ✨ What makes this component special?
- **Smart country detection** - Automatically detects country from browser locale or IP
- **Real-time validation** - Visual feedback as you type
- **Auto-formatting** - Formats numbers according to country standards
- **Search countries** - Find countries quickly in the dropdown
- **Customizable** - Full control over appearance and behavior
- **Accessible** - Keyboard navigation and screen reader support
- **International** - Supports all countries and phone formats
:::

## Basic Usage

The simplest way to use MazInputPhoneNumber - just add it and it works!

<ComponentDemo>
  <MazInputPhoneNumber
    v-model="phoneNumber"
    v-model:country-code="countryCode"
    @data="results = $event"
  />

  <div class="maz-mt-4 maz-text-sm">
    <p><strong>Phone Number:</strong> {{ phoneNumber || 'Not entered yet' }}</p>
    <p><strong>Country:</strong> {{ countryCode || 'Not selected' }}</p>
    <p><strong>Is Valid:</strong> {{ results?.isValid ? '✅ Yes' : '❌ No' }}</p>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { MazInputPhoneNumber } from 'maz-ui'
import { ref } from 'vue'

const phoneNumber = ref()
const countryCode = ref()
const results = ref()
</script>

<template>
  <MazInputPhoneNumber
    v-model="phoneNumber"
    v-model:country-code="countryCode"
    @data="results = $event"
  />
</template>
```

</template>
</ComponentDemo>

## Country Management

Control which countries appear in the dropdown and their order.

<ComponentDemo>
  <div class="maz-space-y-4">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Preferred Countries</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Show your most common countries first</p>
      <MazInputPhoneNumber
        v-model="phone1"
        :preferred-countries="['US', 'FR', 'GB', 'DE', 'CA']"
        placeholder="Common countries appear first"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Only Specific Countries</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Limit to certain countries only</p>
      <MazInputPhoneNumber
        v-model="phone2"
        :only-countries="['US', 'FR', 'GB', 'DE', 'IT', 'ES']"
        placeholder="Only European + North American countries"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Ignore Countries</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Remove unwanted countries</p>
      <MazInputPhoneNumber
        v-model="phone3"
        :ignored-countries="['AF', 'AL', 'DZ']"
        placeholder="Some countries are hidden"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Preferred countries (moved to top, order not preserved) -->
  <MazInputPhoneNumber
    v-model="phoneNumber"
    :preferred-countries="['US', 'FR', 'GB', 'DE', 'CA']"
    placeholder="Common countries appear first"
  />

  <!-- Only specific countries -->
  <MazInputPhoneNumber
    v-model="phoneNumber"
    :only-countries="['US', 'FR', 'GB', 'DE', 'IT', 'ES']"
    placeholder="Only European + North American countries"
  />

  <!-- Ignore certain countries -->
  <MazInputPhoneNumber
    v-model="phoneNumber"
    :ignored-countries="['AF', 'AL', 'DZ']"
    placeholder="Some countries are hidden"
  />
</template>
```

</template>
</ComponentDemo>

## Layout Orientations

Choose how the country selector and phone input are arranged.

<ComponentDemo>
  <div class="maz-space-y-6">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Responsive (Default)</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Stacks on mobile, side-by-side on desktop</p>
      <MazInputPhoneNumber orientation="responsive" />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Always Row</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Side-by-side on all screen sizes</p>
      <MazInputPhoneNumber orientation="row" />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Always Column</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Stacked on all screen sizes</p>
      <MazInputPhoneNumber orientation="col" />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Responsive layout (default) -->
  <MazInputPhoneNumber orientation="responsive" />

  <!-- Always side-by-side -->
  <MazInputPhoneNumber orientation="row" />

  <!-- Always stacked -->
  <MazInputPhoneNumber orientation="col" />
</template>
```

</template>
</ComponentDemo>

## Display Options

Customize what information is shown to users.

<ComponentDemo>
  <div class="maz-space-y-6">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Show Country Names</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Display country names instead of calling codes</p>
      <MazInputPhoneNumber
        display-country-name
        :translations="{
          countrySelect: { placeholder: 'Choose country' }
        }"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Show Calling Codes in List</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Help users see the dialing codes</p>
      <MazInputPhoneNumber show-code-in-list />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Hide Phone Examples</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">
        Remove the example phone number hints (visible when the phone input is focused)
      </p>
      <MazInputPhoneNumber :example="false" />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Hide Country Flags</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Text-only country selection</p>
      <MazInputPhoneNumber hide-flags />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Show country names instead of codes -->
  <MazInputPhoneNumber
    display-country-name
    :translations="{ countrySelect: { placeholder: 'Choose country' } }"
  />

  <!-- Show calling codes in dropdown -->
  <MazInputPhoneNumber show-code-in-list />

  <!-- Hide phone number examples -->
  <MazInputPhoneNumber :example="false" />

  <!-- Hide country flags -->
  <MazInputPhoneNumber hide-flags />
</template>
```

</template>
</ComponentDemo>

## Smart Country Detection

Let the component automatically detect the user's country.

<ComponentDemo>
  <div class="maz-space-y-6">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Browser Locale Detection</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Uses browser language settings (enabled by default)</p>
      <MazInputPhoneNumber :use-browser-locale="true" />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">IP-based Detection</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Fetches country from user's IP address</p>
      <MazInputPhoneNumber fetch-country />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Manual Default Country</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Set a specific default country</p>
      <MazInputPhoneNumber
        :use-browser-locale="false"
        country-code="JP"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Auto-detect from browser (default behavior) -->
  <MazInputPhoneNumber :use-browser-locale="true" />

  <!-- Auto-detect from IP address -->
  <MazInputPhoneNumber fetch-country />

  <!-- Set specific default country -->
  <MazInputPhoneNumber
    :use-browser-locale="false"
    country-code="JP"
  />
</template>
```

</template>
</ComponentDemo>

## Phone Number Formatting

Control how phone numbers are automatically formatted as users type.

<ComponentDemo>
  <div class="maz-space-y-6">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Format on Blur (Default)</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Shows raw input while typing, formats when field loses focus</p>
      <MazInputPhoneNumber
        auto-format="blur"
        country-code="US"
        :translations="{
          phoneInput: {
            placeholder: 'Type freely, formats on blur'
          }
        }"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Format While Typing</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Real-time formatting as you type</p>
      <MazInputPhoneNumber
        auto-format="typing"
        country-code="FR"
        :translations="{
          phoneInput: {
            placeholder: 'Formats as you type'
          }
        }"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Disable Formatting</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">For countries with multiple valid lengths or custom formatting</p>
      <MazInputPhoneNumber
        auto-format="disabled"
        country-code="AI"
        :translations="{
          phoneInput: {
            placeholder: 'Raw input, no formatting'
          }
        }"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Format on blur (default) - best UX for most cases -->
  <MazInputPhoneNumber auto-format="blur" />

  <!-- Format while typing - immediate visual feedback -->
  <MazInputPhoneNumber auto-format="typing" />

  <!-- Disable formatting - for special cases -->
  <MazInputPhoneNumber auto-format="disabled" />

  <!-- Legacy boolean support (false = disabled, true = typing) -->
  <MazInputPhoneNumber :auto-format="false" />
</template>
```

</template>
</ComponentDemo>

## Validation States

Control the visual validation feedback and success/error indicators.

<ComponentDemo>
  <div class="maz-space-y-6">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Hide Validation UI</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">No visual success/error indicators</p>
      <MazInputPhoneNumber
        :validation-success="false"
        :validation-error="false"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Force Success State</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Always show success styling</p>
      <MazInputPhoneNumber success />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Force Error State</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Always show error styling</p>
      <MazInputPhoneNumber error />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Hide validation indicators -->
  <MazInputPhoneNumber
    :validation-success="false"
    :validation-error="false"
  />

  <!-- Force success state -->
  <MazInputPhoneNumber success />

  <!-- Force error state -->
  <MazInputPhoneNumber error />
</template>
```

</template>
</ComponentDemo>

## Internationalization

Make the component speak your users' language.

<ComponentDemo>
  <div class="maz-space-y-6">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Custom Labels</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Translate all text in the interface</p>
      <MazInputPhoneNumber
        :translations="{
          countrySelect: {
            placeholder: 'Select your country',
            error: 'Please choose a country',
            searchPlaceholder: 'Search countries...'
          },
          phoneInput: {
            placeholder: 'Enter phone number',
            example: 'Format: {example}'
          }
        }"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Country Names in French</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Change the language of country names</p>
      <MazInputPhoneNumber country-locale="fr-FR" />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Custom Country Names</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Override specific country names</p>
      <MazInputPhoneNumber
        :custom-countries-list="{
          US: 'United States of America',
          GB: 'United Kingdom',
          FR: 'République Française'
        }"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Custom translations -->
  <MazInputPhoneNumber
    :translations="{
      countrySelect: {
        placeholder: 'Select your country',
        error: 'Please choose a country',
        searchPlaceholder: 'Search countries...'
      },
      phoneInput: {
        placeholder: 'Enter phone number',
        example: 'Format: {example}'
      }
    }"
  />

  <!-- French country names -->
  <MazInputPhoneNumber country-locale="fr-FR" />

  <!-- Custom country names -->
  <MazInputPhoneNumber
    :custom-countries-list="{
      US: 'United States of America',
      GB: 'United Kingdom',
      FR: 'République Française'
    }"
  />
</template>
```

</template>
</ComponentDemo>

## Custom Flag Styling

Replace the default flag emojis with your own design.

<ComponentDemo>
  <div class="maz-space-y-6">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Country Code Badges</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Show country codes instead of flags</p>
      <MazInputPhoneNumber>
        <template #selector-flag="{ countryCode }">
          <span
            id="custom-flag-element"
            class="maz-bg-primary maz-text-primary-foreground maz-px-2 maz-py-1 maz-rounded maz-text-xs maz-font-semibold"
          >
            {{ countryCode }}
          </span>
        </template>
        <template #country-list-flag="{ countryCode }">
          <MazBadge size="sm" class="maz-me-2 maz-min-w-[2.5rem]">
            {{ countryCode }}
          </MazBadge>
        </template>
      </MazInputPhoneNumber>
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Custom Icons</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Use your own flag icons or designs</p>
      <MazInputPhoneNumber>
        <template #selector-flag="{ countryCode }">
          <div
            id="icon-flag-element"
            class="maz-w-6 maz-h-6 maz-bg-gradient-to-r maz-from-blue-500 maz-to-green-500 maz-rounded-full maz-flex maz-items-center maz-justify-center maz-text-white maz-text-xs maz-font-bold"
          >
            {{ countryCode?.charAt(0) }}
          </div>
        </template>
        <template #country-list-flag="{ countryCode }">
          <div class="maz-w-6 maz-h-6 maz-bg-gradient-to-r maz-from-purple-500 maz-to-pink-500 maz-rounded maz-flex maz-items-center maz-justify-center maz-text-white maz-text-xs maz-font-bold maz-me-2">
            {{ countryCode?.charAt(0) }}
          </div>
        </template>
      </MazInputPhoneNumber>
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Country code badges -->
  <MazInputPhoneNumber>
    <template #selector-flag="{ countryCode }">
      <span class="country-badge">
        {{ countryCode }}
      </span>
    </template>
    <template #country-list-flag="{ countryCode }">
      <MazBadge size="sm" class="maz-me-2">
        {{ countryCode }}
      </MazBadge>
    </template>
  </MazInputPhoneNumber>

  <!-- Custom icons -->
  <MazInputPhoneNumber>
    <template #selector-flag="{ countryCode }">
      <div class="custom-flag-icon">
        {{ countryCode?.charAt(0) }}
      </div>
    </template>
    <template #country-list-flag="{ countryCode }">
      <div class="custom-list-icon">
        {{ countryCode?.charAt(0) }}
      </div>
    </template>
  </MazInputPhoneNumber>
</template>

<style scoped>
.country-badge {
  @apply maz-bg-primary maz-text-primary-foreground maz-px-2 maz-py-1 maz-rounded maz-text-xs maz-font-semibold;
}

.custom-flag-icon,
.custom-list-icon {
  @apply maz-w-6 maz-h-6 maz-bg-gradient-to-r maz-from-blue-500 maz-to-green-500 maz-rounded-full maz-flex maz-items-center maz-justify-center maz-text-white maz-text-xs maz-font-bold;
}

.custom-list-icon {
  @apply maz-me-2;
}
</style>
```

  ::: tip SVG Flags
  You can use libraries like [country-flag-icons](https://www.npmjs.com/package/country-flag-icons) to display beautiful SVG flags instead of emoji flags.
  :::

</template>
</ComponentDemo>

## Advanced Configuration

Fine-tune the component for specific use cases.

<ComponentDemo>
  <div class="maz-space-y-6">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Phone-only Mode</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Hide country selector, pre-select country</p>
      <MazInputPhoneNumber
        hide-country-select
        country-code="US"
        :translations="{
          phoneInput: {
            placeholder: 'US Phone Number'
          }
        }"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Custom Search Sensitivity</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Adjust how strict country search is (0 = fuzzy, 1 = exact)</p>
      <MazInputPhoneNumber
        :search-threshold="0.3"
        placeholder="Try searching 'unite' for United States"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Disable Search</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Remove search functionality from country list</p>
      <MazInputPhoneNumber :search="false" />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Different Dropdown Position</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-2">Control where the country list appears</p>
      <MazInputPhoneNumber list-position="top-start" />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Phone-only mode -->
  <MazInputPhoneNumber
    hide-country-select
    country-code="US"
    :translations="{
      phoneInput: {
        placeholder: 'US Phone Number'
      }
    }"
  />

  <!-- Fuzzy search -->
  <MazInputPhoneNumber :search-threshold="0.3" />

  <!-- No search -->
  <MazInputPhoneNumber :search="false" />

  <!-- Different dropdown position -->
  <MazInputPhoneNumber list-position="top-start" />
</template>
```

</template>
</ComponentDemo>

## Real-world Examples

See how to use the component in common scenarios.

<ComponentDemo>
  <div class="maz-space-y-8">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">🏢 Business Form</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-4">Perfect for customer registration</p>
      <div class="maz-max-w-md maz-grid maz-grid-cols-1 maz-gap-4">
        <MazInput label="Full Name" placeholder="John Doe" />
        <MazInput label="Email" type="email" placeholder="john@example.com" />
        <MazInputPhoneNumber
          v-model="businessPhone"
          v-model:country-code="businessCountry"
          label="Business Phone"
          :preferred-countries="['US', 'CA', 'GB', 'AU']"
          :validation-success="businessResults?.isValid"
          @data="businessResults = $event"
        />
        <MazBtn color="primary" block>
          Create Account
        </MazBtn>
      </div>
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">🌍 Global Support</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-4">Multi-language international form</p>
      <div class="maz-max-w-md">
        <MazInputPhoneNumber
          v-model="globalPhone"
          country-locale="es-ES"
          show-code-in-list
          :translations="{
            countrySelect: {
              placeholder: 'País',
              searchPlaceholder: 'Buscar país...'
            },
            phoneInput: {
              placeholder: 'Número de teléfono'
            }
          }"
        />
      </div>
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">📱 Mobile-first Design</h4>
      <p class="maz-text-sm maz-text-muted maz-mb-4">Optimized for mobile apps</p>
      <div class="maz-max-w-xs">
        <MazInputPhoneNumber
          v-model="mobilePhone"
          orientation="col"
          size="lg"
          fetch-country
          block
        />
      </div>
    </div>
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const businessPhone = ref()
const businessCountry = ref()
const businessResults = ref()

const globalPhone = ref()
const mobilePhone = ref()
</script>

<template>
  <!-- Business form -->
  <div class="form-container">
    <MazInput label="Full Name" placeholder="John Doe" />
    <MazInput label="Email" type="email" placeholder="john@example.com" />
    <MazInputPhoneNumber
      v-model="businessPhone"
      v-model:country-code="businessCountry"
      label="Business Phone"
      :preferred-countries="['US', 'CA', 'GB', 'AU']"
      @data="businessResults = $event"
    />
    <MazBtn color="primary" block>Create Account</MazBtn>
  </div>

  <!-- Global support -->
  <MazInputPhoneNumber
    v-model="globalPhone"
    country-locale="es-ES"
    show-code-in-list
    :translations="{
      countrySelect: {
        placeholder: 'País',
        searchPlaceholder: 'Buscar país...'
      },
      phoneInput: {
        placeholder: 'Número de teléfono'
      }
    }"
  />

  <!-- Mobile-first -->
  <MazInputPhoneNumber
    v-model="mobilePhone"
    orientation="col"
    size="lg"
    fetch-country
    block
  />
</template>
```

</template>
</ComponentDemo>

## Data Handling

Understanding what data the component provides.

<ComponentDemo>
  <div class="maz-space-y-4">
    <MazInputPhoneNumber
      v-model="dataPhone"
      v-model:country-code="dataCountry"
      label="Enter a phone number to see data"
      @data="phoneData = $event"
    />
    <div v-if="phoneData" class="maz-bg-surface-400 maz-p-4 maz-rounded">
      <h4 class="maz-font-semibold maz-mb-3">📊 Phone Number Data</h4>
      <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4 maz-text-sm">
        <div>
          <strong>Valid:</strong> {{ phoneData?.isValid ? '✅' : '❌' }}
        </div>
        <div>
          <strong>Country:</strong> {{ phoneData?.countryCode || 'None' }}
        </div>
        <div>
          <strong>National Format:</strong> {{ phoneData?.formatNational || 'None' }}
        </div>
        <div>
          <strong>International:</strong> {{ phoneData?.formatInternational || 'None' }}
        </div>
        <div>
          <strong>E164 Format:</strong> {{ phoneData?.e164 || 'None' }}
        </div>
        <div>
          <strong>Phone Type:</strong> {{ phoneData?.type || 'Unknown' }}
        </div>
      </div>
    </div>
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const dataPhone = ref()
const dataCountry = ref()
const phoneData = ref()

// Handle the data event
function handlePhoneData(results) {
  console.log('Phone validation results:', results)
  // results contains:
  // - isValid: boolean
  // - countryCode: string
  // - formatNational: string
  // - formatInternational: string
  // - e164: string
  // - type: 'mobile' | 'fixedLine' | etc.
  // - and more...
}
</script>

<template>
  <MazInputPhoneNumber
    v-model="dataPhone"
    v-model:country-code="dataCountry"
    @data="handlePhoneData"
  />
</template>
```

</template>
</ComponentDemo>

## Troubleshooting

Common issues and solutions:

### ⚠️ Auto-formatting Issues

For countries like Anguilla (AI) with multiple valid number lengths, disable auto-formatting:

```vue
<MazInputPhoneNumber auto-format="disabled" country-code="AI" />
```

### 🌐 Country Detection Not Working

Make sure to enable the right detection method:

```vue
<!-- Browser locale (default) -->
<MazInputPhoneNumber :use-browser-locale="true" />

<!-- IP-based detection (requires internet) -->
<MazInputPhoneNumber fetch-country />

<!-- Manual fallback -->
<MazInputPhoneNumber country-code="US" />
```

## Types

**Results object emitted by `@data` event:**

```ts
interface MazInputPhoneNumberData {
  isValid: boolean
  isPossible?: boolean
  countryCode?: CountryCode
  countryCallingCode?: CountryCallingCode
  nationalNumber?: NationalNumber
  type?: NumberType
  formatInternational?: string
  formatNational?: string
  uri?: string
  e164?: string
  rfc3966?: string
  possibleCountries?: CountryCode[]
  phoneNumber?: string
}
```

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->
<!--@include: ./../../.vitepress/generated-docs/maz-input-phone-number.doc.md-->

<script setup lang="ts">
  import { ref } from 'vue'

  // Basic usage
  const phoneNumber = ref()
  const countryCode = ref()
  const results = ref()

  // Country management
  const phone1 = ref()
  const phone2 = ref()
  const phone3 = ref()

  // Real-world examples
  const businessPhone = ref()
  const businessCountry = ref()
  const businessResults = ref()
  const globalPhone = ref()
  const mobilePhone = ref()

  // Data handling
  const dataPhone = ref()
  const dataCountry = ref()
  const phoneData = ref()
</script>
