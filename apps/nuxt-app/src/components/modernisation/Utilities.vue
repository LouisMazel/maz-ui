<script lang="ts" setup>
const drawFrom = [0, 90, 180, 270]
const checked = ref(false)

let nextId = 5
const items = ref([1, 2, 3, 4].map(id => ({ id, label: `Item ${id}` })))

function add() {
  const index = Math.floor(items.value.length / 2)
  items.value.splice(index, 0, { id: nextId, label: `Item ${nextId}` })
  nextId++
}

function remove(id: number) {
  items.value = items.value.filter(item => item.id !== id)
}

function shuffle() {
  items.value = [...items.value].reverse()
}
</script>

<template>
  <ModernisationSection
    id="utilities"
    title="3. Utilities"
    description="Tailwind utilities and transition classes shipped by maz-ui, usable in any app."
  >
    <ModernisationDemo title="focus-ring and focus-within-ring" hint="Tab through the elements: the ring shows on keyboard focus only, with the theme color, width and offset.">
      <div class="flex flex-wrap items-center gap-4">
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" class="focus-ring rounded-lg border border-divider px-4 py-2">
          focus-ring
        </button>
        <a href="#utilities" class="focus-ring rounded-lg border border-divider px-4 py-2">
          A link
        </a>
        <div class="focus-within-ring flex items-center gap-2 rounded-lg border border-divider px-3 py-2">
          <span class="text-muted">focus-within-ring</span>
          <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
          <input class="bg-transparent outline-none" placeholder="Type here" aria-label="Field with a ring on its wrapper">
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="press" hint="The element sinks while pressed and springs back. Not when disabled.">
      <div class="flex flex-wrap items-center gap-4">
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" class="press focus-ring rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          Press me
        </button>
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" class="press focus-ring rounded-lg bg-secondary px-4 py-2 text-secondary-foreground">
          Press me too
        </button>
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" class="press focus-ring rounded-lg border border-divider px-4 py-2">
          Outline
        </button>
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button type="button" disabled class="press rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled-state">
          Disabled
        </button>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="border-draw" hint="A line runs around the card on hover and focus, from --maz-border-draw-from (0deg is the top). The last card is drawn when checked (aria-checked).">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div
          v-for="angle in drawFrom"
          :key="angle"
          tabindex="0"
          class="border-draw focus-ring rounded-xl border border-divider bg-surface p-4"
          :style="{ '--maz-border-draw-from': `${angle}deg` }"
        >
          <p class="text-label">
            from {{ angle }}deg
          </p>
          <p class="text-caption">
            Hover or focus me
          </p>
        </div>
        <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
        <button
          type="button"
          role="checkbox"
          :aria-checked="checked"
          class="border-draw focus-ring rounded-xl border border-divider bg-surface p-4 text-start"
          @click="checked = !checked"
        >
          <p class="text-label">
            Checked state
          </p>
          <p class="text-caption">
            Click to {{ checked ? 'uncheck' : 'check' }}
          </p>
        </button>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="TransitionGroup name=&quot;maz-list&quot;" hint="A new item fades in and rises, a removed one leaves, the others glide to their place. Click an item to remove it.">
      <div class="mb-4 flex flex-wrap gap-2">
        <MazBtn size="sm" @click="add">
          Add
        </MazBtn>
        <MazBtn size="sm" color="secondary" @click="shuffle">
          Shuffle (reverse)
        </MazBtn>
      </div>
      <TransitionGroup name="maz-list" tag="ul" class="relative flex max-w-sm flex-col gap-2">
        <li v-for="item in items" :key="item.id">
          <!-- maz-ui-review-ignore prefer-maz-component -- demo of the utility on a native element -->
          <button
            type="button"
            class="focus-ring w-full rounded-lg border border-divider bg-surface px-4 py-2 text-start"
            @click="remove(item.id)"
          >
            {{ item.label }}
          </button>
        </li>
      </TransitionGroup>
    </ModernisationDemo>
  </ModernisationSection>
</template>
