<template>
  <div class="pickers-container">
    <InfoHeader />
  </div>
</template>

<script>
  import InfoHeader from './_subs/InfoHeader'

  export default {
    name: 'PickersContainer',
    components: { InfoHeader }
  }
</script>

<style lang="scss" scoped>
  .pickers-container {
    background-color: $bg-color;
    border-radius: $border-radius;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, .1);
    position: absolute;
    top: calc(100% + .143em);
    overflow: hidden;
    z-index: 999;
  }
</style>
