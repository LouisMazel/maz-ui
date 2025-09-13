---
title: MazDatePicker
description: A powerful and flexible date picker component with support for single dates, date ranges, time selection, and extensive customization options
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/translated-component.md-->

## Table of Contents

- [Basic Usage](#basic-usage)
- [Date Formats](#date-formats)
- [Date Selection](#date-selection)
- [Time Selection](#time-selection)
- [Range Selection](#range-selection)
- [Internationalization](#internationalization)
- [Validation & Constraints](#validation--constraints)
- [Types](#types)
- [Props](#props)
- [Events](#events)
- [Slots](#slots)

## Basic Usage

The simplest way to use MazDatePicker:

<ComponentDemo>
  <MazDatePicker
    v-model="basicDate"
    label="Select a date"
    placeholder="Choose your date"
    format="YYYY-MM-DD"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="date"
    label="Select a date"
    placeholder="Choose your date"
    format="YYYY-MM-DD"
  />
</template>

<script setup>
import { ref } from 'vue'

const date = ref()
</script>
```

</template>
</ComponentDemo>

## Date Formats

Understanding date formats is crucial for using MazDatePicker effectively. The component uses two different format concepts:

### 1. Data Format (`format` prop)

This controls how dates are stored and transmitted in your `v-model`. Default is `'YYYY-MM-DD'`.

### 2. Display Format (`input-date-format` prop)

This controls how dates appear in the input field using `Intl.DateTimeFormatOptions`.

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-1 mob-l:maz-grid-cols-3 maz-gap-4">
    <MazDatePicker
      v-model="formatExample1"
      label="ISO Format (YYYY-MM-DD)"
      format="YYYY-MM-DD"
      :input-date-format="{ dateStyle: 'medium' }"
    />
    <MazDatePicker
      v-model="formatExample2"
      label="US Format (MM/DD/YYYY)"
      format="MM/DD/YYYY"
      :input-date-format="{ dateStyle: 'short' }"
    />
    <MazDatePicker
      v-model="formatExample3"
      label="European Format (DD-MM-YYYY)"
      format="DD-MM-YYYY"
      :input-date-format="{ dateStyle: 'medium' }"
    />
  </div>

<template #code>

```vue
<template>
  <!-- ISO Format (recommended) -->
  <MazDatePicker
    v-model="date1"
    label="ISO Format (YYYY-MM-DD)"
    format="YYYY-MM-DD"
    :input-date-format="{ dateStyle: 'medium' }"
  />

  <!-- US Format -->
  <MazDatePicker
    v-model="date2"
    label="US Format (MM/DD/YYYY)"
    format="MM/DD/YYYY"
    :input-date-format="{ dateStyle: 'short' }"
  />

  <!-- European Format -->
  <MazDatePicker
    v-model="date3"
    label="European Format (DD-MM-YYYY)"
    format="DD-MM-YYYY"
    :input-date-format="{ dateStyle: 'medium' }"
  />
</template>

<script setup>
import { ref } from 'vue'

const date1 = ref('2024-03-15')        // ISO format
const date2 = ref('03/15/2024')        // US format
const date3 = ref('15-03-2024')        // European format
</script>
```

</template>
</ComponentDemo>

### Custom Display Transformation

Use `inputDateTransformer` to completely customize how dates appear in the input:

<ComponentDemo>
  <MazDatePicker
    v-model="transformedDate"
    label="Custom Display Format"
    :input-date-transformer="({ value }) => value ? `📅 ${dayjs(value).format('dddd, MMMM Do YYYY')}` : ''"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="date"
    label="Custom Display Format"
    :input-date-transformer="transformDate"
  />
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const date = ref()

const transformDate = ({ value }) => {
  return value ? `📅 ${dayjs(value).format('dddd, MMMM Do YYYY')}` : ''
}
</script>
```

</template>
</ComponentDemo>

## Date Selection

### Standard Date Picker

<br />

<ComponentDemo>
  <MazDatePicker
    v-model="dateSelection"
    label="Select Date"
    color="primary"
    auto-close
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="date"
    label="Select Date"
    color="primary"
    auto-close
  />
</template>

<script setup>
import { ref } from 'vue'

const date = ref()
</script>
```

</template>
</ComponentDemo>

### Inline Date Picker

Perfect for dashboards or when you want the calendar always visible:

<ComponentDemo>
  <MazDatePicker
    v-model="inlineDate"
    inline
    color="secondary"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="date"
    inline
    color="secondary"
  />
</template>

<script setup>
import { ref } from 'vue'

const date = ref()
</script>
```

</template>
</ComponentDemo>

### Double Calendar

Show two months at once for better date selection:

<ComponentDemo>
  <MazDatePicker
    v-model="doubleDate"
    label="Double Calendar"
    double
    color="success"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="date"
    label="Double Calendar"
    double
    color="success"
  />
</template>

<script setup>
import { ref } from 'vue'

const date = ref()
</script>
```

  </template>
</ComponentDemo>

## Time Selection

### Date + Time (24h format)

<ComponentDemo>
  <MazDatePicker
    v-model="dateTime24"
    label="Date & Time (24h)"
    format="YYYY-MM-DD HH:mm"
    time
    color="info"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="dateTime"
    label="Date & Time (24h)"
    format="YYYY-MM-DD HH:mm"
    time
    color="info"
  />
</template>

<script setup>
import { ref } from 'vue'

const dateTime = ref()
</script>
```

</template>
</ComponentDemo>

### Date + Time (12h format)

<ComponentDemo>
  <MazDatePicker
    v-model="dateTime12"
    label="Date & Time (12h)"
    format="YYYY-MM-DD hh:mm a"
    time
    color="warning"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="dateTime"
    label="Date & Time (12h)"
    format="YYYY-MM-DD hh:mm a"
    time
    color="warning"
  />
</template>

<script setup>
import { ref } from 'vue'

const dateTime = ref()
</script>
```

</template>
</ComponentDemo>

### Time Only Selection

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-1 mob-l:maz-grid-cols-2 maz-gap-4">
    <MazDatePicker
      v-model="timeOnly24"
      label="Time Only (24h)"
      format="HH:mm"
      only-time
      color="accent"
    />
    <MazDatePicker
      v-model="timeOnly12"
      label="Time Only (12h)"
      format="hh:mm a"
      only-time
      color="destructive"
    />
  </div>

<template #code>

```vue
<template>
  <!-- 24h format -->
  <MazDatePicker
    v-model="time24"
    label="Time Only (24h)"
    format="HH:mm"
    only-time
    color="accent"
  />

  <!-- 12h format -->
  <MazDatePicker
    v-model="time12"
    label="Time Only (12h)"
    format="hh:mm a"
    only-time
    color="destructive"
  />
</template>

<script setup>
import { ref } from 'vue'

const time24 = ref('14:30')
const time12 = ref('02:30 pm')
</script>
```

</template>
</ComponentDemo>

### Custom Minute Intervals

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-1 mob-l:maz-grid-cols-3 maz-gap-4">
    <MazDatePicker
      v-model="timeInterval1"
      label="5min intervals"
      format="HH:mm"
      :minute-interval="5"
      only-time
    />
    <MazDatePicker
      v-model="timeInterval2"
      label="15min intervals"
      format="HH:mm"
      :minute-interval="15"
      only-time
    />
    <MazDatePicker
      v-model="timeInterval3"
      label="30min intervals"
      format="HH:mm"
      :minute-interval="30"
      only-time
    />
  </div>

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="time1"
    label="5min intervals"
    format="HH:mm"
    :minute-interval="5"
    only-time
  />

  <MazDatePicker
    v-model="time2"
    label="15min intervals"
    format="HH:mm"
    :minute-interval="15"
    only-time
  />

  <MazDatePicker
    v-model="time3"
    label="30min intervals"
    format="HH:mm"
    :minute-interval="30"
    only-time
  />
</template>

<script setup>
import { ref } from 'vue'

const time1 = ref()
const time2 = ref()
const time3 = ref()
</script>
```

  </template>
</ComponentDemo>

## Range Selection

For selecting date ranges, pass an object with `start` and `end` properties:

<ComponentDemo>
  <MazDatePicker
    v-model="dateRange"
    label="Select Date Range"
    range
    double
    auto-close
    color="primary"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="range"
    label="Select Date Range"
    range
    double
    auto-close
    color="primary"
  />
</template>

<script setup>
import { ref } from 'vue'

const range = ref({
  start: undefined,
  end: undefined
})
</script>
```

</template>
</ComponentDemo>

### Range with Shortcuts

Provide predefined shortcuts for common date ranges:

<ComponentDemo>
  <MazDatePicker
    v-model="rangeWithShortcuts"
    label="Range with Shortcuts"
    range
    double
    :shortcuts="customShortcuts"
    color="secondary"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="range"
    label="Range with Shortcuts"
    range
    double
    :shortcuts="shortcuts"
    color="secondary"
  />
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const range = ref({
  start: undefined,
  end: undefined
})

const shortcuts = [
  {
    label: 'Today',
    identifier: 'today',
    value: {
      start: dayjs().format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD')
    }
  },
  {
    label: 'Last 7 days',
    identifier: 'last7days',
    value: {
      start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD')
    }
  },
  {
    label: 'This month',
    identifier: 'thisMonth',
    value: {
      start: dayjs().startOf('month').format('YYYY-MM-DD'),
      end: dayjs().endOf('month').format('YYYY-MM-DD')
    }
  }
]
</script>
```

</template>
</ComponentDemo>

### Property `shortcuts`

#### Model

```ts
interface MazDatePickerShortcut {
  identifier: string // should be uniq
  label: string
  value: {
    start: string
    end: string
  }
}

type MazDatePickerShortcuts = MazDatePickerShortcut[]
```

#### Example

```ts
import type { MazDatePickerShortcut } from 'maz-ui/components'

const shortcuts: MazDatePickerShortcut[] = [{
  label: 'Next month',
  identifier: 'nextMonth',
  value: {
    start: dayjs().add(1, 'month').set('date', 1).format('YYYY-MM-DD'),
    end: dayjs()
      .add(1, 'month')
      .set('date', dayjs().add(1, 'month').daysInMonth())
      .format('YYYY-MM-DD'),
  },
}]
```

::: details View default shortcuts

```ts
const shortcuts = [
  {
    label: 'Last 7 days',
    identifier: 'last7Days',
    value: {
      start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD'),
    },
  },
  {
    label: 'Last 30 days',
    identifier: 'last30Days',
    value: {
      start: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD'),
    },
  },
  {
    label: 'This week',
    identifier: 'thisWeek',
    value: {
      start: dayjs().startOf('week').format('YYYY-MM-DD'),
      end: dayjs().endOf('week').format('YYYY-MM-DD'),
    },
  },
  {
    label: 'Last week',
    identifier: 'lastWeek',
    value: {
      start: dayjs()
        .subtract(1, 'week')
        .startOf('week')
        .format('YYYY-MM-DD'),
      end: dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
    },
  },
  {
    label: 'This month',
    identifier: 'thisMonth',
    value: {
      start: dayjs().set('date', 1).format('YYYY-MM-DD'),
      end: dayjs()
        .set('date', dayjs().daysInMonth())
        .format('YYYY-MM-DD'),
    },
  },
  {
    label: 'This year',
    identifier: 'thisYear',
    value: {
      start: dayjs().startOf('year').format('YYYY-MM-DD'),
      end: dayjs().endOf('year').format('YYYY-MM-DD'),
    },
  },
  {
    label: 'Last year',
    identifier: 'lastYear',
    value: {
      start: dayjs()
        .subtract(1, 'year')
        .startOf('year')
        .format('YYYY-MM-DD'),
      end: dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
    },
  },
]
```

:::

## Validation & Constraints

### Min/Max Dates

<br />

<ComponentDemo>
  <MazDatePicker
    v-model="constrainedDate"
    label="Limited Date Range"
    :min-date="minMaxDates.min"
    :max-date="minMaxDates.max"
    color="info"
    @update:model-value="console.log($event)"
  />
  <p class="maz-text-sm maz-text-muted maz-mt-2">
    Min: {{ minMaxDates.min }} | Max: {{ minMaxDates.max }}
  </p>

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="date"
    label="Limited Date Range"
    :min-date="minDate"
    :max-date="maxDate"
    color="info"
  />
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const date = ref()
const minDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
const maxDate = dayjs().add(30, 'day').format('YYYY-MM-DD')
</script>
```

</template>
</ComponentDemo>

#### Property `min-max-auto`

Disable min-max auto check to not change the value when it is out of range

<ComponentDemo>
  <MazDatePicker
    v-model="constrainedDateMinMaxAuto"
    label="Not auto date range"
    :min-date="minMaxDates.min"
    :max-date="minMaxDates.max"
    :min-max-auto="false"
  />

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="date"
    label="Not auto date range"
    :min-date="minDate"
    :max-date="maxDate"
    :min-max-auto="false"
  />
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const date = ref()
const minDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
const maxDate = dayjs().add(30, 'day').format('YYYY-MM-DD')
</script>
```

</template>
</ComponentDemo>

### Disabled Days & Dates

<br />

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-1 mob-l:maz-grid-cols-2 maz-gap-4">
    <MazDatePicker
      v-model="weekendDisabled"
      label="Weekends Disabled"
      :min-date="dayjs().subtract(1, 'day').format('YYYY-MM-DD')"
      :disabled-weekly="[0, 6]"
      color="warning"
    />
    <MazDatePicker
      v-model="specificDatesDisabled"
      label="Holidays Disabled"
      :disabled-dates="holidays"
      color="destructive"
    />
  </div>

<template #code>

```vue
<template>
  <!-- Disable weekends -->
  <MazDatePicker
    v-model="date1"
    label="Weekends Disabled"
    :disabled-weekly="[0, 6]"
    color="warning"
  />

  <!-- Disable specific dates -->
  <MazDatePicker
    v-model="date2"
    label="Holidays Disabled"
    :disabled-dates="holidays"
    color="destructive"
  />
</template>

<script setup>
import { ref } from 'vue'

const date1 = ref()
const date2 = ref()

// 0 = Sunday, 6 = Saturday
const weekends = [0, 6]

// Specific holiday dates
const holidays = [
  dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD'),
  dayjs().add(1, 'day').format('YYYY-MM-DD'),
  dayjs().add(2, 'day').format('YYYY-MM-DD'),
  dayjs().add(3, 'day').format('YYYY-MM-DD'),
  dayjs().add(4, 'day').format('YYYY-MM-DD'),
]
</script>
```

</template>
</ComponentDemo>

### Disabled Hours

<br />

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-1 mob-l:maz-grid-cols-2 maz-gap-4">
    <MazDatePicker
      v-model="dateTime"
      format="YYYY-MM-DD hh:mm a"
      time
      label="Disabled Hours"
      :disabled-hours="disabledHours"
      color="info"
    />
    <MazDatePicker
      v-model="time"
      format="HH:mm"
      only-time
      label="Disabled Hours"
      :disabled-hours="disabledHours"
      color="info"
    />
  </div>

<template #code>

```vue
<template>
  <MazDatePicker
    v-model="dateTime"
    format="YYYY-MM-DD hh:mm a"
    time
    label="Disabled Hours"
    :disabled-hours="disabledHours"
    color="info"
  />

  <MazDatePicker
    v-model="time"
    format="HH:mm"
    only-time
    label="Disabled Hours"
    :disabled-hours="disabledHours"
    color="info"
  />
</template>

<script setup>
import { ref } from 'vue'

const date = ref()
const time = ref()

const disabledHours = [0, 1, 2, 11, 22, 23]
</script>
```

</template>
</ComponentDemo>

## Internationalization

MazDatePicker supports full internationalization. **By default, it uses the locale from the [MazUiTranslations](../guide/translations.md) plugin**, but you can override it:

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-1 mob-l:maz-grid-cols-2 maz-gap-4">
    <MazDatePicker
      v-model="frenchDate"
      label="French Locale"
      locale="fr-FR"
      :first-day-of-week="1"
      color="primary"
    />
    <MazDatePicker
      v-model="germanDate"
      label="German Locale"
      locale="de-DE"
      :first-day-of-week="1"
      color="secondary"
    />
    <MazDatePicker
      v-model="japaneseDate"
      label="Japanese Locale"
      locale="ja-JP"
      color="accent"
    />
    <MazDatePicker
      v-model="arabicDate"
      label="Arabic Locale"
      locale="ar-SA"
      :first-day-of-week="6"
      color="warning"
    />
  </div>

<template #code>

```vue
<template>
  <!-- French -->
  <MazDatePicker
    v-model="frenchDate"
    label="French Locale"
    locale="fr-FR"
    :first-day-of-week="1"
    color="primary"
  />

  <!-- German -->
  <MazDatePicker
    v-model="germanDate"
    label="German Locale"
    locale="de-DE"
    :first-day-of-week="1"
    color="secondary"
  />

  <!-- Japanese -->
  <MazDatePicker
    v-model="japaneseDate"
    label="Japanese Locale"
    locale="ja-JP"
    color="accent"
  />

  <!-- Arabic -->
  <MazDatePicker
    v-model="arabicDate"
    label="Arabic Locale"
    locale="ar-SA"
    :first-day-of-week="6"
    color="warning"
  />
</template>

<script setup>
import { ref } from 'vue'

const frenchDate = ref()
const germanDate = ref()
const japaneseDate = ref()
const arabicDate = ref()
</script>
```

</template>
</ComponentDemo>

## Types

```typescript
// Value types
type MazDatePickerValue = string | undefined | MazDatePickerPartialRangeValue

interface MazDatePickerRangeValue {
  start: string
  end: string
}

type MazDatePickerPartialRangeValue = Partial<MazDatePickerRangeValue>

// Shortcut type
interface MazDatePickerShortcut {
  identifier: string
  label: string
  value: {
    start: string
    end: string
  }
}
```

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

<!--@include: ./../../.vitepress/generated-docs/maz-date-picker.doc.md-->

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

// Basic examples
const basicDate = ref('2023-03-15')
const formatExample1 = ref('2024-03-15')
const formatExample2 = ref('03/15/2024')
const formatExample3 = ref('15-03-2024')
const transformedDate = ref()
const newDateValue = ref()
// Date selection
const dateSelection = ref()
const inlineDate = ref()
const doubleDate = ref()

// Time selection
const dateTime24 = ref()
const dateTime12 = ref()
const timeOnly24 = ref('14:30')
const timeOnly12 = ref('02:30 pm')
const timeInterval1 = ref()
const timeInterval2 = ref()
const timeInterval3 = ref()

// Range selection
const dateRange = ref({ start: undefined, end: undefined })
const rangeWithShortcuts = ref({ start: undefined, end: undefined })

// Internationalization
const frenchDate = ref()
const germanDate = ref()
const japaneseDate = ref()
const arabicDate = ref()

// Validation
const constrainedDate = ref()
const constrainedDateMinMaxAuto = ref(dayjs().subtract(60, 'day').format('YYYY-MM-DD'))
const minMaxDates = {
  min: dayjs().format('YYYY-MM-DD'),
  max: dayjs().add(20, 'day').format('YYYY-MM-DD')
}
const weekendDisabled = ref()
const specificDatesDisabled = ref()
const holidays = [
  dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD'),
  dayjs().add(1, 'day').format('YYYY-MM-DD'),
  dayjs().add(2, 'day').format('YYYY-MM-DD'),
  dayjs().add(3, 'day').format('YYYY-MM-DD'),
  dayjs().add(4, 'day').format('YYYY-MM-DD'),
]

// Disabled hours
const dateTime = ref()
const time = ref()
const disabledHours = [0, 1, 2, 11, 22, 23]

// Shortcuts
const customShortcuts = [
  {
    label: 'Today',
    identifier: 'today',
    value: {
      start: dayjs().format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD')
    }
  },
  {
    label: 'Last 7 days',
    identifier: 'last7days',
    value: {
      start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD')
    }
  },
  {
    label: 'This month',
    identifier: 'thisMonth',
    value: {
      start: dayjs().startOf('month').format('YYYY-MM-DD'),
      end: dayjs().endOf('month').format('YYYY-MM-DD')
    }
  }
]
</script>
