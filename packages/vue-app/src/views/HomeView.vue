<script setup lang="ts">
import { useToast } from 'maz-ui/src/composables/index.ts';

const { message, success, error, info, warning } = useToast()

async function showToast() {
  message(`Hello, <strong>world</strong>!`, {
    position: 'top-right',
    timeout: 1000,
    html: true,
    persistent: true,
    maxToasts: 2,
    queue: true,
  })
  info('Hello, world!', {
    position: 'bottom-right',
    timeout: 10000,
  })
  warning ('Hello, world!', {
    position: 'bottom-left',
    timeout: 10000,
  })
  error('Hello, world!', {
    position: 'bottom',
    timeout: 10000,
  })
  success('Hello, world!', {
    position: 'top-left',
    timeout: 10000,
  })
}
</script>

<template>
  <div id="home" class="maz-flex maz-justify-center maz-items-center maz-h-screen">
    <AcademicCap />
    <MazBtn @click="showToast">Click me</MazBtn>
  </div>
</template>
