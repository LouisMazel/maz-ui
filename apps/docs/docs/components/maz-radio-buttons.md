---
title: MazRadioButtons
description: MazRadioButtons is a standalone component to select a value in a list. Made with native HTMLInputElement type radio
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <p class="maz-mb-4">
    Select a competition
  </p>

  <MazRadioButtons
    v-model="selectedCompetition"
    :options="competitions"
  />

  <template #code>

  ```vue
  <template>
    <MazRadioButtons
      v-model="selectedCompetition"
      :options="competitions"
    />
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'

    import { MazRadioButtons } from 'maz-ui/components'

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

  </template>
</ComponentDemo>

## Custom slot template

<ComponentDemo>
  <p class="maz-mb-4">
    Select a competition
  </p>

  <MazRadioButtons
    v-model="selectedCompetition"
    :options="competitions"
    color="secondary"
    v-slot="{ option, selected }"
  >
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
  </MazRadioButtons>

  <template #code>

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

  </template>

</ComponentDemo>

## Orientation - Column

<ComponentDemo>
  <p class="maz-mb-4">
    Select a competition
  </p>

  <MazRadioButtons
    v-model="selectedCompetition"
    :options="competitions"
    orientation="col"
    v-slot="{ option, selected }"
  >
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
  </MazRadioButtons>

  <template #code>

  ```vue
  <template>
    <MazRadioButtons
      v-model="selectedCompetition"
      :options="competitions"
      orientation="col | row"
      v-slot="{ option, selected }"
    >
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
    </MazRadioButtons>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'

    import { MazRadioButtons, MazAvatar } from 'maz-ui/components'

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

  </template>

</ComponentDemo>

## Selector icon with options equal-size

This option will display a select icon on the left of the label

<ComponentDemo>
  <MazRadioButtons
    v-slot="{ option, selected }"
    v-model="selectedMode"
    :options="modeOptions"
    selector
    equal-size
    block
    class="vp-raw"
  >
    <div class="maz-flex maz-flex-col maz-items-start maz-p-2">
      <h3 class="maz-mb-2 maz-text-xl maz-font-semibold">
        {{ option.label }}
      </h3>
      <span :class="{ 'maz-text-muted': !selected }">
        {{ option.description }}
      </span>
    </div>
  </MazRadioButtons>

  <template #code>

  ```vue
  <template>
    <MazRadioButtons
      v-slot="{ option, selected }"
      v-model="selectedMode"
      :options="modeOptions"
      selector
      equal-size
      block
    >
      <div class="flex flex-col items-start p-2">
        <h3 class="mb-2 text-xl font-semibold">
          {{ option.label }}
        </h3>
        <span :class="{ 'text-muted': !selected }">
          {{ option.description }}
        </span>
      </div>
    </MazRadioButtons>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'
    import { type MazRadioButtonsOption } from 'maz-ui/components/MazRadioButtons'

    const selectedMode = ref('scores')

    const modeOptions: MazRadioButtonsOption[] = [
      {
        label: 'Scores',
        value: 'scores',
        description:
          'Predict the score of matches. If you find the outcome of the match you win 5 points, if you get the perfect score you double your score!',
        style: 'min-width: 250px;'
      },
      {
        label: 'Cotes',
        value: 'odds',
        description:
          'Predict with match odds. If you find the correct winner of the match you earn the points associated with the rating, if you have the perfect score you double your score.',
        style: 'min-width: 250px;'
      },
    ]
  </script>
  ```

  </template>
</ComponentDemo>

## Types

### options

The options prop is an array of `ButtonsRadioOption` type

```ts
export type ButtonsRadioOption = {
  /** The label of the option */
  label: string
  /** The value of the option */
  value: string | number | boolean
  /** The classes to apply to the option */
  classes?: any
  /** The style to apply to the option */
  style?: StyleValue
} & Record<string, unknown>
```

<!--@include: ./../.vitepress/generated-docs/maz-radio-buttons.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazRadioButtons from 'maz-ui/src/components/MazRadioButtons.vue'

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

  const selectedMode = ref('scores')

  const modeOptions = [
    {
      label: 'Scores',
      value: 'scores',
      description:
        'Predict the score of matches. If you find the outcome of the match you win 5 points, if you get the perfect score you double your score!',
      style: 'min-width: 250px;'
    },
    {
      label: 'Cotes',
      value: 'odds',
      description:
        'Predict with match odds. If you find the correct winner of the match you earn the points associated with the rating, if you have the perfect score you double your score.',
      style: 'min-width: 250px;'
    },
  ]
</script>
