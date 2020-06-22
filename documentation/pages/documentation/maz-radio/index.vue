<template>
  <div class="maz-radio-doc">
    <h3>
      Examples
    </h3>

    <ComponentContainer>
      <MazRadio
        v-for="color in colors"
        :key="color"
        v-model="radioValue"
        :color="color"
        :radio-value="color"
        class="maz-mb-2"
      >
        Radio - color="{{ color }}"
      </MazRadio>

      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <strong>Value</strong>: {{ radioValue }}
    </ComponentContainer>
    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>
    <CodeContainer
      language="html"
      class="maz-mb-0"
      code="<template>
  <MazRadio v-model=&quot;radioValue&quot;>
    Checkbox label
  </MazRadio>
</template>

<script>
  import { MazRadio } from 'maz-ui'
  export default {
    components: { MazRadio },
    data () {
      return {
        radioValue: false
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
import { COLORS } from '@/constantes'

export default {
  name: 'MazRadioDoc',
  data () {
    return {
      radioValue: 'primary',
      colors: COLORS
    }
  }
}
</script>
