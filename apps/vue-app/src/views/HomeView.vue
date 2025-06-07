<script setup lang="ts">
import { MazPickerValue } from 'maz-ui/components';

import * as MazIcons from '@maz-ui/icons';

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

const date = ref<MazPickerValue>()
</script>

<template>
  <div id="home" class="maz-flex maz-justify-center maz-items-center maz-h-screen">
    <div class="maz-flex maz-flex-wrap maz-gap-2">
      <Component v-for="(icon, i) in MazIcons" :key="i" :is="icon" class="maz-w-10 maz-h-10" />
    </div>

    <MazBtn @click="showToast">Show toast</MazBtn>
  </div>
</template>
