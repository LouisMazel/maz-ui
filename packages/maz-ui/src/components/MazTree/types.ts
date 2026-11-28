import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { MazIconValue } from '../MazIcon.vue'
import type { MazColor, MazColorOrFree, MazSize } from '../types.ts'

export type MazTreeStatus = 'added' | 'modified' | 'deleted'

export interface MazTreeItem {
  /**
   * Unique identifier of the item, used by `v-model` and `v-model:expanded`
   */
  id: string
  /**
   * Text of the item, also used by the typeahead of the keyboard
   */
  label: string
  /**
   * Icon of the item (name, component or URL, see `MazIcon`). Folders and files have their own by default
   */
  icon?: MazIconValue
  /**
   * The sub-items. An item with `children` (even empty) is a folder
   */
  children?: MazTreeItem[]
  /**
   * The children are loaded when the folder opens, with the `load` prop of `MazTree`
   * @default false
   */
  lazy?: boolean
  /**
   * The item cannot be selected nor focused
   * @default false
   */
  disabled?: boolean
  /**
   * Mark shown at the end of the row (`added`, `modified`, `deleted`)
   */
  status?: MazTreeStatus
}

export type MazTreeCheckState = 'checked' | 'mixed' | 'unchecked'

export interface MazTreeContext {
  expanded: ComputedRef<Set<string>>
  selected: ComputedRef<Set<string>>
  loading: Ref<Set<string>>
  tabbableId: ComputedRef<string | undefined>
  multiple: ComputedRef<boolean>
  size: ComputedRef<MazSize>
  color: ComputedRef<MazColorOrFree<Exclude<MazColor, 'transparent'>>>
  getChildren: (item: MazTreeItem) => MazTreeItem[]
  isFolder: (item: MazTreeItem) => boolean
  getCheckState: (item: MazTreeItem) => MazTreeCheckState
  toggleExpanded: (item: MazTreeItem) => void
  toggleChecked: (item: MazTreeItem) => void
  activate: (item: MazTreeItem) => void
  setActive: (item: MazTreeItem) => void
  statusLabel: (status: MazTreeStatus) => string
}

export const MAZ_TREE_KEY: InjectionKey<MazTreeContext> = Symbol('MazTree')
