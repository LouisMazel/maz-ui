<script lang="ts" setup>
import { sleep } from 'maz-ui'

const toast = useToast()
const wait = useWait()
useWindowSize()

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

onMounted(async () => {
  wait.start('APP_LOADING')
  await sleep(500)
  wait.stop('APP_LOADING')
})

const selected = ref('1')
</script>

<template>
  <div class="home maz-h-screen">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazBtn v-tooltip="{ text: 'Coucou' }">
        Coucou
      </MazBtn>

      <MazSelect
        v-model="selected"
        :options="['1', '2', '3']"
        search
      />

      <MazPopover>
        <template #trigger>
          <MazBtn color="secondary">
            Hello
          </MazBtn>
        </template>

        <template #default>
          <div class="maz-p-4">
            Hello
          </div>
        </template>
      </MazPopover>
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
