<template>
  <div id="app">
    <Header />
    <div class="container">
      <br>
      <MazInput
        v-model="inputValue"
      />
      <MazCheckbox
        v-model="checkboxValue"
      />
    </div>
  </div>
</template>

<script>
  import Header from './components/Header'

  export default {
    name: 'App',
    components: {
      Header
    },
    data () {
      return {
        inputValue: '',
        checkboxValue: true
      }
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>
