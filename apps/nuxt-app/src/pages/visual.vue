<script lang="ts" setup>
import '~/css/modernisation.css'

definePageMeta({ layout: false })

const route = useRoute()
const dir = route.query.dir === 'rtl' ? 'rtl' : 'ltr'

useHead({
  title: 'Visual regression - Maz UI',
  htmlAttrs: { dir },
})

const avatar = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#6366f1" width="200" height="200"/></svg>')}`

const text = ref('Hello Maz UI')
const select = ref('vue')
const radio = ref('b')
const checkbox = ref(true)
const switchOn = ref(true)
const slider = ref(40)
const tags = ref(['Vue', 'Nuxt', 'Vite'])
const date = ref('2026-03-20')
const tab = ref(2)
const segmented = ref('b')
const page = ref(3)
const step = ref(2)
const accordion = ref(1)
const dialog = ref(false)
const drawer = ref(false)

const selectOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
]
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive'] as const
const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Role', key: 'role' },
  { label: 'Status', key: 'status' },
]
const rows = [
  { name: 'Alice Martin', role: 'Admin', status: 'Active' },
  { name: 'Bob Smith', role: 'Editor', status: 'Active' },
  { name: 'Carol White', role: 'Viewer', status: 'Inactive' },
]
const steps = [
  { title: 'Account', subtitle: 'Create your account' },
  { title: 'Profile', subtitle: 'Set up your profile' },
  { title: 'Confirm', subtitle: 'Review and confirm' },
]
</script>

