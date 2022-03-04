---
description: MazPicker is a stand-alone component for select dates and time. Provide range, date and time mode
---

# MazPicker

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

This component is based on native browser native API [Date Constructor](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date), so no dependency needed

## Documentation

- You should provide a valid format of [Date Constructor](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date) - **This value is not required**
  - **Simply date**: The better format is `YYYY-MM-DD` - *Example: "2022-03-02" (for range picker "{ start: '2022-03-02', end: '2022-03-28' }")*
  - **Date Time**: The better format is `YYYY-MM-DD (HH:mm | h:mm a)`  - *Example: "2022-03-02 16:30" or "2022-03-02 04:30 pm"*
  - **Only Time**: `HH:mm`, `HH:mm a`, `h:mm a`, etc  - *Example: "16:30" or "4:30 pm"*

- This component use [MazInput](/maz-ui-3/components/maz-input.html), so it inherits his props:
  - Use `label` & `placeholder` props

- The model value is formatted by [toISOString()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) function of Date Constructor (better format for saving in database)

## Options

- `locale`: You can provide a local (example: `fr-FR`, `en-US`, `de-DE`, etc), otherwise the component will get the user locale from the browser language. If no browser locale is available, the component will fetch the local from `https://ip2c.org/s` (network needed). And the last, if no browser is available from ip2c, the `en-US` locale is used.

- `first-day-of-week` (default: `0`): should be a `number` - Example: For France, you should set `:first-day-of-week="1"` to have monday at the first day of week in calendar.

- `inputDateStyle`: To customize the date format into the input - Must be a value of [Intl.DateTimeFormatOptions['dateStyle']](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) - Availables options : `full | long | medium | short`

- `inputTimeStyle`: Like `inputDateStyle` - Must be a value of [Intl.DateTimeFormatOptions['TimeStyle']](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) - Available options : `full | long | medium | short`

- `shortcut`: With the shortcut property, you can specify a shortcut that's selected by default by passing it's identifier.

- `min-date` & `max-date`: Must have the same format as model-value - the component validate automatically the dates - Exemple: [see example](#inline)

- `disabled-weekly` : Days of the week which are disabled every week, in Array format with day index, Sunday as 0 and Saturday as 6: [0,4,6]

- `disabled-dates` : Provide an array of date string, the days in date picker will be disabled. Ex: `['2022-02-02', '2022-02-22']`

- `disabled-hours` : For time picker or date time picker, to globally disable hours, provide an Array format with hours value: `[0, 1,..., 22, 23]` (0 to 23)

- 12h format: to enable the Date Time Picker or Time Picker with the 12h format selection mode, you must add the property `hour12`

- `minute-interval` (default: `5`): Is the interval between minutes in the Time picker

- `double`: Date Picker can have 2 calendar in the same row - usefull in range mode.

- `inline`: [see example](#inline)

- `auto-close`: the picker will be automatically closed after the user select

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

To enable the Date Time mode, you should add the `time` property

<div class="language-json ext-json"><pre class="language-json"><code>v-model="{{ dateTimeValue }}"</code></pre></div>

<MazPicker
  v-model="dateTimeValue"
  label="Select date"
  color="secondary"
  time
/>

#### 12h format - `hour12`

<MazPicker
  v-model="dateTimeValue"
  label="Select date"
  color="secondary"
  time
  hour12
/>

```vue
<template>
  <MazPicker
    v-model="dateTimeValue"
    label="Select date time"
    color="info"
  />

  <MazPicker
    v-model="dateTimeValue"
    label="Select date time"
    color="info"
    hour12
  />
</template>

<script setup lang="ts">
  import MazPicker from 'maz-ui/components/MazPicker'
  import { ref } from 'vue'
  const dateTimeValue = ref('2022-02-03 16:30')
</script>
```

### Range Picker

To enable the range mode, you should provide an object like this `{ start: undefined, end: undefined }` as initiale model-value

<div class="language-json ext-json"><pre class="language-json"><code>v-model="{{ rangeValues }}"</code></pre></div>

<MazPicker
  v-model="rangeValues"
  label="Select periode"
  color="secondary"
  double
/>

```vue
<template>
  <MazPicker
    v-model="rangeValues"
    label="Select periode"
    color="secondary"
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
</script>
```

### Time Picker

To enable the Time mode, you should add the `only-time` property

So, you must only provide a time value or undefined

<div class="language-json ext-json"><pre class="language-json"><code>v-model="{{ timeValue }}"</code></pre></div>

<MazPicker
  v-model="timeValue"
  label="Select time"
  color="secondary"
  only-time
/>

```vue
<template>
  <MazPicker
    v-model="timeValue"
    label="Select time"
    color="secondary"
    only-time
  />
</template>

<script setup lang="ts">
  import MazPicker from 'maz-ui/components/MazPicker'
  import { ref } from 'vue'

  const timeValue = ref('16:30')
</script>
```

### Inline

<MazPicker
  v-model="rangeValues"
  color="secondary"
  inline
  double
  min-date="2022-02-05"
  max-date="2022-03-20"
/>

```vue
<template>
  <MazPicker
    v-model="rangeValues"
    color="secondary"
    inline
    double
    min-date="2022-02-05"
    max-date="2022-03-20"
  />
</template>
```

<script setup lang="ts">
  import { ref } from 'vue'
  const timeValue = ref('16:30')
  const dateValue = ref('2022-02-03')
  const dateTimeValue = ref('2022-02-03 16:30')
  const rangeValues = ref({
    start: '2022-02-03',
    end: '2022-02-28',
  })
</script>

## Props & Events emitted

<ComponentPropDoc component="MazPicker" />