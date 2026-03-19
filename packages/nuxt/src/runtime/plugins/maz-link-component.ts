import { defineNuxtLink, defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ vueApp }) => {
  const NuxtLink = defineNuxtLink({})

  vueApp.provide('mazLinkComponent', NuxtLink)
})
