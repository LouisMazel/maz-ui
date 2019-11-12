<template>
  <div class="maz-input-doc">
    <h2 class="text-center">
      MazInput
    </h2>
    <ComponentContainer class="p-4 m-4">
      <MazInput
        v-model="inputValue"
      />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazInputDoc',
    data () {
      return {
        inputValue: ''
      }
    }
  }
</script>
