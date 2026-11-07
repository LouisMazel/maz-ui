<script lang="ts" setup>
import type { HomePresetSwatch } from '../../.vitepress/data/home.data'
import { computed } from 'vue'

const { id, number, label, swatch, night = false, scheme } = defineProps<{
  id: string
  number: string
  label: string
  swatch: HomePresetSwatch
  night?: boolean
  scheme?: 'light' | 'dark'
}>()

const tokens = computed(() => (['primary', 'secondary', 'accent'] as const).map(role => ({
  role,
  light: swatch.light[role],
  dark: swatch.dark[role],
})))
</script>

<template>
  <section
    :id
    class="home-chapter maz:relative maz:-mt-(--home-radius) maz:rounded-t-(--home-radius) maz:bg-surface maz:font-sans maz:text-(length:--maz-base-font-size) maz:text-foreground maz:shadow-[0_-0.071429rem_0_var(--maz-color-divider)] maz:[contain-intrinsic-size:auto_100vh] maz:[content-visibility:auto] maz:first-of-type:mt-0 maz:first-of-type:rounded-none maz:first-of-type:shadow-none maz:first-of-type:[content-visibility:visible]"
    :class="{ 'home-chapter--night': night }"
    :data-preset="swatch.name"
    :data-scheme="scheme"
    :aria-labelledby="`${id}-title`"
  >
    <slot name="backdrop" />
    <div class="home-chapter__inner maz:relative maz:mx-auto maz:max-w-7xl maz:origin-top maz:px-[clamp(1.25rem,4vw,4rem)] maz:pt-[clamp(4rem,9vw,8rem)] maz:pb-[calc(clamp(4rem,9vw,8rem)+var(--home-radius))]">
      <div class="maz:mb-[clamp(3rem,7vw,6rem)] maz:grid maz:grid-cols-1 maz:items-baseline maz:gap-x-8 maz:gap-y-2 maz:border-b maz:border-divider maz:pb-4 maz:font-mono maz:text-xs maz:text-muted maz:tab-m:grid-cols-[auto_1fr]">
        <p class="maz:m-0 maz:flex maz:items-baseline maz:gap-3 maz:tracking-[0.08em] maz:text-foreground maz:uppercase">
          <span class="maz:font-semibold maz:text-primary">{{ number }}</span>
          <span>{{ label }}</span>
        </p>
        <p class="maz:m-0">
          Rendered with the <strong class="maz:font-semibold maz:text-foreground">{{ swatch.label }}</strong> preset
          <span class="maz:block maz:tab-m:ms-3 maz:tab-m:inline">{{ swatch.font }} · rounded-md {{ swatch.radius }}</span>
        </p>
        <ul class="maz:col-span-full maz:m-0 maz:flex maz:list-none maz:flex-wrap maz:gap-x-6 maz:gap-y-2 maz:p-0" :aria-label="`Main colors of the ${swatch.label} preset`">
          <li v-for="token in tokens" :key="token.role" class="maz:inline-flex maz:items-center maz:gap-2">
            <span class="maz:size-3.5 maz:rounded-sm maz:shadow-[inset_0_0_0_0.071429rem_color-mix(in_oklch,var(--maz-foreground)_15%,transparent)]" :style="{ backgroundColor: `var(--maz-${token.role})` }" />
            <span class="maz:text-foreground">{{ token.role }}</span>
            <code class="home-swatch__value--light">{{ token.light }}</code>
            <code class="home-swatch__value--dark">{{ token.dark }}</code>
          </li>
        </ul>
      </div>

      <slot />
    </div>
  </section>
</template>

<style scoped>
.home-swatch__value--dark,
:global(.dark) .home-swatch__value--light,
.home-chapter--night .home-swatch__value--light,
[data-scheme='dark'] .home-swatch__value--light {
  display: none;
}

:global(.dark) .home-swatch__value--dark,
.home-chapter--night .home-swatch__value--dark,
[data-scheme='dark'] .home-swatch__value--dark {
  display: inline;
}

[data-scheme='light'] .home-swatch__value--light {
  display: inline;
}

[data-scheme='light'] .home-swatch__value--dark {
  display: none;
}
</style>
