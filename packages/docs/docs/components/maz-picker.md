---
title: MazPicker
description: MazPicker is a standalone component for select dates and time. Provides range, date and time mode
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

To use this component, you have to install the `dayjs` dependency

<NpmBadge package="dayjs" />

```bash
npm install dayjs
```

## Basic Usage

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ newDateValue }}"</code></pre></div>

<ComponentDemo>
  <MazPicker
    v-model="newDateValue"
    id="date-picker"
    label="Select date"
    :input-date-transformer="({ value }) => dayjs(value).format('YYYY/MM/DD')"
  />

  <template #code>

```html
<MazPicker
  v-model="newDateValue"
  label="Select date"
/>
```

  </template>
</ComponentDemo>

## Documentation

- As for the input value, min-date, max-date or disabled-dates you must provide the same and a valid format of [Dayjs](https://day.js.org/docs/en/display/format)
  - **Simply date**: The better format is `YYYY-MM-DD` - *Example: "2022-03-02" (for range picker "{ start: '2022-03-02', end: '2022-03-28' }")*
  - **Date Time**: The better format is `YYYY-MM-DD HH:mm` or `YYYY-MM-DD h:mm a`  - *Example: "2022-03-02 16:30" or "2022-03-02 04:30 pm"*
  - **Only Time**: `HH:mm`, `h:mm a`, etc  - *Example: "16:30" or "4:30 pm"*

- The returned value is formatted by [days.format()](https://day.js.org/docs/en/display/format) function with the format provided

- This component uses [MazInput](./maz-input.md#props-events-emitted), so it inherits its props:
  - Use `label` & `placeholder` props

## Options

- `time`: To enable the time picker

- `only-time`: To only enable the time picker

- `format`: Will be used to parse the input date (`v-model`) and format the date emitted on output.

- `locale`: You can provide a local (example: `fr-FR`, `en-US`, `de-DE`, etc), otherwise the component will get the user locale from the browser language. If no browser locale is available, the component will fetch the local from `https://ip2c.org/s` (network needed). And lastly, if no browser is available from ip2c, the `en-US` locale is used.

- `first-day-of-week` (default: `0`): should be a `number` - Example: For France, you should set `:first-day-of-week="1"` to have monday at the first day of week in calendar.

- `inputDateStyle`: To customize the date time format into the input - Must be a value of [Intl.DateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) - Default option: `{ dateStyle: 'full' }`

- `inputDateTransformer`: `(payload: { formattedDate?: string; value?: PickerValue; locale: string }) => string` - To transform the value displayed into the input - Must return a string

- `shortcut`: With the shortcut property, you can specify a shortcut that's selected by default by passing its identifier.

- `min-date` & `max-date`: Must have the same format as model-value - the component will validate the dates automatically - Exemple: [see example](#inline-with-custom-shortcuts)

- `disabled-weekly` : Days of the week which are disabled every week, in Array format with day index, Sunday as 0 and Saturday as 6: `[0,4,6]`

- `disabled-dates` : Provides an array of date string, the days in date picker will be disabled. Time will be taken for the time picker Ex: `['2022-02-02', '2022-02-22']`

- `disabled-hours` : For time picker or date time picker, to globally disable hours, provide an Array format with hours value: `[0, 1,..., 22, 23]` (0 to 23)

- 12h format: To enable the Date Time Picker or Time Picker with the 12h format selection mode, you must add the property `format` with `hh:mm a` or `hh:mm a`, etc.

- `minute-interval` (default: `5`): Is the interval between minutes in the Time picker

- `double`: Date Picker can have 2 calendar in the same row - useful in range mode.

- `inline`: [see example](#inline-with-custom-shortcuts)

- `auto-close`: The picker will be automatically closed after the user has selected a value

## Date Picker

  <div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateValue }}"</code></pre></div>

<ComponentDemo>
  <MazPicker
    v-model="dateValue"
    label="Select date"
    id="date-picker-1"
    color="secondary"
  />

  <template #code>

```vue
<template>
  <MazPicker
    v-model="dateValue"
    label="Select date"
    color="secondary"
  />
</template>

<script setup lang="ts">
  import { MazPicker } from 'maz-ui/components'
  import { ref } from 'vue'
  const dateValue = ref('2022-02-03')
</script>
```

  </template>
</ComponentDemo>

## Date Time Picker

### 24 format

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateTimeValue }}"</code></pre></div>

<ComponentDemo>
<MazPicker
  v-model="dateTimeValue"
  format="YYYY-MM-DD HH:mm"
  label="Select date and time"
  color="secondary"
  id="date-time-picker-1"
  time
/>

  <template #code>

```vue
<template>
  <MazPicker
    v-model="dateTimeValue"
    format="YYYY-MM-DD HH:mm"
    label="Select date and time"
    color="secondary"
    time
  />
</template>

<script setup lang="ts">
  import { MazPicker } from 'maz-ui/components'
  import { ref } from 'vue'
  const dateTimeValue = ref('2022-02-03 16:30')
</script>
```

  </template>
</ComponentDemo>

### 12 format

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateTime12Value }}"</code></pre></div>

