<template>
  <div class="maz-checkbox-doc">
    <h3>
      Examples
    </h3>

    <ComponentContainer>
      <MazCheckbox v-model="checkboxValue">
        Checkbox label
      </MazCheckbox>
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
        checkboxValue: false
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazCheckboxDoc',
  data () {
    return {
      checkboxValue: false
    }
  }
}
</script>
