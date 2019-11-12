<template>
  <div
    id="app"
    class="flex flex-direction-column"
  >
    <NavHeader />
    <router-view />
  </div>
</template>

<script>
  import NavHeader from './components/NavHeader'

  export default {
    name: 'App',
    components: {
      NavHeader
    }
  }
</script>
