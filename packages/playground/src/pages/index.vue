<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazDropdown2 enable-context-menu>
        <template #trigger>
          <button type="button">
            Click me
          </button>
        </template>
        <MazDropdownItem>
          Option 1
          <template #submenu>
            <MazDropdownItem parent-id="option1">
              Sous-option 1.1
            </MazDropdownItem>
            <MazDropdownItem parent-id="option1">
              Sous-option 1.2
            </MazDropdownItem>
          </template>
        </MazDropdownItem>
        <MazDropdownItem>Option 2</MazDropdownItem>
        <MazDropdownItem>Option 3</MazDropdownItem>
      </MazDropdown2>

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
import MazDropdown2 from '../../../lib/components/MazDropdown/MazDropdown2.vue'
import MazDropdownItem from '../../../lib/components/MazDropdown/MazDropdownItem.vue'

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
