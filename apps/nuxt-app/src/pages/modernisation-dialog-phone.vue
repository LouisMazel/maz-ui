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
      Ouvrir le dialogue
    </MazBtn>
    <MazDialog v-model="isOpen" :align="align" title="Dialogue sur téléphone" scrollable>
      <p v-for="i in 20" :key="i" class="pb-4">
        Paragraphe {{ i }} : fais défiler avec le doigt dans le dialogue.
      </p>
      <template #footer="{ close }">
        <MazBtn @click="close">
          Fermer
        </MazBtn>
      </template>
    </MazDialog>
  </div>
</template>
