<template>
  <div class="maz-spinner-doc">
    <div class="maz-flex maz-flex-wrap">
      <div class="maz-flex-1 maz-mr-4">
        <ComponentContainer :code="code1">
          <div class="maz-text-center">
            <MazSpinner
              v-for="color in colors"
              :key="`spinner-${color}`"
              :color="color"
            />
          </div>
        </ComponentContainer>
      </div>
      <div class="maz-flex-1">
        <ComponentContainer
          dark
          :code="code2"
        >
          <div class="maz-flex maz-flex-center maz-flex-wrap">
            <MazSpinner
              v-for="size in sizes"
              :key="`spinner-${size}`"
              :size="size"
            />
          </div>
        </ComponentContainer>
      </div>
    </div>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazSpinner />
</template>

<script>
  import { MazSpinner } from 'maz-ui'
  export default {
    components: { MazSpinner }
  }
</script>"
    />
  </div>
</template>

<script>
import { COLORS } from '@/constantes'

export default {
  name: 'MazSpinnerDoc',
  data () {
    return {
      colors: COLORS,
      sizes: [20, 40, 60, 80, 100, 120, 140],
      code1: `<MazSpinner
  :color="YOUR_COLOR"
/>`,
      code2: `<MazSpinner
  :size="YOUR_SIZE"
/>`
    }
  }
}
</script>
