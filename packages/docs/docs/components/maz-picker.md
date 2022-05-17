---
description: MazPicker is a stand-alone component for select dates and time. Provide range, date and time mode
---

# MazPicker

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

To use this component, you have to install the dependency `dayjs`

<NpmBadge package="dayjs" />

<CodeGroup>

  <CodeGroupItem title="NPM" active>

```bash
# install in your project
npm install dayjs
```
  </CodeGroupItem>

  <CodeGroupItem title="YARN">

```bash
# install in your project
yarn add dayjs
```
  </CodeGroupItem>
</CodeGroup>

## Documentation

- As input value, min-date, max-date or disabled-dates you must provide the same and a valid format of [Dayjs](https://day.js.org/docs/en/display/format)
  - **Simply date**: The better format is `YYYY-MM-DD` - *Example: "2022-03-02" (for range picker "{ start: '2022-03-02', end: '2022-03-28' }")*
  - **Date Time**: The better format is `YYYY-MM-DD HH:mm` or `YYYY-MM-DD h:mm a`  - *Example: "2022-03-02 16:30" or "2022-03-02 04:30 pm"*
  - **Only Time**: `HH:mm`, `h:mm a`, etc  - *Example: "16:30" or "4:30 pm"*

- The returned value is formatted by [days.format()](https://day.js.org/docs/en/display/format) function with the format provided

- This component use [MazInput](/maz-ui-3/components/maz-input.html), so it inherits his props:
  - Use `label` & `placeholder` props

## Options

- `time`: To enable the time picker

- `only-time`: To only enable the time picker

- `format`: Will be used to parse the input date (`v-model`) and format the date emitted on output.

- `locale`: You can provide a local (example: `fr-FR`, `en-US`, `de-DE`, etc), otherwise the component will get the user locale from the browser language. If no browser locale is available, the component will fetch the local from `https://ip2c.org/s` (network needed). And the last, if no browser is available from ip2c, the `en-US` locale is used.

- `first-day-of-week` (default: `0`): should be a `number` - Example: For France, you should set `:first-day-of-week="1"` to have monday at the first day of week in calendar.

- `inputDateStyle`: To customize the date time format into the input - Must be a value of [Intl.DateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) - Default option: `{ dateStyle: 'full' }`

- `shortcut`: With the shortcut property, you can specify a shortcut that's selected by default by passing it's identifier.

- `min-date` & `max-date`: Must have the same format as model-value - the component will validate automatically the dates - Exemple: [see example](#inline)

- `disabled-weekly` : Days of the week which are disabled every week, in Array format with day index, Sunday as 0 and Saturday as 6: `[0,4,6]`

- `disabled-dates` : Provide an array of date string, the days in date picker will be disabled. Time will be taken for the time picker Ex: `['2022-02-02', '2022-02-22']`

- `disabled-hours` : For time picker or date time picker, to globally disable hours, provide an Array format with hours value: `[0, 1,..., 22, 23]` (0 to 23)

- 12h format: to enable the Date Time Picker or Time Picker with the 12h format selection mode, you must add the property `format` with `hh:mm a` or `hh:mm a`, etc.

- `minute-interval` (default: `5`): Is the interval between minutes in the Time picker

- `double`: Date Picker can have 2 calendar in the same row - usefull in range mode.

- `inline`: [see example](#inline)

- `auto-close`: the picker will be automatically closed after the user has selected a value

## Multiple Pickers

### Date Picker

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateValue }}"</code></pre></div>

<MazPicker
  v-model="dateValue"
  label="Select date"
  color="secondary"
/>

```vue
<template>
  <MazPicker
    v-model="dateValue"
    label="Select date"
    color="secondary"
  />
</template>

<script setup lang="ts">
  import MazPicker from 'maz-ui/components/MazPicker'
  import { ref } from 'vue'
  const dateValue = ref('2022-02-03')
</script>
```

### Date Time Picker

#### 24 format

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateTimeValue }}"</code></pre></div>

<MazPicker
  v-model="dateTimeValue"
  format="YYYY-MM-DD HH:mm"
  label="Select date and time"
  color="secondary"
  time
/>

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
  import MazPicker from 'maz-ui/components/MazPicker'
  import { ref } from 'vue'
  const dateTimeValue = ref('2022-02-03 16:30')
</script>
```

#### 12 format

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateTime12Value }}"</code></pre></div>

<MazPicker
  v-model="dateTime12Value"
  format="YYYY-MM-DD hh:mm a"
  label="Select date and time"
  color="secondary"
  time
/>

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
  import MazPicker from 'maz-ui/components/MazPicker'
  import { ref } from 'vue'
  const dateTime12Value = ref('2022-02-03 04:30 pm')
</script>
```

### Time Picker

#### 24h format

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateTimeValue }}"</code></pre></div>

<MazPicker
  v-model="dateTimeValue"
  format="YYYY-MM-DD HH:mm"
  label="Select time"
  color="secondary"
  only-time
/>

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
  import MazPicker from 'maz-ui/components/MazPicker'
  import { ref } from 'vue'
  const dateTimeValue = ref('2022-02-03 16:30')
</script>
```

#### 12h format

<div class="language-html ext-html"><pre class="language-json"><code>v-model="{{ dateTime12Value }}"</code></pre></div>

<MazPicker
  v-model="dateTime12Value"
  format="YYYY-MM-DD HH:mm a"
  label="Select time"
  color="secondary"
  only-time
/>

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
  import MazPicker from 'maz-ui/components/MazPicker'
  import { ref } from 'vue'
  const dateTime12Value = ref('2022-02-03 04:30 pm')
</script>
```

### Range Picker

To enable the range mode, you should provide an object like this `{ start: undefined, end: undefined }` as initiale model-value

<div class="language-json ext-json"><pre class="language-json"><code>v-model="{{ rangeValues }}"</code></pre></div>

<MazPicker
  v-model="rangeValues"
  label="Select periode"
  color="secondary"
  :min-date="minMaxDates.min"
  :max-date="minMaxDates.max"
  double
/>

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
  import MazPicker from 'maz-ui/components/MazPicker'
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

### Inline

#### Inputs

rangeValues (v-model): {{ rangeValues }}

min-date: {{ minMaxDates.min }}

max-date: {{ minMaxDates.max }}

<MazPicker
  v-model="rangeValues"
  color="secondary"
  :min-date="minMaxDates.min"
  :max-date="minMaxDates.max"
  inline
  double
/>

```vue
<template>
  <MazPicker
    v-model="rangeValues"
    color="secondary"
    :min-date="minMaxDates.min"
    :max-date="minMaxDates.max"
    inline
    double
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const rangeValues = ref({ start: "2022-05-02", end: "2022-06-28" })

  const minMaxDates = ref({
    min: '2022-05-05',
    max: '2022-06-20',
  })
</script>
```

<script setup lang="ts">
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  const timeValue = ref('16:30')
  const dateValue = ref('2022-02-03')
  const dateTimeValue = ref('2022-02-03 16:30')
  const dateTime12Value = ref('2022-02-03 04:30 pm')

  const rangeValues = ref({ start: "2022-05-02", end: "2022-06-28" })

  const minMaxDates = ref({
    min: '2022-05-05',
    max: '2022-06-20',
  })
</script>

## Props & Events emitted

<ComponentPropDoc component="MazPicker" />