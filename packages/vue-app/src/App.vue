<script setup lang="ts">
import { MazLink, MazBtn } from 'maz-ui/components';
import { RouterView } from 'vue-router';

const { showDialogAndWaitChoice } = useMazDialogPromise()

showDialogAndWaitChoice('test', () => {
  console.log('test')
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="maz-flex maz-items-center maz-p-4 maz-gap-4">
      <MazLink to="/">Home</MazLink>
      <MazLink to="/about">About</MazLink>
      <MazBtn>Click me</MazBtn>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>
