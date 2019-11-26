<template>
  <div class="maz-switch-doc">
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
