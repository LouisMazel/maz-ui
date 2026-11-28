<script lang="ts" setup>
const { matches: mediaReduced } = useMediaQuery('(prefers-reduced-motion: reduce)')
const htmlReduced = useState<boolean>('modernisation-reduced')
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <ModernisationSection
    id="reduced-motion"
    title="2. Animations réduites"
    description="Les animations réduites arrêtent seulement ce qui appartient à maz-ui. Les animations de ton app continuent."
  >
    <ModernisationDemo
      title="Élément de la lib et élément de l'app"
      hint="Active les animations réduites dans la barre d'outils : le spinner et le bouton de chargement s'arrêtent, pas les éléments de l'app qui rebondissent et pulsent."
    >
      <p class="mb-4 text-body-sm">
        Préférence système : <strong>{{ !mounted ? '...' : mediaReduced ? 'réduire' : 'aucune préférence' }}</strong>,
        classe <code class="text-code">m-motion-reduced</code> sur html : <strong>{{ htmlReduced ? 'oui' : 'non' }}</strong>
      </p>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="flex flex-col items-center gap-3 rounded-lg border border-divider p-4">
          <p class="text-label">
            maz-ui (s'arrête)
          </p>
          <div class="flex items-center gap-4">
            <MazSpinner />
            <MazBtn loading size="sm">
              Chargement
            </MazBtn>
          </div>
        </div>
        <div class="flex flex-col items-center gap-3 rounded-lg border border-divider p-4">
          <p class="text-label">
            App (continue d'animer)
          </p>
          <div class="flex items-center gap-4">
            <div class="size-8 animate-bounce rounded-full bg-primary" />
            <div class="h-8 w-24 animate-pulse rounded-lg bg-secondary" />
          </div>
        </div>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
