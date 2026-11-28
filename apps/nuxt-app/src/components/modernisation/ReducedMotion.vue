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
    title="2. Reduced motion"
    description="Reduced motion only stops what belongs to maz-ui. The animations of your app keep running."
  >
    <ModernisationDemo
      title="Library element vs app element"
      hint="Turn on Reduced motion in the toolbar: the spinner and the loading button stop, the bouncing and pulsing app elements do not."
    >
      <p class="mb-4 text-body-sm">
        System preference: <strong>{{ !mounted ? '...' : mediaReduced ? 'reduce' : 'no preference' }}</strong>,
        class <code class="text-code">m-motion-reduced</code> on html: <strong>{{ htmlReduced ? 'yes' : 'no' }}</strong>
      </p>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="flex flex-col items-center gap-3 rounded-lg border border-divider p-4">
          <p class="text-label">
            maz-ui (stops)
          </p>
          <div class="flex items-center gap-4">
            <MazSpinner />
            <MazBtn loading size="sm">
              Loading
            </MazBtn>
          </div>
        </div>
        <div class="flex flex-col items-center gap-3 rounded-lg border border-divider p-4">
          <p class="text-label">
            App (keeps animating)
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
