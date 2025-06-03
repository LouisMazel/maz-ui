<script setup lang="ts">
import { MazLink } from 'maz-ui/src/components/index.ts';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="maz-flex maz-items-center maz-p-4 maz-gap-4">
      <MazLink to="/">Home</MazLink>
      <MazLink to="/about">About</MazLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>
