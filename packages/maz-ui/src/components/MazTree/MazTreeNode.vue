<script lang="ts" setup>
import type { MazTreeItem } from './types.ts'
import { MazDocumentText } from '@maz-ui/icons/lazy/MazDocumentText'
import { MazFolder } from '@maz-ui/icons/lazy/MazFolder'
import { MazFolderOpen } from '@maz-ui/icons/lazy/MazFolderOpen'
import { computed, inject, nextTick, ref, useTemplateRef, watch } from 'vue'
import { resolveColor, resolveColorForeground } from '../../utils/freeColor.ts'
import MazIcon from '../MazIcon.vue'
import MazSpinner from '../MazSpinner.vue'
import { MAZ_TREE_KEY } from './types.ts'

defineOptions({ name: 'MazTreeNode' })

const { item, level, setSize, position } = defineProps<{
  item: MazTreeItem
  level: number
  setSize: number
  position: number
}>()

defineSlots<{
  item?: (props: { item: MazTreeItem, expanded: boolean, selected: boolean, level: number }) => unknown
}>()

const ctx = inject(MAZ_TREE_KEY)!

const isFolder = computed(() => ctx.isFolder(item))
const isExpanded = computed(() => ctx.expanded.value.has(item.id))
const isLoading = computed(() => ctx.loading.value.has(item.id))
const isRendered = ref(isExpanded.value)
const isPanelOpen = ref(isExpanded.value)
const panelRef = useTemplateRef<HTMLElement>('panelRef')

watch(isExpanded, async (expanded) => {
  if (!expanded) {
    isPanelOpen.value = false
    return
  }

  isRendered.value = true
  await nextTick()
  panelRef.value?.getBoundingClientRect()
  isPanelOpen.value = true
})

const children = computed(() => ctx.getChildren(item))
const checkState = computed(() => ctx.multiple.value ? ctx.getCheckState(item) : undefined)
const isSelected = computed(() => ctx.selected.value.has(item.id))
const isTabbable = computed(() => ctx.tabbableId.value === item.id)
const accent = computed(() => resolveColor(ctx.color.value === 'neutral' ? 'neutral-foreground' : ctx.color.value))

const accentForeground = computed(() => resolveColorForeground(ctx.color.value === 'neutral' ? 'neutral' : ctx.color.value))

const ariaChecked = computed<boolean | 'mixed' | undefined>(() => {
  if (!checkState.value)
    return undefined

  return checkState.value === 'mixed'
    ? 'mixed'
    : checkState.value === 'checked'
})

const ariaSelected = computed(() => ctx.multiple.value ? undefined : isSelected.value)
const isHighlighted = computed(() => ctx.multiple.value ? checkState.value === 'checked' : isSelected.value)

function onRowClick() {
  if (item.disabled)
    return

  ctx.setActive(item)
  ctx.activate(item)
}

function onToggle() {
  if (item.disabled)
    return

  ctx.setActive(item)
  ctx.toggleExpanded(item)
}

function onCheck() {
  if (item.disabled)
    return

  ctx.setActive(item)
  ctx.toggleChecked(item)
}
</script>

<template>
  <li
    class="m-tree__item"
    role="treeitem"
    :data-id="item.id"
    :tabindex="isTabbable ? 0 : -1"
    :aria-expanded="isFolder ? isExpanded : undefined"
    :aria-selected="ariaSelected"
    :aria-checked="ariaChecked"
    :aria-level="level"
    :aria-setsize="setSize"
    :aria-posinset="position"
    :aria-disabled="item.disabled ? 'true' : undefined"
    :aria-busy="isLoading ? 'true' : undefined"
    @focus.self="ctx.setActive(item)"
  >
    <!-- eslint-disable vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
    <div
      class="m-tree__row"
      :class="{
        'm-tree__row--selected': isHighlighted,
        'm-tree__row--disabled': item.disabled,
        'm-tree__row--deleted': item.status === 'deleted',
      }"
      :style="{ '--m-tree-level': level - 1, '--m-tree-accent': accent, '--m-tree-accent-foreground': accentForeground }"
      @click="onRowClick"
    >
      <span
        class="m-tree__chevron"
        :class="{ 'm-tree__chevron--open': isExpanded, 'm-tree__chevron--hidden': !isFolder }"
        aria-hidden="true"
        @click.stop="onToggle"
      >
        <MazSpinner v-if="isLoading" size="1em" color="primary" />
        <svg v-else-if="isFolder" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
        </svg>
      </span>

      <span
        v-if="ctx.multiple.value"
        class="m-tree__checkbox"
        :class="`m-tree__checkbox--${checkState}`"
        aria-hidden="true"
        @click.stop="onCheck"
      >
        <svg v-if="checkState === 'checked'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 10.5 3.5 3.5L15 6.5" /></svg>
        <svg v-else-if="checkState === 'mixed'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5.5 10h9" /></svg>
      </span>

      <span class="m-tree__icon" aria-hidden="true">
        <MazIcon v-if="item.icon" :icon="item.icon" />
        <MazIcon v-else :icon="isFolder ? (isExpanded ? MazFolderOpen : MazFolder) : MazDocumentText" />
      </span>

      <span class="m-tree__label">
        <!--
          @slot item - Replaces the label of an item
          @binding {MazTreeItem} item - The item
          @binding {boolean} expanded - The folder is open
          @binding {boolean} selected - The item is selected (or checked)
          @binding {number} level - Depth of the item, starting at 1
        -->
        <slot name="item" :item="item" :expanded="isExpanded" :selected="isHighlighted" :level="level">
          {{ item.label }}
        </slot>
      </span>

      <span v-if="item.status" class="m-tree__status" :class="`m-tree__status--${item.status}`">
        <span aria-hidden="true">{{ ctx.statusLabel(item.status).charAt(0).toUpperCase() }}</span>
        <span class="maz:sr-only">{{ ctx.statusLabel(item.status) }}</span>
      </span>
    </div>
    <!-- eslint-enable vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->

    <div
      v-if="isFolder && isRendered"
      ref="panelRef"
      class="m-tree__panel"
      :class="{ 'm-tree__panel--open': isPanelOpen }"
    >
      <ul class="m-tree__group" role="group">
        <MazTreeNode
          v-for="(child, index) in children"
          :key="child.id"
          :item="child"
          :level="level + 1"
          :set-size="children.length"
          :position="index + 1"
        >
          <template #item="slotProps">
            <slot name="item" v-bind="slotProps">
              {{ slotProps.item.label }}
            </slot>
          </template>
        </MazTreeNode>
      </ul>
    </div>
  </li>
