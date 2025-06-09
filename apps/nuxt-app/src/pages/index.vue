<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazAnimatedText
        text="Hello world"
        last-word="true"
      />

      <MazChecklist
        v-model="languages"
        title="Select your languages"
        :search="{
          placeholder: 'Search a language',
          debounce: 300,
          autoFocus: false,
        }"
        :items="languagesOptions"
      >
        <template #item="{ item }">
          <div class="maz-flex maz-w-full maz-items-center maz-justify-between">
            <span>{{ item.label }}</span>
            <MazBadge
              color="contrast"
              outline
            >
              {{ item.value }}
            </MazBadge>
          </div>
        </template>
      </MazChecklist>

      <!-- End Developping Area -->
    </div>

    <MazFullscreenLoader
      v-if="wait.isLoading('APP_LOADING')"
      color="secondary"
    >
      Loading...
    </MazFullscreenLoader>
  </div>
</template>

<script lang="ts" setup>
import { sleep } from 'maz-ui/src/index.js'

const { getLanguageDisplayName } = useLanguageDisplayNames('en')
const toast = useToast()
const wait = useWait()
const languages = ref<string[]>([])

function getLanguageDisplayNames() {
  return [
    { label: getLanguageDisplayName({ code: 'aa' }).value || 'aa', value: 'aa' },
    { label: getLanguageDisplayName({ code: 'fr' }).value || 'fr', value: 'fr' },
    { label: getLanguageDisplayName({ code: 'en' }).value || 'en', value: 'en' },
    { label: getLanguageDisplayName({ code: 'es' }).value || 'es', value: 'es' },
    { label: getLanguageDisplayName({ code: 'de' }).value || 'de', value: 'de' },
    { label: getLanguageDisplayName({ code: 'it' }).value || 'it', value: 'it' },
  ]
}
const languagesOptions = ref<{ label: string, value: string }[]>(getLanguageDisplayNames())

onMounted(() => {
  languagesOptions.value = getLanguageDisplayNames()

  setTimeout(() => {
    languagesOptions.value = getLanguageDisplayNames()
  }, 3000)
})

onMounted(async () => {
  wait.start('APP_LOADING')
  await sleep(500)
  wait.stop('APP_LOADING')

  toast.message('Votre mot de passe a été mis à jour', {
    position: 'bottom-left',
    timeout: 10000,
    button: {
      onClick: () => toast.success('CLICKED'),
      text: 'Button',
    },
  })
  toast.success('Votre mot de passe a été mis à jour', {
    position: 'bottom-right',
  })
  toast.warning('Votre mot de passe a été mis à jour', {
    position: 'bottom-right',
  })
  toast.error('Votre mot de passe a été mis à jour', {
    position: 'bottom-right',
  })
})
</script>
