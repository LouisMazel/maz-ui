<script setup lang="ts">
import { MazBtn, useToast } from 'maz-ui/src/index.ts';

const toast = useToast()

function showToast() {
  toast.success('Hello, world!', {
    position: 'top-right',
    timeout: 1000,
  })
  toast.error('Hello, world!', {
    position: 'bottom-right',
    timeout: 1000,
  })
  toast.warning('Hello, world!', {
    position: 'bottom-left',
    timeout: 1000,
  })
  toast.info('Hello, world!', {
    position: 'bottom',
    timeout: 1000,
  })
  toast.message('Hello, world!', {
    position: 'top',
    timeout: 1000,
  })
}
</script>

<template>
  <div id="home">
    <MazBtn @click="showToast">Click me</MazBtn>
  </div>
</template>
