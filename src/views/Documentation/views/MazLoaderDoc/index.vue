<template>
  <div class="maz-loader-doc">
    <h2>
      {{ this.$route.name.substring(3).slice(0, -3) }}
    </h2>
    <ComponentContainer>
      <MazLoader />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazLoaderDoc'
  }
</script>
