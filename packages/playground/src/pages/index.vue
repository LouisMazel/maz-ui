<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->
      <p>phone: {{ phone }}</p>
      <p>countryCode: {{ countryCode }}</p>
      <MazPhoneNumberInput
        id="phone"
        v-model="phone"
        v-model:country-code="countryCode"
        country-selector-display-name
        :preferred-countries="['FR', 'DE']"
        @data="data = $event"
      />

      <br />

      <code>
        {{ data }}
      </code>

      <!-- End Developping Area -->
    </div>

    <MazFullscreenLoader v-if="wait.isLoading('APP_LOADING')" color="secondary">
      Loading...
    </MazFullscreenLoader>
  </div>
</template>

<script lang="ts" setup>
  import { sleep } from 'maz-ui'
  import type { CountryCode, Results } from 'maz-ui/components/MazPhoneNumberInput.vue'

  const toast = useToast()
  const wait = useWait()

  const phone = ref<string>('+33612345678')
  const countryCode = ref<CountryCode>()
  const data = ref<Results>()

  onMounted(async () => {
    wait.start('APP_LOADING')
    await sleep(500)
    wait.stop('APP_LOADING')

    setTimeout(() => {
      // countryCode.value = 'BR'
      // phone.value = '+32485847291'
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
