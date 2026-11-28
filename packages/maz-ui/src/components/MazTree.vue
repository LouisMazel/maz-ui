<script lang="ts" setup>
import type { MazTreeItem, MazTreeStatus } from './MazTree/types.ts'
import type { MazColor, MazColorOrFree, MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onBeforeUnmount, provide, ref, useTemplateRef } from 'vue'
import MazTreeNode from './MazTree/MazTreeNode.vue'
import { MAZ_TREE_KEY } from './MazTree/types.ts'

export type { MazTreeCheckState, MazTreeItem, MazTreeStatus } from './MazTree/types.ts'

export interface MazTreeProps {
  /**
   * The items of the tree. An item with `children` is a folder
   * @type {MazTreeItem[]}
   */
  items: MazTreeItem[]
  /**
   * Check several items with checkboxes. A folder is checked when all its items are, and mixed when only some are.
   * `v-model` is then an array of ids
   * @default false
   */
  multiple?: boolean
  /**
   * Loads the children of an item with `lazy: true` the first time it opens. The folder shows a spinner and opens at its real height
   * @type {(item: MazTreeItem) => Promise<MazTreeItem[]>}
   */
  load?: (item: MazTreeItem) => Promise<MazTreeItem[]>
  /**
   * Accessible name of the tree
   */
  label?: string
  /**
   * Size of the texts and of the rows
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default 'md'
   */
  size?: MazSize
  /**
   * Color of the selection: a theme color or a free CSS color
   * @default 'primary'
   */
  color?: MazColorOrFree<Exclude<MazColor, 'transparent'>>
}

const {
  items,
  multiple = false,
  load = undefined,
  label = undefined,
  size = 'md',
  color = 'primary',
} = defineProps<MazTreeProps>()

const emit = defineEmits<{
  /**
   * Emitted when the loading of the children of a folder fails
   * @property {MazTreeItem} item The folder
   * @property {unknown} error The error of `load`
   */
  'load-error': [item: MazTreeItem, error: unknown]
}>()

defineSlots<{
  /**
   * Replaces the label of an item
   */
  item?: (props: { item: MazTreeItem, expanded: boolean, selected: boolean, level: number }) => unknown
}>()

const { t } = useTranslations()

const TYPEAHEAD_DELAY = 500

/**
 * The selected id (single mode), or the ids of the checked items (`multiple`)
 * @model
 */
const model = defineModel<string | string[] | undefined>()
/**
 * The ids of the open folders
 * @model expanded
 */
const expandedModel = defineModel<string[]>('expanded', { default: () => [] })

const rootRef = useTemplateRef<HTMLElement>('rootRef')
const loaded = ref<Record<string, MazTreeItem[]>>({})
const loading = ref(new Set<string>())
const activeId = ref<string>()

let buffer = ''
let bufferTimer: ReturnType<typeof setTimeout> | undefined

function getChildren(item: MazTreeItem): MazTreeItem[] {
  return loaded.value[item.id] ?? item.children ?? []
}

function isFolder(item: MazTreeItem) {
  return !!item.children || !!item.lazy || item.id in loaded.value
}

interface IndexEntry {
  item: MazTreeItem
  parentId?: string
}

const index = computed(() => {
  const map = new Map<string, IndexEntry>()

  function walk(list: MazTreeItem[], parentId?: string) {
    for (const item of list) {
      map.set(item.id, { item, parentId })
      walk(getChildren(item), item.id)
    }
  }

  walk(items)

  return map
})

const expandedSet = computed(() => new Set(expandedModel.value))

const visible = computed(() => {
  const result: MazTreeItem[] = []

  function walk(list: MazTreeItem[]) {
    for (const item of list) {
      result.push(item)

      if (isFolder(item) && expandedSet.value.has(item.id))
        walk(getChildren(item))
    }
  }

  walk(items)

  return result
})

const enabledVisible = computed(() => visible.value.filter(item => !item.disabled))

const selectedSet = computed(() => {
  const value = model.value

  if (Array.isArray(value))
    return new Set(value)

  return new Set(value === undefined ? [] : [value])
})

const tabbableId = computed(() => {
  const current = activeId.value

  if (current && enabledVisible.value.some(item => item.id === current))
    return current

  return enabledVisible.value.find(item => selectedSet.value.has(item.id))?.id ?? enabledVisible.value[0]?.id
})

