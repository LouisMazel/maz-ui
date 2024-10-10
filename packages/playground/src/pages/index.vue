<template>
  <div class="home">
    <MazBtn @click="openDialog" />
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
          autoFocus: true,
        }"
        :items="languagesOptions"
      >
        <template #item="{ item }">
          <div class="flex w-full items-center justify-between">
            <span class="capitalize">{{ item.label }}</span>
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
const languagesOptions = ref<{ label: string, value: string }[]>([])

onMounted(async () => {
  wait.start('APP_LOADING')
  await sleep(500)
  wait.stop('APP_LOADING')
})

toast.message('Votre mot de passe a été mis à jour', {
  position: 'bottom-left',
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

const dialog = useDialog()

async function openDialog() {
  const { promise } = dialog.open({
    title: 'Test dialog',
    message: 'This is a test dialog',
    buttons: [
      {
        text: 'Custom button',
        color: 'primary',
        action: () => {
          toast.info('Custom button clicked', {
            position: 'bottom',
          })
        },
      },
      {
        text: 'Custom button 2',
        color: 'secondary',
        type: 'resolve',
        response: 'custom-reponse-2',
      },
    ],
  })

  const response = await promise

  toast.success(`Dialog closed with response: ${response}`, {
    position: 'bottom',
  })
}
</script>
