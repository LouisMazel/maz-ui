<template>
  <div class="maz-switch-doc">
    <h2 class="text-center">
      MazInput
    </h2>
    <MazSwitch
      v-model="checkboxValue"
    />
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
