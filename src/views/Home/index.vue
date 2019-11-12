<template>
  <div class="home">
    <div class="container">
      <h2>
        Home
      </h2>
    </div>
    <NavFooter />
  </div>
</template>

<script>
  import NavFooter from '@/components/NavFooter'

  export default {
    name: 'Home',
    components: {
      NavFooter
    }
  }
</script>