function getLeaves(item: MazTreeItem): MazTreeItem[] {
  const children = getChildren(item)

  if (!isFolder(item) || children.length === 0)
    return item.disabled ? [] : [item]

  return children.flatMap(child => getLeaves(child))
}

function getCheckState(item: MazTreeItem) {
  const leaves = getLeaves(item)

  if (leaves.length === 0)
    return 'unchecked'

  const count = leaves.filter(leaf => selectedSet.value.has(leaf.id)).length

  if (count === 0)
    return 'unchecked'

  return count === leaves.length
    ? 'checked'
    : 'mixed'
}

function setExpanded(ids: string[]) {
  expandedModel.value = ids
}

async function expand(item: MazTreeItem) {
  if (expandedSet.value.has(item.id))
    return

  if (item.lazy && load && !(item.id in loaded.value)) {
    if (loading.value.has(item.id))
      return

    loading.value = new Set(loading.value).add(item.id)

    try {
      loaded.value = { ...loaded.value, [item.id]: await load(item) }
    }
    catch (error) {
      emit('load-error', item, error)
      return
    }
    finally {
      const next = new Set(loading.value)
      next.delete(item.id)
      loading.value = next
    }
  }

  setExpanded([...expandedModel.value, item.id])
}

function collapse(item: MazTreeItem) {
  setExpanded(expandedModel.value.filter(id => id !== item.id))
}

function toggleExpanded(item: MazTreeItem) {
  if (!isFolder(item))
    return

  if (expandedSet.value.has(item.id))
    collapse(item)
  else
    void expand(item)
}

function toggleChecked(item: MazTreeItem) {
  const next = new Set(selectedSet.value)
  const checked = getCheckState(item) !== 'checked'
  const affected = [item, ...getAllDescendants(item)].filter(entry => !entry.disabled)

  for (const entry of affected) {
    if (checked)
      next.add(entry.id)
    else
      next.delete(entry.id)
  }

  let parentId = index.value.get(item.id)?.parentId

  while (parentId) {
    const parent = index.value.get(parentId)!.item
    const siblings = getChildren(parent).filter(child => !child.disabled)
    const allChecked = siblings.length > 0 && siblings.every(child => next.has(child.id))

    if (allChecked)
      next.add(parent.id)
    else
      next.delete(parent.id)

    parentId = index.value.get(parentId)!.parentId
  }

  model.value = [...next]
}

function getAllDescendants(item: MazTreeItem): MazTreeItem[] {
  return getChildren(item).flatMap(child => [child, ...getAllDescendants(child)])
}

function select(item: MazTreeItem) {
  if (multiple)
    toggleChecked(item)
  else
    model.value = item.id
}

function activate(item: MazTreeItem) {
  if (item.disabled)
    return

  if (isFolder(item))
    toggleExpanded(item)

  if (!multiple || !isFolder(item))
    select(item)
}

function findElement(id: string) {
  return [...(rootRef.value?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [])].find(element => element.dataset.id === id)
}

async function focusItem(id: string | undefined) {
  if (!id)
    return

  activeId.value = id
  await nextTick()
  findElement(id)?.focus()
}

function setActive(item: MazTreeItem) {
  activeId.value = item.id

  const element = findElement(item.id)

  if (element && document.activeElement !== element)
    element.focus()
}

function isRtl() {
  return !!rootRef.value && globalThis.getComputedStyle(rootRef.value).direction === 'rtl'
}

function moveBy(current: MazTreeItem, step: 1 | -1) {
  const list = enabledVisible.value
  const position = list.findIndex(item => item.id === current.id)

  return list[position + step]
}

function expandSiblings(item: MazTreeItem) {
  const parentId = index.value.get(item.id)?.parentId
  const siblings = parentId ? getChildren(index.value.get(parentId)!.item) : items

  for (const sibling of siblings) {
    if (isFolder(sibling) && !sibling.disabled)
      void expand(sibling)
  }
}

function findByText(current: MazTreeItem) {
  const list = enabledVisible.value
  const repeated = buffer.length > 1 && [...buffer].every(char => char === buffer[0])
  const search = repeated ? buffer[0]! : buffer
  const from = list.findIndex(item => item.id === current.id)
  const start = search.length === 1 ? from + 1 : from

  for (let offset = 0; offset < list.length; offset++) {
    const candidate = list[(start + offset) % list.length]!

    if (candidate.label.toLowerCase().startsWith(search))
      return candidate
  }

  return undefined
}

