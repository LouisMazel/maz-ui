<script lang="ts" setup>
import { sleep } from 'maz-ui'
import { string } from 'valibot'

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

const { model } = useFormValidator({
  schema: {
    name: string(),
    select: string(),
  },
  options: {
    mode: 'progressive',
  },
})

const select = useTemplateRef('select')
const input = useTemplateRef('input')

useFormField('name', {
  ref: input,
})
useFormField('select', {
  ref: select,
})
</script>

<template>
  <div class="home maz-h-screen">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazBtn v-tooltip="{ text: 'Coucou' }">
        Coucou
      </MazBtn>

      <MazInput
        ref="input"
        v-model="model.name"
        label="Name"
      />

      <MazSelect
        ref="select"
        v-model="model.select"
        :options="['1', '2', '3']"
        placeholder="Select"
        color="secondary"
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
