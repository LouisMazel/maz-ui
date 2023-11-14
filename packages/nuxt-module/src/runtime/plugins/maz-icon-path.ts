import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ $config }) => {
  const defaultMazIconPath = $config.public.mazUi?.defaultMazIconPath

  return {
    provide: {
      mazIconPath: defaultMazIconPath,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $mazIconPath: string
  }
}
