<template>
  <div class="maz-switch-doc">
    <h2 class="text-center">
      MazSwitchDoc
    </h2>
    <ComponentContainer>
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
        checkboxValue: false
      }
    }
  }
</script>
