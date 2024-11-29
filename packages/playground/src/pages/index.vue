<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <!-- <TestForm /> -->

      <MazChecklist
        v-model="languages"
        title="Select your languages"
        :search="{
          enabled: true,
          placeholder: 'Search a language',
          debounce: 300,
          autoFocus: false,
        }"
        :items="languagesOptions"
      >
        <template #item="{ item }">
          <div class="maz-flex maz-w-full maz-items-center maz-justify-between">
            <span class="maz-capitalize">{{ item.label }}</span>
            <MazBadge
              color="theme"
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
import { sleep } from 'maz-ui'

const toast = useToast()
const wait = useWait()
const languages = ref<string[]>([])
const languagesOptions = ref<{ label: string, value: string }[]>([
  { label: 'French', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'German', value: 'de' },
  { label: 'Italian', value: 'it' },
])

onMounted(async () => {
  wait.start('APP_LOADING')
  await sleep(500)
  wait.stop('APP_LOADING')
})

toast.message('Votre mot de passe a été mis à jour', {
  position: 'bottom-left',
  timeout: 10000,
  action: {
    func: () => toast.success('CLICKED'),
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
</script>