</template>

<style scoped>
.m-tree__item {
  list-style: none;
  outline: none;
}

.m-tree__row {
  --m-tree-row-height: 2rem;

  display: flex;
  gap: 0.375rem;
  align-items: center;
  min-block-size: var(--m-tree-row-height);
  padding-block: 0.125rem;
  padding-inline: calc(var(--m-tree-level, 0) * 1.25em + 0.375rem) 0.5rem;
  cursor: pointer;
  user-select: none;
  border-radius: 0.375rem;
  transition: background-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out);
}

.m-tree__row:hover {
  background: color-mix(in srgb, var(--maz-foreground) 6%, transparent);
}

.m-tree__row--selected {
  background: color-mix(in srgb, var(--m-tree-accent) 14%, transparent);
}

.m-tree__row--selected:hover {
  background: color-mix(in srgb, var(--m-tree-accent) 20%, transparent);
}

.m-tree__row--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.m-tree__row--disabled:hover {
  background: transparent;
}

.m-tree__item:focus-visible > .m-tree__row {
  outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
  outline-offset: -2px;
}

.m-tree__chevron {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  inline-size: 1.25em;
  block-size: 1.25em;
  color: var(--maz-muted);
  transition: rotate calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-tree__chevron:dir(rtl) {
  rotate: 180deg;
}

.m-tree__chevron--open,
.m-tree__chevron--open:dir(rtl) {
  rotate: 90deg;
}

.m-tree__chevron--hidden {
  visibility: hidden;
}

.m-tree__chevron svg {
  inline-size: 100%;
  block-size: 100%;
}

.m-tree__checkbox {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  inline-size: 1.125em;
  block-size: 1.125em;
  color: var(--m-tree-accent-foreground, var(--maz-primary-foreground));
  background: var(--maz-container-bg, var(--maz-surface));
  border: 1.5px solid color-mix(in srgb, var(--maz-foreground) 40%, transparent);
  border-radius: 0.25rem;
  transition:
    background-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    border-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-tree__checkbox--checked,
.m-tree__checkbox--mixed {
  background: var(--m-tree-accent);
  border-color: var(--m-tree-accent);
}

.m-tree__checkbox svg {
  inline-size: 100%;
  block-size: 100%;
}

.m-tree__icon {
  display: inline-flex;
  flex: none;
  font-size: 1.125em;
  color: var(--maz-muted);
}

.m-tree__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-tree__row--deleted .m-tree__label {
  color: var(--maz-muted);
  text-decoration: line-through;
}

.m-tree__status {
  flex: none;
  margin-inline-start: auto;
  font-size: 0.75em;
  font-weight: 700;
}

.m-tree__status--added {
  color: color-mix(in srgb, var(--maz-success) 70%, var(--maz-foreground));
}

.m-tree__status--modified {
  color: color-mix(in srgb, var(--maz-warning) 60%, var(--maz-foreground));
}

.m-tree__status--deleted {
  color: color-mix(in srgb, var(--maz-destructive) 85%, var(--maz-foreground));
}

.m-tree__panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition:
    grid-template-rows calc(var(--maz-motion-normal, 250ms) * 0.7 * var(--maz-motion-scale, 1))
      var(--maz-easing-in-out, ease-in-out),
    visibility 0s linear calc(var(--maz-motion-normal, 250ms) * 0.7 * var(--maz-motion-scale, 1));
}

.m-tree__panel--open {
  grid-template-rows: 1fr;
  visibility: visible;
  transition:
    grid-template-rows calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1))
      var(--maz-easing-in-out, ease-in-out),
    visibility 0s linear 0s;
}

.m-tree__group {
  min-block-size: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
