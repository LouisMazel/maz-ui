<script setup lang="ts">
import MazLink from 'maz-ui/components/MazLink.vue';

</script>

<template>
  <div class="banner">
    <span>
      You are currently browsing the <strong>v3</strong> documentation -
    </span>

    <MazLink color="white" underline href="https://maz-ui.com" class="maz-font-semibold">View v4 documentation →</MazLink>
  </div>
</template>

<style lang="postcss">

.banner {
  @apply maz-bg-primary;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  color: #fff;
  padding: 0.75rem;
  text-align: center;
}
</style>