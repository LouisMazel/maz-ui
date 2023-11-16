import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ $config, vueApp }) => {
  const defaultMazIconPath = $config.public.mazUi?.defaultMazIconPath

  vueApp.provide('mazIconPath', defaultMazIconPath)

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
