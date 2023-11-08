import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ $config, vueApp }) => {
  const defaultMazIconPath = $config.public.mazUi?.defaultMazIconPath

  vueApp.provide('mazIconPath', defaultMazIconPath)
})
