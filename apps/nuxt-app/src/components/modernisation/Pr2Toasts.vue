<script lang="ts" setup>
import type { ToastOptions, ToastPosition } from 'maz-ui/plugins/toast'

const toast = useToast()

const positions: ToastPosition[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']
const position = ref<ToastPosition>('bottom-right')
const stacked = ref(true)

const options = computed<ToastOptions>(() => ({ position: position.value, stacked: stacked.value }))

const types = [
  { label: 'Message', color: 'contrast', show: () => toast.message('A message', options.value) },
  { label: 'Info', color: 'info', show: () => toast.info('Some information', options.value) },
  { label: 'Success', color: 'success', show: () => toast.success('Saved with success', options.value) },
  { label: 'Warning', color: 'warning', show: () => toast.warning('Be careful', options.value) },
  { label: 'Error', color: 'destructive', show: () => toast.error('Something went wrong', options.value) },
  { label: 'Accent', color: 'accent', show: () => toast.accent('An accent toast', options.value) },
  { label: 'Neutral', color: 'neutral', show: () => toast.neutral('A neutral toast', options.value) },
] as const

function burst(count = 5) {
  for (let index = 1; index <= count; index++) {
    setTimeout(() => toast.message(`Toast ${index} of ${count}${index % 2 === 0 ? ', a longer message to see the heights differ in the deck' : ''}`, options.value), index * 150)
  }
}

function runPromise(shouldResolve: boolean) {
  const task = new Promise<string>((resolve, reject) => {
    setTimeout(() => (shouldResolve ? resolve('Louis') : reject(new Error('Network down'))), 2000)
  })

  toast.promise(task, {
    ...options.value,
    loading: 'Saving the profile...',
    success: name => `Profile of ${name} saved`,
    error: error => `Failed: ${(error as Error).message}`,
  })

  task.catch(() => {})
}
</script>

<template>
  <ModernisationSection
    id="pr2-toasts"
    title="Toasts"
    description="A deck by default, spread on hover or focus. The others glide when a toast comes or goes, a swipe dismisses, the promise toast draws its result, the line shows the time left."
  >
    <ModernisationDemo title="Settings" hint="Applied to the buttons below.">
      <div class="flex flex-wrap items-center gap-4">
        <MazSelect
          v-model="position"
          label="Position"
          :options="positions.map(value => ({ label: value, value }))"
          class="w-48"
        />
        <MazSwitch v-model="stacked">
          Stacked
        </MazSwitch>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Types" hint="One toast of each type, at the chosen position.">
      <div class="flex flex-wrap gap-2">
        <MazBtn v-for="item in types" :key="item.label" :color="item.color" size="sm" @click="item.show()">
          {{ item.label }}
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Stack" hint="A burst of toasts: hover or focus the stack to spread it, hide the tab to pause the timers. With Stacked off, they stay in a list.">
      <div class="flex flex-wrap gap-2">
        <MazBtn size="sm" @click="burst(5)">
          Burst of 5
        </MazBtn>
        <MazBtn size="sm" color="secondary" @click="burst(12)">
          Burst of 12
        </MazBtn>
        <MazBtn size="sm" color="secondary" @click="toast.message('Stays until closed', { ...options, timeout: false })">
          Without timeout
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Promise" hint="Loading, then a check or a cross that draws itself, and the text fades.">
      <div class="flex flex-wrap gap-2">
        <MazBtn size="sm" color="success" @click="runPromise(true)">
          Resolve
        </MazBtn>
        <MazBtn size="sm" color="destructive" @click="runPromise(false)">
          Reject
        </MazBtn>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Swipe" hint="Drag a toast towards the edge (up or down on the centered positions) or flick it. A short drag springs back. Switch the direction in the toolbar to check RTL.">
      <MazBtn size="sm" @click="toast.info('Swipe me away', { ...options, timeout: false })">
        Show a toast to swipe
      </MazBtn>
    </ModernisationDemo>
  </ModernisationSection>
</template>
