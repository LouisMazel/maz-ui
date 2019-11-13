<template>
  <div class="maz-switch-doc">
    <h2>
      {{ this.$route.name.substring(3).slice(0, -3) }}
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
