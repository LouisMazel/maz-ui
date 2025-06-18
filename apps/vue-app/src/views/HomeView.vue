<script setup lang="ts">
import { vLazyImg } from 'maz-ui/src/directives/vLazyImg/lazy-img.directive.ts'
import { vTooltip } from 'maz-ui/src/directives/vTooltipPopover.ts'

const { message, success, error, info, warning } = useToast()

function showToast() {
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
  warning('Hello, world!', {
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

const isShow = ref(true)
const textButton = ref('Tooltip Text')

function toggleTextButton() {
  textButton.value = textButton.value === 'Tooltip Text' ? 'Tooltip Text 2' : 'Tooltip Text'
}
</script>

<template>
  <div id="home" class="maz-flex maz-h-screen maz-flex-col maz-items-center maz-justify-center">
    <!-- <MazPopover position="top">
      <template #trigger>
        <MazBtn color="destructive">
          Hello
        </MazBtn>
      </template>

      <template #default>
        <div class="maz-p-4">
          Hello
        </div>
      </template>
    </MazPopover>

    <MazBtn @click="showToast">
      Show toast
    </MazBtn> -->

    <MazBtn @click="isShow = !isShow"> Toggle tooltip </MazBtn>

    <MazBtn @click="toggleTextButton"> Toggle text button </MazBtn>

    <MazBtn
      v-if="isShow"
      v-tooltip="{
        html: '<strong>COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC</strong>',
        color: 'destructive',
      }"
      color="destructive"
    >
      {{ textButton }}
    </MazBtn>
    <!-- <MazBtn
      v-tooltip="{
        html: `<strong>COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC</strong>`,
      }"
      color="destructive"
    >
      Tooltip Text HTML
    </MazBtn>
    <p
      v-tooltip.top="{
        text: 'COUCOUCOUCOUC',
      }"
      color="destructive"
    >
      Tooltip Top
    </p>
    <p
      v-tooltip.bottom="{
        text: 'COUCOUCOUCOUC',
      }"
      color="destructive"
    >
      Tooltip Bottom
    </p> -->
  </div>
</template>
