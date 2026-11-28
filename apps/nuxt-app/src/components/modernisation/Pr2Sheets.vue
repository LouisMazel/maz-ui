<script lang="ts" setup>
type Side = 'start' | 'end' | 'top' | 'bottom'

const sides: Side[] = ['start', 'end', 'top', 'bottom']

const simpleOpened = ref(false)
const snapOpened = ref(false)
const activeSnap = ref<number | string>(0.4)
const scrollOpened = ref(false)
const scaleOpened = ref(false)
const drawerSide = ref<Side>('end')
const drawerOpened = ref(false)

function openDrawer(side: Side) {
  drawerSide.value = side
  drawerOpened.value = true
}
</script>

<template>
  <ModernisationSection
    id="pr2-sheets"
    title="PR 2. Bottom sheet and drawer (Vaul-like)"
    description="Swipe with the speed of the gesture, snap points, a scrollable content that never fights the drag, a page that steps back. On a desktop, drag the handle or the header with the mouse, or use the touch emulation of the devtools."
  >
    <ModernisationDemo
      title="Bottom sheet"
      hint="Drag down slowly: it springs back from where you let go. Flick it: it closes. Drag up: it resists."
    >
      <MazBtn @click="simpleOpened = true">
        Open the sheet
      </MazBtn>
      <MazBottomSheet v-model="simpleOpened" title="Swipe me">
        <p>Flick this sheet down, or drag it past the threshold, to close it.</p>
      </MazBottomSheet>
    </ModernisationDemo>

    <ModernisationDemo
      title="Snap points"
      hint="40%, 70% and full height. Flick to the next point, drag between them, or use the handle (click, Enter, arrows)."
    >
      <MazBtn @click="snapOpened = true">
        Open with snap points
      </MazBtn>
      <p class="mt-3 text-body-sm text-muted">
        Active snap point: <strong>{{ activeSnap }}</strong>
      </p>
      <MazBottomSheet v-model="snapOpened" v-model:snap="activeSnap" :snap-points="[0.4, 0.7, 1]" title="Snap points">
        <p class="mb-3 text-body-sm">
          Active snap point: <strong>{{ activeSnap }}</strong>
        </p>
        <p v-for="line in 20" :key="line" class="my-2">
          Line {{ line }} of a long content. Not fully open, the drag expands the sheet. Fully open, the content scrolls.
        </p>
      </MazBottomSheet>
    </ModernisationDemo>

    <ModernisationDemo
      title="Scrollable content"
      hint="Scroll the list, then pull down from the top of the list: the sheet takes over only when the list is at the top."
    >
      <MazBtn @click="scrollOpened = true">
        Open with a long list
      </MazBtn>
      <MazBottomSheet v-model="scrollOpened" title="Long list">
        <div class="max-h-64 overflow-y-auto rounded-lg border border-divider p-3">
          <p v-for="line in 40" :key="line" class="my-2">
            Item {{ line }}
          </p>
        </div>
      </MazBottomSheet>
    </ModernisationDemo>

    <ModernisationDemo
      title="Scale the background"
      hint="The page steps back with rounded corners and follows the sheet while you drag it. Reduced motion: nothing scales."
    >
      <MazBtn @click="scaleOpened = true">
        Open with scaled page
      </MazBtn>
      <MazBottomSheet v-model="scaleOpened" scale-background title="The page steps back">
        <p>The page behind this sheet is scaled down. Drag the sheet to see it follow.</p>
      </MazBottomSheet>
    </ModernisationDemo>

    <ModernisationDemo
      title="Drawers on the four sides"
      hint="Swipe towards the side to close, flick to close fast. Use the toolbar to switch to RTL: start and end swap, and so does the swipe."
    >
      <div class="flex flex-wrap gap-2">
        <MazBtn v-for="side in sides" :key="side" @click="openDrawer(side)">
          Open {{ side }}
        </MazBtn>
      </div>
      <MazDrawer v-model="drawerOpened" :side="drawerSide" :title="`Drawer ${drawerSide}`">
        <div class="p-4">
          <p>Swipe towards the {{ drawerSide }} side to close it. With a mouse, drag the header.</p>
          <p v-for="line in 20" :key="line" class="my-2 text-muted">
            Line {{ line }}
          </p>
        </div>
      </MazDrawer>
    </ModernisationDemo>
  </ModernisationSection>
</template>
