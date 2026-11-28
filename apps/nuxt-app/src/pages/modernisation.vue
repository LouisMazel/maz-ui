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

      <ModernisationPullRequest :number="1" title="Foundations" description="Motion tokens, reduced motion, motion primitives, utilities, the variant prop and the bug fixes." />

      <ModernisationMotionTokens />
      <ModernisationReducedMotion />
      <ModernisationUtilities />
      <ModernisationNewComponents />
      <ModernisationNewComposables />
      <ModernisationBugFixes />

      <ModernisationPullRequest :number="2" title="Overlays" description="Everything that opens: popovers, dialogs, drawers, bottom sheets, toasts, tooltips and the lightbox, growing from their origin." />

      <ModernisationPr2Popovers />
      <ModernisationPr2PopoverAnimations />
      <ModernisationPr2Toasts />
      <ModernisationPr2Dialogs />
      <ModernisationPr2Sheets />
      <ModernisationPr2Lightbox />

      <ModernisationPullRequest :number="3" title="Forms" description="Every field moves and looks the same: inputs, checkboxes, radios, switches, sliders, selects, the date picker, and the compact density." />

      <!-- PR 3 sections -->
    </main>
  </div>
</template>
