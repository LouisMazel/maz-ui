<script lang="ts" setup>
const selectValue = ref<string>()
const selectOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vite', value: 'vite' },
]
const date = ref<string>()
const color = ref<string>('#3b82f6')

const sides = ['top', 'right', 'bottom', 'left'] as const
const tooltipButtons = ['Edit', 'Copy', 'Share', 'Delete']
</script>

<template>
  <ModernisationSection
    id="pr2-popovers"
    title="PR 2. Popovers and tooltips"
    description="Panels grow from their trigger. Tooltips share their delay. Reduced motion turns the movement into an instant change."
  >
    <ModernisationDemo title="MazPopover: 4 sides" hint="Each panel fades in and grows from the center of its trigger, projected on its edge. The wide trigger shows the origin sitting under its center.">
      <div class="flex flex-wrap items-center justify-center gap-4 py-16">
        <MazPopover v-for="side in sides" :key="side" :position="side">
          <template #trigger>
            <MazBtn color="neutral">
              {{ side }}
            </MazBtn>
          </template>
          <div class="p-4">
            Opens from the {{ side }} side
          </div>
        </MazPopover>
        <MazPopover position="bottom-start">
          <template #trigger>
            <MazBtn color="neutral" class="w-64">
              Wide trigger, bottom-start
            </MazBtn>
          </template>
          <div class="p-4 w-32">
            Small panel
          </div>
        </MazPopover>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Dropdown, select, date picker, color picker" hint="They all use MazPopover: same growth from the trigger.">
      <div class="flex flex-wrap items-end gap-4">
        <MazDropdown :items="[{ label: 'Profile' }, { label: 'Settings' }, { label: 'Log out' }]">
          Dropdown
        </MazDropdown>
        <MazSelect v-model="selectValue" :options="selectOptions" label="Select" class="w-48" />
        <MazDatePicker v-model="date" label="Date" class="w-48" />
        <MazColorPicker v-model="color" label="Color" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="vTooltip: grouped delay" hint="Each tooltip waits 800 ms. After the first one, moving to the next button shows its tooltip at once.">
      <div class="flex gap-2">
        <MazBtn
          v-for="name in tooltipButtons"
          :key="name"
          v-tooltip="{ text: name, delay: 800 }"
          color="neutral"
          size="sm"
        >
          {{ name }}
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Custom transition with --maz-popover-transform-origin" hint="This transition rotates and bounces from the origin exposed on the panel.">
      <MazPopover transition="pr2-custom-popover" position="bottom">
        <template #trigger>
          <MazBtn color="primary">
            Custom transition
          </MazBtn>
        </template>
        <div class="p-4">
          Styled with the CSS variable
        </div>
      </MazPopover>
    </ModernisationDemo>
  </ModernisationSection>
</template>

<style>
.pr2-custom-popover-enter-active,
.pr2-custom-popover-leave-active {
  transform-origin: var(--maz-popover-transform-origin);
  transition:
    transform var(--maz-motion-normal) var(--maz-easing-spring),
    opacity var(--maz-motion-fast);
}

.pr2-custom-popover-enter-from,
.pr2-custom-popover-leave-to {
  opacity: 0;
  transform: scale(0.7) rotate(-6deg);
}
</style>
