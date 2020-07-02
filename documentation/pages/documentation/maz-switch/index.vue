<template>
  <div class="maz-switch-doc">
    <ComponentContainer>
      <div class="maz-flex maz-flex-wrap">
        <div
          v-for="type in btnTypes"
          :key="`switch-${type}`"
          class="maz-px-3"
        >
          <p class="maz-mb-3 maz-text-center">
            {{ type }}
          </p>
          <MazSwitch
            v-model="checkboxValue"
            :color="type"
            class="maz-mb-2"
          />
        </div>
      </div>
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
      code="<template>
  <MazSwitch
    v-model=&quot;value&quot;
  />
</template>

<script>
  import { MazSwitch } from 'maz-ui'
  export default {
    components: { MazSwitch }
    data () {
      return {
        value: false
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
  name: 'MazSwitchDoc',
  data () {
    return {
      btnTypes: COLORS,
      checkboxValue: true
    }
  }
}
</script>
