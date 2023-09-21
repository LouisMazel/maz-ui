import { installAos } from './../../../modules'
import { defineNuxtPlugin, useRouter } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const aosOptions = $config.public.mazUi?.injectAos
  const router = useRouter()

  const options =
    typeof aosOptions === 'object'
      ? { ...aosOptions, router: aosOptions.router ? router : undefined }
      : {}

  vueApp.use(installAos, options)
})
