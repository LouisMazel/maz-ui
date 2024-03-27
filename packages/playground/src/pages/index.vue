<template>
  <div class="home">
    <!-- class="maz-space-y-2" -->
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazPhoneNumberInput v-model="phone" label="Phone number" />

      <!-- End Developping Area -->
    </div>

    <MazFullscreenLoader v-if="wait.isLoading('APP_LOADING')" color="secondary">
      Loading...
    </MazFullscreenLoader>
  </div>
</template>

<script lang="ts" setup>
  import { sleep } from 'maz-ui'
  import type { MazTabsBarItem } from 'maz-ui/components/MazTabsBar.vue'

  const toast = useToast()
  const wait = useWait()

  const phone = ref<string>()

  const tabs = ref<MazTabsBarItem[]>([
    { label: 'First Tab', disabled: false },
    { label: 'Third Tab', disabled: false },
    { label: 'Fourth Tab', disabled: false },
    { label: 'Fifth Tab', disabled: false },
    { label: 'Sixth Tab', disabled: false },
    { label: 'Seven Tab', disabled: false },
    { label: 'Height Tab', disabled: false },
    { label: 'Nine Tab', disabled: false },
  ])

  onMounted(async () => {
    wait.start('APP_LOADING')
    await sleep(500)
    wait.stop('APP_LOADING')

    setTimeout(() => {
      tabs.value.splice(1, 0, { label: 'Second Tab', disabled: false, badge: { content: 5 } })
    }, 1000)
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
</script>
