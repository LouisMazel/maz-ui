<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'

const outerOpen = ref(false)
const innerOpen = ref(false)
const popoverDialogOpen = ref(false)
const selectValue = ref<string>()
const selectOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
]

const tab = ref('overview')
const tabItems = ['Overview', 'Activity', 'Settings', 'Billing', 'Team', 'Security', 'Integrations', 'Audit log', 'Support', 'Docs'].map(label => ({ label, value: label.toLowerCase() }))

const code = ref('')

const infoAlert = useTemplateRef<ComponentPublicInstance>('infoAlert')
const destructiveAlert = useTemplateRef<ComponentPublicInstance>('destructiveAlert')
const roles = ref({ info: '', destructive: '' })

onMounted(() => {
  roles.value = {
    info: infoAlert.value?.$el.getAttribute('role') ?? '',
    destructive: destructiveAlert.value?.$el.getAttribute('role') ?? '',
  }
})
</script>

<template>
  <ModernisationSection
    id="bug-fixes"
    title="6. Bug fixes of the PR"
    description="Each demo reproduces a bug that is fixed in this PR."
  >
    <ModernisationDemo title="Nested dialogs" hint="Escape closes only the top dialog, and the focus stays inside it.">
      <MazBtn @click="outerOpen = true">
        Open the first dialog
      </MazBtn>
      <MazDialog v-model="outerOpen" title="First dialog">
        <p class="mb-4">
          Open the second one, then press Escape: only the second closes.
        </p>
        <MazBtn @click="innerOpen = true">
          Open the second dialog
        </MazBtn>
        <MazDialog v-model="innerOpen" title="Second dialog">
          <p class="mb-4">
            Focus is trapped here.
          </p>
          <MazInput label="Focus stays in this field" />
        </MazDialog>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="MazPopover and MazSelect inside a MazDialog" hint="Open the select or the popover, then press Escape: only it closes, the dialog stays open.">
      <MazBtn @click="popoverDialogOpen = true">
        Open the dialog
      </MazBtn>
      <MazDialog v-model="popoverDialogOpen" title="Dialog with overlays">
        <div class="flex flex-col gap-4">
          <MazSelect v-model="selectValue" :options="selectOptions" label="Framework" />
          <MazPopover trigger="click">
            <template #trigger>
              <MazBtn color="secondary">
                Open a popover
              </MazBtn>
            </template>
            <div class="p-4">
              Escape closes only me.
            </div>
          </MazPopover>
        </div>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="MazTabsBar without auto-scroll" hint="The indicator is placed on the active tab even when the bar does not scroll to it.">
      <div class="max-w-md">
        <MazTabsBar v-model="tab" :items="tabItems" :auto-scroll="false" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazDropdown open, arrow keys still scroll the page" hint="Open the dropdown, then use the arrow keys or the wheel: the page scrolls instead of being locked.">
      <MazDropdown>
        Open the dropdown
        <template #dropdown>
          <div class="w-56 p-4">
            Scroll the page with the arrow keys while I am open.
          </div>
        </template>
      </MazDropdown>
    </ModernisationDemo>

    <ModernisationDemo title="MazInputCode" hint="Paste a code or let the browser autofill it (one-time code). In RTL, the arrows follow the direction.">
      <div class="flex flex-col gap-4">
        <MazInputCode v-model="code" :code-length="6" />
        <p class="text-caption">
          Value: {{ code || 'empty' }}
        </p>
        <div dir="rtl">
          <p class="mb-2 text-caption">
            Forced RTL
          </p>
          <MazInputCode :code-length="6" />
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazAlert roles" hint="A neutral alert is a status (polite), an urgent one is an alert (assertive).">
      <div class="flex flex-col gap-3">
        <MazAlert ref="infoAlert" color="info" title="Info" content="Read from the DOM: role is announced politely." />
        <p class="text-caption">
          info: role="{{ roles.info || '...' }}"
        </p>
        <MazAlert ref="destructiveAlert" color="destructive" title="Error" content="Read from the DOM: role is announced right away." />
        <p class="text-caption">
          destructive: role="{{ roles.destructive || '...' }}"
        </p>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
