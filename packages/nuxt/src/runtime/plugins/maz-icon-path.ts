import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ $config, vueApp }) => {
  const defaultMazIconPath = $config.public.mazUi?.general?.defaultMazIconPath

  vueApp.provide('mazIconPath', defaultMazIconPath)

  return {
    provide: {
      mazIconPath: defaultMazIconPath,
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazIconPath: string
  }
}
