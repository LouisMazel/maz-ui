<script lang="ts" setup>
import '~/css/modernisation.css'

definePageMeta({ layout: false })

const dir = useState<'ltr' | 'rtl'>('modernisation-dir', () => 'ltr')
const reduced = useState('modernisation-reduced', () => false)
const density = useState<'default' | 'compact'>('modernisation-density', () => 'default')

useHead({
  title: 'Modernisation - Maz UI',
  htmlAttrs: {
    dir,
    class: computed(() => [reduced.value ? 'm-motion-reduced' : '', density.value === 'compact' ? 'm-density-compact' : ''].filter(Boolean).join(' ')),
  },
})
</script>

<template>
  <div class="min-h-screen bg-surface text-foreground">
    <ModernisationToolbar v-model:dir="dir" v-model:reduced="reduced" v-model:density="density" />

    <main class="py-8 padded-container">
      <h1 class="text-title-1">
        Modernisation
      </h1>
      <p class="mt-2 max-w-3xl text-muted">
        Page temporaire : tout ce que la modernisation ajoute ou change, complétée à chaque PR. Utilise la barre d'outils pour changer le mode de couleur, la direction, la réduction des animations, la densité et le preset.
      </p>

      <ModernisationPullRequest :number="1" title="Fondations" description="Tokens d'animation, réduction des animations, primitives d'animation, utilitaires, la prop variant et les corrections de bugs." />

      <ModernisationMotionTokens />
      <ModernisationReducedMotion />
      <ModernisationUtilities />
      <ModernisationNewComponents />
      <ModernisationNewComposables />
      <ModernisationBugFixes />

      <ModernisationPullRequest :number="2" title="Overlays" description="Tout ce qui s'ouvre : popovers, dialogues, tiroirs, bottom sheets, toasts, tooltips et la lightbox, qui grandissent depuis leur origine." />

      <ModernisationPr2Popovers />
      <ModernisationPr2PopoverAnimations />
      <ModernisationPr2Toasts />
      <ModernisationPr2Dialogs />
      <ModernisationPr2Sheets />
      <ModernisationPr2Lightbox />

      <ModernisationPullRequest :number="3" title="Formulaires" description="Tous les champs bougent et se présentent de la même façon : inputs, cases à cocher, radios, switchs, sliders, selects, le date picker et la densité compacte." />

      <ModernisationPr3Fields />
      <ModernisationPr3Choices />
      <ModernisationPr3Inputs />
      <ModernisationPr3Selects />
      <ModernisationPr3DatePicker />
      <ModernisationPr3Density />

      <ModernisationPullRequest :number="4" title="Le reste et le design" description="Navigation, retours visuels, affichage, révélations au scroll avec vReveal, et la cohérence du design : focus, arrondis, élévation." />

      <ModernisationPr4Navigation />
      <ModernisationPr4Feedback />
      <ModernisationPr4Display />
      <ModernisationPr4Reveal />
      <!-- PR 3 sections -->
    </main>
  </div>
</template>
