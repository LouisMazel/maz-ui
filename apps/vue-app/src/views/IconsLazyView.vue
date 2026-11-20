<script lang="ts" setup>
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <div class="maz:flex maz:items-center maz:gap-4 maz:p-8">
    <MazBtn data-test="show-lazy-icon" @click="show = !show">
      Toggle
    </MazBtn>
    <MazIcon v-if="show" icon="~rocket-launch" size="xl" data-test="lazy-icon" />
    <RouterLink to="/icons">
      Back
    </RouterLink>
  </div>
</template>
