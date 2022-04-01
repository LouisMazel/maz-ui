---
description: MazRadioButtons is a stand-alone component to select a value in a list
head:
  - - meta
    - name: twitter:title
      content: MazRadioButtons | Maz-UI
    - name: twitter:description
      content: MazRadioButtons is a stand-alone component to select a value in a list
    - property: og:title
      content: MazRadioButtons | Maz-UI
    - property: og:description
      content: MazRadioButtons is a stand-alone component to select a value in a list
---

# MazRadioButtons

MazRadioButtons is a stand-alone component to select a value in a list

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

## Basic usage

Select a competition

<MazRadioButtons
  v-model="competitionSelected"
  :options="competitions"
/>

```vue
<template>
  <MazRadioButtons
    v-model="competitionSelected"
    :options="competitions"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  import MazRadioButtons from 'maz-ui/components/MazRadioButtons'

  const competitionSelected = ref<string>()

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
    v-model="competitionSelected"
    :options="competitions"
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

## Orientation - Column

Select a competition

<div>
  <MazRadioButtons
    v-model="competitionSelected"
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

```vue
<template>
  <MazRadioButtons
    v-model="competitionSelected"
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

  const competitionSelected = ref<string>()

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


<script lang="ts" setup>
  import { ref } from 'vue'

  const competitionSelected = ref<string>()

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

## Props & Events emitted

<ComponentPropDoc component="MazRadioButtons" />