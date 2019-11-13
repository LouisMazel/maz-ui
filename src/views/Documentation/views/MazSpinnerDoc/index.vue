<template>
  <div class="maz-spinner-doc">
    <h2>
      {{ this.$route.name.substring(3).slice(0, -3) }}
    </h2>
    <ComponentContainer>
      <MazSpinner />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazSpinnerDoc'
  }
</script>
