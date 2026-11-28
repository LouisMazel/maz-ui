<script lang="ts" setup>
import '~/css/modernisation.css'

definePageMeta({ layout: false })

const route = useRoute()
const align = computed(() => (route.query.align === 'end' ? 'end' : undefined))
const isOpen = ref(true)
</script>

<template>
  <div class="min-h-dvh bg-surface p-4">
    <MazBtn @click="isOpen = true">
      Open the dialog
    </MazBtn>
    <MazDialog v-model="isOpen" :align="align" title="Phone dialog" scrollable>
      <p v-for="i in 20" :key="i" class="pb-4">
        Paragraph {{ i }}: scroll with the finger inside the dialog.
      </p>
      <template #footer="{ close }">
        <MazBtn @click="close">
          Close
        </MazBtn>
      </template>
    </MazDialog>
  </div>
</template>
