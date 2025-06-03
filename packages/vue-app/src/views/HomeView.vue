<script setup lang="ts">
import { useToast } from 'maz-ui/src/composables/index.ts';
import { MazBtn } from 'maz-ui/src/components/index.ts';

const toast = useToast()

function showToast() {
  toast.success('Hello, world!', {
    position: 'top-right',
    timeout: 5000,
  })
  toast.error('Hello, world!', {
    position: 'bottom-right',
    timeout: 5000,
  })
  toast.warning('Hello, world!', {
    position: 'bottom-left',
    timeout: 5000,
  })
  toast.info('Hello, world!', {
    position: 'bottom',
    timeout: 5000,
  })
  toast.message('Hello, world!', {
    position: 'top',
    timeout: 5000,
  })
}
</script>

<template>
  <div id="home">
    <MazBtn @click="showToast">Click me</MazBtn>

    <div class="maz-flex maz-flex-col maz-gap-4 maz-text-normal">
      Text
    </div>
  </div>
</template>
