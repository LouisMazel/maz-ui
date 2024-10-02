<template>
  <div class="home">
    <MazBtn @click="openDialog" />
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <!-- <TestForm /> -->

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