<ComponentDemo>
  <MazPicker
    v-model="dateTime12Value"
    format="YYYY-MM-DD hh:mm a"
    label="Select date and time"
    id="date-time-picker-2"
    color="secondary"
    time
  />

  <template #code>

```vue
<template>
  <MazPicker
    v-model="dateTime12Value"
    format="YYYY-MM-DD hh:mm a"
    label="Select date and time"
    color="secondary"
    time
  />
</template>

<script setup lang="ts">
  import { MazPicker } from 'maz-ui/components'
  import { ref } from 'vue'
  const dateTime12Value = ref('2022-02-03 04:30 pm')
</script>
```

  </template>
</ComponentDemo>

## Time Picker

### 24h format

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateTimeValue }}"</code></pre></div>

<ComponentDemo>
  <MazPicker
    v-model="dateTimeValue"
    format="YYYY-MM-DD HH:mm"
    label="Select time"
    id="time-picker-1"
    color="secondary"
    only-time
  />

  <template #code>

```vue
<template>
  <MazPicker
    v-model="dateTimeValue"
    format="YYYY-MM-DD HH:mm"
    label="Select time"
    color="secondary"
    only-time
  />
</template>

<script setup lang="ts">
  import { MazPicker } from 'maz-ui/components'
  import { ref } from 'vue'
  const dateTimeValue = ref('2022-02-03 16:30')
</script>
```

  </template>
</ComponentDemo>

### 12h format

<code>v-model="{{ dateTime12Value }}"</code>

<ComponentDemo>
  <MazPicker
    v-model="dateTime12Value"
    format="YYYY-MM-DD HH:mm a"
    label="Select time"
    id="time-picker-2"
    color="secondary"
    only-time
  />

  <template #code>

  ```vue
  <template>
    <MazPicker
      v-model="dateTime12Value"
      format="YYYY-MM-DD HH:mm a"
      label="Select time"
      color="secondary"
      only-time
    />
  </template>

  <script setup lang="ts">
    import { MazPicker } from 'maz-ui/components'
    import { ref } from 'vue'
    const dateTime12Value = ref('2022-02-03 04:30 pm')
  </script>
  ```

  </template>
</ComponentDemo>

## Range Picker

To enable the range mode, you should provide an object like this `{ start: undefined, end: undefined }` as initiale model-value

<div class="language-json ext-json"><pre class="language-json"><code>v-model="{{ rangeValues }}"</code></pre></div>

<ComponentDemo>
  <MazPicker
    v-model="rangeValues"
    label="Select periode"
    color="secondary"
    id="range-picker-1"
    :min-date="minMaxDates.min"
    :max-date="minMaxDates.max"
    double
    auto-close
  />

  <template #code>

```vue
<template>
  <MazPicker
    v-model="rangeValues"
    label="Select periode"
    color="secondary"
    :min-date="minMaxDates.min"
    :max-date="minMaxDates.max"
    double
  />
</template>

<script setup lang="ts">
  import { MazPicker } from 'maz-ui/components'
  import { ref } from 'vue'

  const rangeValues = ref({
    start: '2022-02-03',
    end: '2022-02-28',
  })

  const minMaxDates = ref({
    min: '2022-05-05',
    max: '2022-06-20',
  })
</script>
```

  </template>
</ComponentDemo>

## Inline with custom shortcuts

**Inputs**

<code>rangeValues (v-model): {{ rangeValues }}</code>

<code>min-date: {{ minMaxDates.min }}</code>

<code>max-date: {{ minMaxDates.max }}</code>

