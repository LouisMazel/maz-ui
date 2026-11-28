<script lang="ts" setup>
import '~/css/modernisation.css'

definePageMeta({ layout: false })

const dir = useState<'ltr' | 'rtl'>('modernisation-dir', () => 'ltr')
const reduced = useState('modernisation-reduced', () => false)

useHead({
  title: 'Modernisation - Maz UI',
  htmlAttrs: {
    dir,
    class: computed(() => (reduced.value ? 'm-motion-reduced' : '')),
  },
})
</script>

<template>
  <div class="min-h-screen bg-surface text-foreground">
    <ModernisationToolbar v-model:dir="dir" v-model:reduced="reduced" />

    <main class="py-8 padded-container">
      <h1 class="text-title-1">
        Modernisation
      </h1>
      <p class="mt-2 max-w-3xl text-muted">
        Temporary page: everything the modernisation adds or changes, extended by each PR. Use the toolbar to switch color mode, direction, reduced motion and preset.
      </p>

      <ModernisationMotionTokens />
      <ModernisationReducedMotion />
      <ModernisationUtilities />
      <ModernisationNewComponents />
      <ModernisationNewComposables />
      <ModernisationBugFixes />
    </main>
  </div>
</template>