<template>
  <div class="grid w-[720px] gap-6 bg-surface p-6 text-foreground">
    <h1 class="text-title-2">
      Visual regression blocks
    </h1>

    <div data-visual="btn" class="flex flex-wrap items-center gap-3 p-4">
      <MazBtn v-for="color in colors" :key="color" :color="color">
        {{ color }}
      </MazBtn>
      <MazBtn size="sm" disabled>
        Disabled
      </MazBtn>
      <MazBtn loading>
        Loading
      </MazBtn>
    </div>

    <div data-visual="input" class="grid gap-4 p-4">
      <MazInput v-model="text" label="Default" />
      <MazInput v-model="text" label="Error" error hint="Something is wrong" />
      <MazInput v-model="text" label="Disabled" disabled />
    </div>

    <div data-visual="select" class="p-4">
      <MazSelect v-model="select" :options="selectOptions" label="Framework" />
    </div>

    <div data-visual="select-open" class="min-h-64 p-4">
      <MazSelect v-model="select" :options="selectOptions" label="Framework" data-testid="select" />
    </div>

    <div data-visual="checkbox" class="flex flex-wrap gap-4 p-4">
      <MazCheckbox v-model="checkbox">
        Checked
      </MazCheckbox>
      <MazCheckbox :model-value="false">
        Unchecked
      </MazCheckbox>
      <MazCheckbox :model-value="true" disabled>
        Disabled
      </MazCheckbox>
    </div>

    <div data-visual="radio" class="flex flex-wrap gap-4 p-4">
      <MazRadio v-model="radio" value="a" name="visual-radio">
        A
      </MazRadio>
      <MazRadio v-model="radio" value="b" name="visual-radio">
        B
      </MazRadio>
      <MazRadio v-model="radio" value="c" name="visual-radio" disabled>
        C
      </MazRadio>
    </div>

    <div data-visual="switch" class="flex flex-wrap gap-4 p-4">
      <MazSwitch v-model="switchOn" label="On" />
      <MazSwitch :model-value="false" label="Off" />
      <MazSwitch :model-value="true" label="Disabled" disabled />
    </div>

    <div data-visual="card" class="grid gap-4 p-4">
      <MazCard title="Card" bordered>
        Content of the card.
      </MazCard>
      <MazCard title="Elevated card" elevation>
        Content of the card.
        <template #footer>
          Footer
        </template>
      </MazCard>
    </div>

    <div data-visual="dialog" class="p-4">
      <MazBtn data-testid="open-dialog" @click="dialog = true">
        Open dialog
      </MazBtn>
      <MazDialog v-model="dialog" title="Dialog title">
        Content of the dialog.
        <template #footer="{ close }">
          <MazBtn color="secondary" @click="close">
            Close
          </MazBtn>
        </template>
      </MazDialog>
    </div>

    <div data-visual="dropdown" class="min-h-64 p-4">
      <MazDropdown :items="[{ label: 'Edit' }, { label: 'Delete' }, { label: 'Archive' }]">
        Actions
      </MazDropdown>
    </div>

    <div data-visual="tabs" class="p-4">
      <MazTabs v-model="tab">
        <MazTabsBar v-model="tab" :items="[{ label: 'Overview' }, { label: 'Features', badge: { content: 3, color: 'primary' } }, { label: 'Pricing' }]" />
        <MazTabsContent>
          <MazTabsContentItem :tab="1">
            Overview
          </MazTabsContentItem>
          <MazTabsContentItem :tab="2">
            Features
          </MazTabsContentItem>
          <MazTabsContentItem :tab="3">
            Pricing
          </MazTabsContentItem>
        </MazTabsContent>
      </MazTabs>
    </div>

    <div data-visual="segmented" class="p-4">
      <MazSegmented
        v-model="segmented"
        :options="[{ label: 'Day', value: 'a' }, { label: 'Week', value: 'b' }, { label: 'Month', value: 'c' }]"
        aria-label="Range"
      />
    </div>

    <div data-visual="badge" class="flex flex-wrap items-center gap-3 p-4">
      <MazBadge v-for="color in colors" :key="color" :color="color">
        {{ color }}
      </MazBadge>
    </div>

    <div data-visual="alert" class="grid gap-3 p-4">
      <MazAlert color="info" title="Info" content="An informative message." />
      <MazAlert color="success" title="Success" content="It worked." />
      <MazAlert color="destructive" title="Error" content="Something failed." />
    </div>

    <div data-visual="avatar" class="flex flex-wrap items-center gap-4 p-4">
      <MazAvatar :src="avatar" size="2rem" />
      <MazAvatar :src="avatar" size="3rem" />
      <MazAvatar :src="avatar" size="4rem" bordered />
      <MazAvatar caption="John Doe" />
    </div>

    <div data-visual="pagination" class="p-4">
      <MazPagination v-model="page" :total-pages="10" />
    </div>

    <div data-visual="stepper" class="p-4">
      <MazStepper v-model="step" :steps="steps">
        <template #content-1>
          First step
        </template>
        <template #content-2>
          Second step
        </template>
        <template #content-3>
          Third step
        </template>
      </MazStepper>
    </div>

    <div data-visual="table" class="p-4">
      <MazTable :headers="headers" :rows="rows" title="Team" background-even />
    </div>

    <div data-visual="datepicker" class="p-4">
      <MazDatePicker v-model="date" label="Date" locale="en-US" inline />
    </div>

    <div data-visual="textarea" class="p-4">
      <MazTextarea v-model="text" label="Textarea" />
    </div>

    <div data-visual="input-tags" class="p-4">
      <MazInputTags v-model="tags" label="Tags" />
    </div>

    <div data-visual="slider" class="grid gap-4 p-4">
      <MazSlider v-model="slider" />
      <MazSlider v-model="slider" color="secondary" disabled />
    </div>

    <div data-visual="accordion" class="p-4">
      <MazAccordion v-model="accordion">
        <template #title-1>
          What is Maz UI?
        </template>
        <template #content-1>
          A Vue 3 and Nuxt component library.
        </template>
        <template #title-2>
          How to install?
        </template>
        <template #content-2>
          With pnpm.
        </template>
      </MazAccordion>
    </div>

    <div data-visual="drawer" class="p-4">
      <MazBtn data-testid="open-drawer" @click="drawer = true">
        Open drawer
      </MazBtn>
      <MazDrawer v-model="drawer" title="Drawer">
        <p class="px-6 py-4">
          Content of the drawer.
        </p>
      </MazDrawer>
    </div>

    <div data-visual="progress-bar" class="grid gap-4 p-4">
      <MazProgressBar :value="40" />
      <MazProgressBar :value="80" color="success" />
    </div>

    <div data-visual="skeleton" class="grid gap-3 p-4">
      <MazSkeleton />
      <MazSkeleton width="60%" />
      <MazSkeleton shape="circle" size="40px" />
    </div>
  </div>
</template>
