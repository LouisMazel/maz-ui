<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazSelect
        v-slot="{ option, isSelected }"
        v-model="selected"
        :options="options"
        label="Select a country"
        placeholder="Select a country"
        @update:model-value="(event) => console.log('update:model-value', event)"
        @selected-option="(event) => console.log('selected-option', event)"
      >
        <div
          class="m-country-selector__select__item maz-flex maz-items-center maz-gap-1 maz-truncate"
          :class="{
            'm-country-selector__select__item--selected': isSelected,
          }"
        >
          <span class="maz-text-lg">
            <slot
              name="country-list-flag"
              :country-code="option.value"
              :option="option"
              :is-selected="isSelected"
            >
              {{ option.label }}
            </slot>
          </span>
          <span class="maz-w-9 maz-flex-none">
            {{ option.description }}
          </span>
          <span class="maz-flex-1 maz-truncate">
            {{ option.label }}
          </span>
        </div>
      </MazSelect>

      <!-- End Developping Area -->
    </div>

    <MazFullscreenLoader v-if="wait.isLoading('APP_LOADING')" color="secondary">
      Loading...
    </MazFullscreenLoader>
  </div>
</template>

<script lang="ts" setup>
  import { sleep } from 'maz-ui'

  const selected = ref<string[]>([])
  const options = ref([
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'United States' },
    { value: 'es', label: 'Spain' },
    { value: 'it', label: 'Italy' },
  ])

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
</script>
