---
title: MazCardSpotlight
description: MazCardSpotlight is a standalone component
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

**This component is better in dark mode**

<MazBtn @click="setColorMode('dark')" color="warning">
Switch to dark theme
</MazBtn>

::: tip
If you want to increase the border width, you must just add padding @default: `var(--maz-border-width)` (1px)
:::

## Basic usage

<ComponentDemo>
  <MazCardSpotlight style="width: 500px; max-width: 100%;">
    <h3 style="margin-top: 0; margin-bottom: 30px;">
      Hover this component <br />
      To see the magic appear
    </h3>
    <div class="maz-flex maz-gap-2">
      <MazBtn color="contrast" @click="setColorMode('light')">
        Switch to light mode
      </MazBtn>
      <MazBtn color="contrast" @click="setColorMode('dark')">
        Switch to dark mode
      </MazBtn>
    </div>
  </MazCardSpotlight>

<template #code>

```vue
<script lang="ts" setup>
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import MazCardSpotlight from 'maz-ui/components/MazCardSpotlight'

const { setColorMode } = useTheme()
</script>

<template>
  <MazCardSpotlight style="width: 500px; max-width: 100%;">
    <h3 style="margin-top: 0; Fmargin-bottom: 30px;">
      Hover this component <br>
      To see the magic appear
    </h3>
    <MazBtn color="contrast" @click="setColorMode('light')">
      Switch to light theme
    </MazBtn>
  </MazCardSpotlight>
</template>
```

  </template>
</ComponentDemo>

## Effect with multiple cards and with secondary color

<ComponentDemo>
  <div class="maz-grid maz-gap-4 maz-grid-cols-1 mob-l:maz-grid-cols-2 tab-l:maz-grid-cols-3">
    <MazCardSpotlight v-for="competition of competitions" :key="competition.label" color="secondary">
      <div style="display: flex;">
        <MazAvatar
          v-if="competition.areaEnsignUrl"
          :src="competition.areaEnsignUrl"
          style="margin-right: 16px;"
          size="0.8rem"
        />
        <div style="display: flex; flex-direction: column;" class="maz-truncate">
          <span class="maz-truncate">
            {{ competition.label }}
          </span>
          <span class="maz-truncate">
            {{ competition.area }}
          </span>
        </div>
      </div>
    </MazCardSpotlight>
  </div>

<template #code>

```html
<div class="grid gap-4 grid-cols-1 mob-l:grid-cols-2 tab-l:grid-cols-3">
  <MazCardSpotlight v-for="competition of competitions" :key="competition.label" color="secondary">
    <div class="flex p-4">
      <MazAvatar
        v-if="competition.areaEnsignUrl"
        :src="competition.areaEnsignUrl"
        style="margin-right: 16px"
        size="0.8rem"
      />
      <div class="truncate flex column">
        <span class="truncate"> {{ competition.label }} </span>
        <span class="truncate"> {{ competition.area }} </span>
      </div>
    </div>
  </MazCardSpotlight>
</div>
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-card-spotlight.doc.md-->

<script lang="ts" setup>
  import { useTheme } from '@maz-ui/themes/composables/useTheme'

  const { setColorMode } = useTheme()

  const competitions = [
    {
      label: "Ligue 1",
      area: "France",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    },
    {
      label: "Premier League",
      area: "England",
      areaEnsignUrl: "https://crests.football-data.org/770.svg",
    },
    {
      label: "Bundesliga",
      area: "Germany",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    },
    {
      label: "Eredivisie",
      area: "Netherlands",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg",
    },
    {
      label: "Serie A",
      area: "Italy",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg",
    },
    {
      label: "Primera Division",
      area: "Spain",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
    },
    {
      label: "Primeira Liga",
      area: "Portugal",
      areaEnsignUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg",
    },
    {
      label: "UEFA Champions League",
      area: "Europe",
      areaEnsignUrl: "https://crests.football-data.org/EUR.svg",
    }
  ]
</script>
