<template>
  <div class="maz-switch-doc">
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
