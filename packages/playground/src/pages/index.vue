<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <TestForm />

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
</script>
