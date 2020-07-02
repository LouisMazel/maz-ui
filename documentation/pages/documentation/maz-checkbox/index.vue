<template>
  <div class="maz-checkbox-doc">
    <h4>
      Examples
    </h4>

    <ComponentContainer>
      <MazCheckbox
        v-for="color in colors"
        :key="color"
        v-model="checkboxValue"
        :color="color"
        class="maz-mb-2"
      >
        Checkbox - color="{{ color }}"
      </MazCheckbox>
      <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
      <strong>Value</strong>: {{ checkboxValue }}
    </ComponentContainer>
    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h4>
      How to use it ?
    </h4>
    <CodeContainer
      language="html"
      class="maz-mb-0"
      code="<template>
  <MazCheckbox v-model=&quot;checkboxValue&quot;>
    Checkbox label
  </MazCheckbox>
</template>

<script>
  import { MazCheckbox } from 'maz-ui'
  export default {
    components: { MazCheckbox },
    data () {
      return {
        checkboxValue: true
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
  name: 'MazCheckboxDoc',
  data () {
    return {
      checkboxValue: true,
      colors: COLORS
    }
  }
}
</script>
