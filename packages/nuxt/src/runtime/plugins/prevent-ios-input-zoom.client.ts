import { isIos } from '@maz-ui/utils/helpers/isIos'
import { addViewportMaximumScale } from '@maz-ui/utils/helpers/preventIosInputZoom'
import { defineNuxtPlugin, useHead } from 'nuxt/app'

/**
 * The viewport goes through `useHead`: unhead owns the meta and would overwrite a direct DOM change.
 */
export default defineNuxtPlugin(() => {
  if (!isIos())
    return

  const content = document.querySelector('meta[name="viewport"]')?.getAttribute('content')

  if (content == null)
    return

  useHead({
    meta: [{ name: 'viewport', content: addViewportMaximumScale(content) }],
  })
})
