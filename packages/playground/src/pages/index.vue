<template>
  <div class="home">
    <div>
      <!-- Start Developping Area - You should not commit anything here to keep this place clean for all others -->

      <MazFormGenerator
        v-model="payload"
        :sections="sections"
        :validation-options="{ mode: 'eager' }"
      />
      {{ checkbox }}
      <MazCheckbox
        v-model="checkbox"
        value="field"
      />

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
import type { FormSection } from 'maz-ui/components/MazFormGenerator.vue'
import { pipe, string, nonEmpty } from 'valibot'
import trash from 'maz-ui/icons/trash.svg?component'

const checkbox = ref([])

const payload = ref<{
  'field-1': string
  'field-2': string
}>({
  'field-1': '',
  'field-2': '',
})

const sections = computed(() => [
  {
    id: 'section-1',
    wrapper: {
      title: 'Section 1',
      icon: trash,
    },
    fields: [
      {
        id: 'field-1',
        name: 'field-1',
        componentName: 'MazInput',
        props: {
          label: 'Field 1',
        },
        validation: {
          rule: pipe(
            string('This field is required'),
            nonEmpty('This field is required'),
          ),
        },
      },
      {
        id: 'field-2',
        name: 'field-2',
        componentName: 'MazCheckbox',
        props: {
          label: 'Field 2',
          value: 'field-2',
          // options: [
          //   { label: 'Option 1', value: 'option-1' },
          //   { label: 'Option 2', value: 'option-2' },
          // ],
        },
        validation: {
          mode: 'lazy',
          rule: pipe(
            string('This field is required'),
            nonEmpty('This field is required'),
          ),
        },
      },
    ],
  },
] satisfies FormSection[])

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