function typeahead(event: KeyboardEvent, current: MazTreeItem) {
  buffer += event.key.toLowerCase()
  clearTimeout(bufferTimer)
  bufferTimer = setTimeout(() => {
    buffer = ''
  }, TYPEAHEAD_DELAY)

  return findByText(current)
}

function moveInside(current: MazTreeItem, opening: boolean) {
  if (opening) {
    if (!isFolder(current))
      return undefined

    if (!expandedSet.value.has(current.id)) {
      void expand(current)
      return undefined
    }

    return getChildren(current).find(child => !child.disabled)
  }

  if (isFolder(current) && expandedSet.value.has(current.id)) {
    collapse(current)
    return undefined
  }

  const parentId = index.value.get(current.id)?.parentId

  return parentId
    ? index.value.get(parentId)!.item
    : undefined
}

function resolveKey(event: KeyboardEvent, current: MazTreeItem): { handled: boolean, target?: MazTreeItem } {
  const list = enabledVisible.value

  switch (event.key) {
    case 'ArrowDown': {
      return { handled: true, target: moveBy(current, 1) }
    }
    case 'ArrowUp': {
      return { handled: true, target: moveBy(current, -1) }
    }
    case 'ArrowRight':
    case 'ArrowLeft': {
      return { handled: true, target: moveInside(current, (event.key === 'ArrowRight') !== isRtl()) }
    }
    case 'Home': {
      return { handled: true, target: list[0] }
    }
    case 'End': {
      return { handled: true, target: list.at(-1) }
    }
    case 'Enter': {
      activate(current)
      return { handled: true }
    }
    case ' ': {
      select(current)
      return { handled: true }
    }
    case '*': {
      expandSiblings(current)
      return { handled: true }
    }
    default: {
      return event.key.length === 1
        ? { handled: true, target: typeahead(event, current) }
        : { handled: false }
    }
  }
}

function onKeydown(event: KeyboardEvent) {
  const element = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]')
  const current = element?.dataset.id ? index.value.get(element.dataset.id)?.item : undefined

  if (!current || event.ctrlKey || event.metaKey || event.altKey)
    return

  const { handled, target } = resolveKey(event, current)

  if (!handled)
    return

  event.preventDefault()

  if (target)
    void focusItem(target.id)
}

function statusLabel(status: MazTreeStatus) {
  return {
    added: t('tree.added'),
    modified: t('tree.modified'),
    deleted: t('tree.deleted'),
  }[status]
}

onBeforeUnmount(() => clearTimeout(bufferTimer))

provide(MAZ_TREE_KEY, {
  expanded: expandedSet,
  selected: selectedSet,
  loading,
  tabbableId,
  multiple: computed(() => multiple),
  size: computed(() => size),
  color: computed(() => color),
  getChildren,
  isFolder,
  getCheckState,
  toggleExpanded,
  toggleChecked,
  activate,
  setActive,
  statusLabel,
})
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -- the focusable elements are the tree items (roving tabindex) -->
  <ul
    ref="rootRef"
    class="m-tree m-reset-css maz:text-foreground"
    :class="`m-tree--${size}`"
    role="tree"
    :aria-label="label"
    :aria-multiselectable="multiple ? 'true' : undefined"
    @keydown="onKeydown"
  >
    <MazTreeNode
      v-for="(item, position) in items"
      :key="item.id"
      :item="item"
      :level="1"
      :set-size="items.length"
      :position="position + 1"
    >
      <template #item="slotProps">
        <slot name="item" v-bind="slotProps">
          {{ slotProps.item.label }}
        </slot>
      </template>
    </MazTreeNode>
  </ul>
</template>

<style scoped>
.m-tree {
  padding: 0;
  margin: 0;
  font-size: 1rem;
}

.m-tree--mini,
.m-tree--xs {
  font-size: 0.75rem;
}

.m-tree--sm {
  font-size: 0.875rem;
}

.m-tree--lg {
  font-size: 1.125rem;
}

.m-tree--xl {
  font-size: 1.25rem;
}
</style>
