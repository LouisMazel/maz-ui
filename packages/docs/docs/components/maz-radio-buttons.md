---
title: MazRadioButtons
description: MazRadioButtons is a standalone component to select a value in a list. Made with native HTMLInputElement type radio
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

Select a competition

<MazRadioButtons
  v-model="selectedCompetition"
  :options="competitions"
/>

```vue
<template>
  <MazRadioButtons
    v-model="selectedCompetition"
    :options="competitions"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  import MazRadioButtons from 'maz-ui/components/MazRadioButtons'

  const selectedCompetition = ref<string>()

   const competitions = [
    {
      value: "1",
      label: "Ligue 1",
      areaName: "France",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    },
    {
      value: "2",
      label: "Premier League",
      areaName: "England",
      areaEnsignUrl: "https://crests.football-data.org/770.svg",
    },
    {
      value: "3",
      label: "Bundesliga",
      areaName: "Germany",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    },
    {
      value: "4",
      label: "Eredivisie",
      areaName: "Netherlands",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg",
    },
    {
      value: "5",
      label: "Serie A",
      areaName: "Italy",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg",
    },
    {
      value: "6",
      label: "Primera Division",
      areaName: "Spain",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
    },
    {
      value: "7",
      label: "Primeira Liga",
      areaName: "Portugal",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg",
    },
    {
      value: "8",
      label: "UEFA Champions League",
      areaName: "Europe",
      areaEnsignUrl: "https://crests.football-data.org/EUR.svg",
    }
  ]
</script>
```

## Custom slot template

Select a competition

<div>
  <MazRadioButtons
    v-model="selectedCompetition"
    :options="competitions"
    color="secondary"
  >
    <template #default="{ option, selected }">
      <div style="display: flex;">
        <MazAvatar
          v-if="option.areaEnsignUrl"
          :src="option.areaEnsignUrl"
          style="margin-right: 16px;"
          size="0.8rem"
        />
        <div style="display: flex; flex-direction: column;">
          <span>
            {{ option.label }}
          </span>
          <span :class="{ 'maz-text-muted': !selected }">
            {{ option.areaName }}
          </span>
        </div>
      </div>
    </template>
  </MazRadioButtons>
</div>

```html
<MazRadioButtons
  v-model="selectedCompetition"
  :options="competitions"
  color="secondary"
>
  <template #default="{ option, selected }">
    <div style="display: flex;">
      <MazAvatar
        v-if="option.areaEnsignUrl"
        :src="option.areaEnsignUrl"
        style="margin-right: 16px;"
        size="0.8rem"
      />
      <div style="display: flex; flex-direction: column;">
        <span>
          {{ option.label }}
        </span>
        <span :class="{ 'maz-text-muted': !selected }">
          {{ option.areaName }}
        </span>
      </div>
    </div>
  </template>
</MazRadioButtons>
```

## Orientation - Column

Select a competition

<div>
  <MazRadioButtons
    v-model="selectedCompetition"
    :options="competitions"
    orientation="col"
  >
    <template #default="{ option, selected }">
      <div style="display: flex;">
        <MazAvatar
          v-if="option.areaEnsignUrl"
          :src="option.areaEnsignUrl"
          style="margin-right: 16px;"
          size="0.8rem"
        />
        <div style="display: flex; flex-direction: column;">
          <span>
            {{ option.label }}
          </span>
          <span :class="{ 'maz-text-muted': !selected }">
            {{ option.areaName }}
          </span>
        </div>
      </div>
    </template>
  </MazRadioButtons>
</div>

::: details Show code

```vue
<template>
  <MazRadioButtons
    v-model="selectedCompetition"
    :options="competitions"
    orientation="col | row"
  >
    <template #default="{ option, selected }">
      <div style="display: flex;">
        <MazAvatar
          v-if="option.areaEnsignUrl"
          :src="option.areaEnsignUrl"
          style="margin-right: 16px;"
          size="0.8rem"
        />
        <div style="display: flex; flex-direction: column;">
          <span>
            {{ option.label }}
          </span>
          <span :class="{ 'maz-text-muted': !selected }">
            {{ option.areaName }}
          </span>
        </div>
      </div>
    </template>
  </MazRadioButtons>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  import MazRadioButtons from 'maz-ui/components/MazRadioButtons'
  import MazAvatar from 'maz-ui/components/MazAvatar'

  const selectedCompetition = ref<string>()

  const competitions = [
    {
      value: "1",
      label: "Ligue 1",
      areaName: "France",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    },
    {
      value: "2",
      label: "Premier League",
      areaName: "England",
      areaEnsignUrl: "https://crests.football-data.org/770.svg",
    },
    {
      value: "3",
      label: "Bundesliga",
      areaName: "Germany",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    },
    {
      value: "4",
      label: "Eredivisie",
      areaName: "Netherlands",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg",
    },
    {
      value: "5",
      label: "Serie A",
      areaName: "Italy",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg",
    },
    {
      value: "6",
      label: "Primera Division",
      areaName: "Spain",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
    },
    {
      value: "7",
      label: "Primeira Liga",
      areaName: "Portugal",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg",
    },
    {
      value: "8",
      label: "UEFA Champions League",
      areaName: "Europe",
      areaEnsignUrl: "https://crests.football-data.org/EUR.svg",
    }
  ]
</script>
```

:::

<script lang="ts" setup>
  import { ref } from 'vue'

  const selectedCompetition = ref<string>()

  const competitions = [
    {
      value: "1",
      label: "Ligue 1",
      areaName: "France",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    },
    {
      value: "2",
      label: "Premier League",
      areaName: "England",
      areaEnsignUrl: "https://crests.football-data.org/770.svg",
    },
    {
      value: "3",
      label: "Bundesliga",
      areaName: "Germany",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    },
    {
      value: "4",
      label: "Eredivisie",
      areaName: "Netherlands",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg",
    },
    {
      value: "5",
      label: "Serie A",
      areaName: "Italy",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg",
    },
    {
      value: "6",
      label: "Primera Division",
      areaName: "Spain",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
    },
    {
      value: "7",
      label: "Primeira Liga",
      areaName: "Portugal",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg",
    },
    {
      value: "8",
      label: "UEFA Champions League",
      areaName: "Europe",
      areaEnsignUrl: "https://crests.football-data.org/EUR.svg",
    }
  ]
</script>

<!--@include: ./../.vitepress/generated-docs/maz-radio-buttons.doc.md-->
