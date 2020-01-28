<template>
  <div class="maz-switch-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazSwitch
        v-for="type in btnTypes"
        :key="`switch-${type}`"
        v-model="checkboxValue"
        :color="type"
        class="mb-2"
      />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazSwitchDoc',
    data () {
      return {
        btnTypes: [
          'primary', 'secondary', 'third', 'success', 'danger', 'warning', 'grey', 'info', 'light', 'dark', 'default', 'white', 'black'
        ],
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
