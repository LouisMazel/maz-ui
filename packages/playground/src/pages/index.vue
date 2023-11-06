<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <!-- End Developping Area -->
    </div>

    <MazFullscreenLoader v-show="wait.isLoading('APP_LOADING')" color="secondary">
      Loading...
    </MazFullscreenLoader>
  </div>
</template>

<script lang="ts" setup>
  import { sleep } from 'maz-ui'

  const toast = useToast()
  const wait = useWait()

  useIdleTimeout({
    // eslint-disable-next-line no-console
    callback: (payload) => console.log('idle', payload),
    options: {
      timeout: 1000,
    },
  })

  useUserVisibility({
    // eslint-disable-next-line no-console
    callback: (payload) => console.log('userVisibility', payload),
    options: {
      timeout: 1000,
    },
  })

  wait.start('APP_LOADING')

  onMounted(async () => {
    await sleep(500)

    wait.stop('APP_LOADING')
  })

  toast.info('Votre mot de passe a été mis à jour', {
    position: 'top-left',
    action: {
      func: () => toast.success('CLICKED'),
      text: 'okokok',
    },
  })
  toast.success('Votre mot de passe a été mis à jour', {
    position: 'top-right',
  })
  toast.error('Votre mot de passe a été mis à jour', {
    position: 'bottom-right',
  })
  toast.warning('Votre mot de passe a été mis à jour', {
    position: 'bottom-left',
  })
  toast.info('Votre mot de passe a été mis à jour', {
    position: 'top',
  })
  toast.error('Votre mot de passe a été mis à jour', {
    position: 'bottom',
  })
</script>
