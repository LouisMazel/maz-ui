<template>
  <div
    id="app"
    class="flex flex-direction-column w-100"
  >
    <Header />
    <router-view
      class=" flex-1"
    />
  </div>
</template>

<script>
  import Header from './components/Header'

  export default {
    name: 'App',
    components: {
      Header
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>
