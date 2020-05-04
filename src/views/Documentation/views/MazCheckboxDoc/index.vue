<template>
  <div class="maz-switch-doc">
    <ComponentContainer :code="codeExample">
      <MazCheckbox
        v-model="checkboxValue"
      >
        Checkbox label
      </MazCheckbox>
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazSwitchDoc',
    data () {
      return {
        checkboxValue: false,
        codeExample: `<template>
  <MazCheckbox
    v-model="checkboxValue"
  >
    Checkbox label
  </MazCheckbox>
</template>

export default {
  data () {
    return {
      checkboxValue: false
    }
  }
}`
      }
    }
  }
</script>
