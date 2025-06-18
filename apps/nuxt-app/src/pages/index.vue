<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazDropdown>
        <template #trigger>
          <MazBtn color="contrast">
            Hello
          </MazBtn>
        </template>

        <div class="maz-p-4">
          Hello
        </div>
      </MazDropdown>

      <MazPopover position="top">
        <template #trigger>
          <MazBtn color="destructive">
            Hello
          </MazBtn>
        </template>

        <template #default>
          <div class="maz-p-4">
            Hello
          </div>
        </template>
      </MazPopover>

      <MazBtn
        v-tooltip="{
          html: '<strong>COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC</strong>',
          color: 'destructive',
        }"
        color="destructive"
      >
        Tooltip Text HTML
      </MazBtn>
    <!-- <MazBtn
      v-tooltip="{
        html: `<strong>COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC COUCOUCOUCOUC</strong>`,
      }"
      color="destructive"
    >
      Tooltip Text HTML
    </MazBtn>
    <p
      v-tooltip.top="{
        text: 'COUCOUCOUCOUC',
      }"
      color="destructive"
    >
      Tooltip Top
    </p>
    <p
      v-tooltip.bottom="{
        text: 'COUCOUCOUCOUC',
      }"
      color="destructive"
    >
      Tooltip Bottom
    </p> -->

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

const toast = useToast()
const wait = useWait()

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