<ComponentDemo>
  <MazPicker
    v-model="rangeValues"
    color="secondary"
    :min-date="minMaxDates.min"
    id="range-picker-2"
    :max-date="minMaxDates.max"
    :shortcuts="shortcuts"
    inline
    double
  />

  <template #code>

```vue
<template>
  <MazPicker
    v-model="rangeValues"
    color="secondary"
    :min-date="minMaxDates.min"
    :max-date="minMaxDates.max"
    :shortcuts="shortcuts"
    inline
    double
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { MazPicker, type MazPickerShortcut } from 'maz-ui/components'

  const startDate = dayjs().subtract(1, 'month').set('date', 5)
  const endDate = dayjs().add(1, 'month').set('date', 25)

  const rangeValues = ref({ start: startDate.format('YYYY-MM-DD'), end: endDate.format('YYYY-MM-DD') })

  const minMaxDates = ref({
    min: startDate.subtract(2, 'days').format('YYYY-MM-DD'),
    max: endDate.add(2, 'days').format('YYYY-MM-DD'),
  })

  const shortcuts: MazPickerShortcut[] = [
    {
      label: 'Next month',
      identifier: 'nextMonth',
      value: {
        start: dayjs().add(1, 'month').set('date', 1).format('YYYY-MM-DD'),
        end: dayjs()
          .add(1, 'month')
          .set('date', dayjs().add(1, 'month').daysInMonth())
          .format('YYYY-MM-DD'),
      },
    }, {
      label: 'Last 3 days',
      identifier: 'last3Days',
      value: {
        start: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
  ]
</script>
```

  </template>
</ComponentDemo>

## Using input-date-transformer

You can use the `input-date-transformer` prop to transform the value displayed into the input.

<ComponentDemo>
  <MazPicker
    v-model="newDateValue"
    id="date-picker"
    label="Select date"
    :input-date-transformer="({ value }) => dayjs(value).format('YYYY/MM/DD')"
  />

  <template #code>

```html
<MazPicker
  v-model="newDateValue"
  label="Select date"
  :input-date-transformer="({ value }) => dayjs(value).format('YYYY/MM/DD')"
/>
```

  </template>

</ComponentDemo>

### Property `shortcuts`

<br />

#### Model

```ts
interface MazPickerShortcut {
  identifier: string // should be uniq
  label: string
  value: {
    start: string
    end: string
  }
}

type MazPickerShortcuts = MazPickerShortcut[]
```

#### Example

```ts
import { type MazPickerShortcut } from 'maz-ui/components'

const shortcuts: MazPickerShortcut[] = [{
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

## Types

### PickerValue

```ts
type PickerValue = string | undefined | { start: string; end: string }
```

### Position

```ts
export type Position =
  | 'top'
  | 'top right'
  | 'top left'
  | 'bottom'
  | 'bottom right'
  | 'bottom left'
  | 'left'
  | 'right'
```

<!--@include: ./../.vitepress/generated-docs/maz-picker.doc.md-->


<script setup lang="ts">
  import { ref } from 'vue'
  import dayjs from 'dayjs'

  const timeValue = ref('16:30')
  const newDateValue = ref()
  const dateValue = ref('2022-02-03')
  const dateTimeValue = ref('2022-02-03 16:30')
  const dateTime12Value = ref('2022-02-03 04:30 pm')

  const startDate = dayjs().set('date', 5)
  const endDate = dayjs().add(1, 'month').set('date', 22)

  const rangeValues = ref({ start: startDate.format('YYYY-MM-DD'), end: endDate.format('YYYY-MM-DD') })

  const minMaxDates = ref({
    min: startDate.subtract(2, 'days').format('YYYY-MM-DD'),
    max: endDate.add(2, 'days').format('YYYY-MM-DD'),
  })

  const shortcuts: MazPickerShortcut[] = [
    {
      label: 'Next month',
      identifier: 'nextMonth',
      value: {
        start: dayjs().add(1, 'month').set('date', 1).format('YYYY-MM-DD'),
        end: dayjs()
          .add(1, 'month')
          .set('date', dayjs().add(1, 'month').daysInMonth())
          .format('YYYY-MM-DD'),
      },
    }, {
      label: 'Last 3 days',
      identifier: 'last3Days',
      value: {
        start: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
  ]
</script>