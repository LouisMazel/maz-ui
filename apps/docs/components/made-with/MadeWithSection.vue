<script lang="ts" setup>
const { id, number, label } = defineProps<{
  id: string
  number: string
  label: string
}>()
</script>

<template>
  <section
    :id
    class="home-chapter maz:relative maz:-mt-(--home-radius) maz:rounded-t-(--home-radius) maz:bg-surface maz:font-sans maz:text-(length:--maz-base-font-size) maz:text-foreground maz:shadow-[0_-0.071429rem_0_var(--maz-color-divider)] maz:[contain-intrinsic-size:auto_100vh] maz:[content-visibility:auto] maz:first-of-type:mt-0 maz:first-of-type:rounded-none maz:first-of-type:shadow-none maz:first-of-type:[content-visibility:visible]"
    :aria-labelledby="`${id}-title`"
  >
    <div class="home-chapter__inner maz:relative maz:mx-auto maz:max-w-7xl maz:origin-top maz:px-[clamp(1.25rem,4vw,4rem)] maz:pt-[clamp(4rem,9vw,8rem)] maz:pb-[calc(clamp(4rem,9vw,8rem)+var(--home-radius))]">
      <p class="maz:m-0 maz:mb-[clamp(3rem,7vw,6rem)] maz:flex maz:items-baseline maz:gap-3 maz:border-b maz:border-divider maz:pb-4 maz:font-mono maz:text-xs maz:tracking-[0.08em] maz:text-foreground maz:uppercase">
        <span class="maz:font-semibold maz:text-primary">{{ number }}</span>
        <span>{{ label }}</span>
      </p>

      <slot />
    </div>
  </section>
</template>
