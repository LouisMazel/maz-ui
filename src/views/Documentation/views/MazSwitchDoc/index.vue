<template>
  <div class="maz-switch-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazSwitch
        v-model="checkboxValue"
      />
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
  <MazSwitch
    v-model="checkboxValue"
  />
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
