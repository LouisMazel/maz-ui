<template>
  <div
    class="maz-loader flex align-center justify-center"
    :class="{
      'is-dark': dark
    }"
  >
    <div class="maz-loader__anim">
      <div /><div /><div /><div /><div /><div /><div /><div />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazLoader',
    props: {
      dark: { type: Boolean, default: false }
    }
  }
</script>
