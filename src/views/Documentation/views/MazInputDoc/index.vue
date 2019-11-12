<template>
  <div class="maz-input-doc">
    <h2 class="text-center">
      MazInput
    </h2>
    <MazInput
      v-model="inputValue"
    />
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
