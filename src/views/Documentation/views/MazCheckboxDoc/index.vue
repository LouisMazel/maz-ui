<template>
  <div class="maz-switch-doc">
    <h2 class="text-center">
      {{ this.$route.name.substring(3).slice(0, -3) }}
    </h2>
    <ComponentContainer>
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
        checkboxValue: false
      }
    }
  }
</script>
