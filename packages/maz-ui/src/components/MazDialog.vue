<script lang="ts" setup>
import type {
  ClassValue,
  ComponentPublicInstance,
  StyleValue,
} from 'vue'
import type { MazBackdropProps } from './MazBackdrop.vue'

import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import {
  computed,
  defineAsyncComponent,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import MazBackdrop from './MazBackdrop.vue'

defineOptions({
  name: 'MazDialog',
  inheritAttrs: false,
})

const {
  modelValue,
  maxWidth = 'var(--maz-dialog-max-width, 38rem)',
  minWidth = 'var(--maz-dialog-min-width, 32rem)',
  scrollable,
  headerDivider,
  contentPadding = true,
  closeOnEscape = true,
  align = 'center',
  animated = true,
  origin,
  ...backdropProps
} = defineProps<DialogProps & MazBackdropProps>()

const emit = defineEmits<{
  /** emitted when modal is open */
  'open': [value: void]
  /** emitted when modal is close */
  'close': [value: void]
  /** emitted when modal is open or close */
  'update:model-value': [value: boolean]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

export interface DialogProps {
  /** @model Modal's model value */
  modelValue?: boolean
  /** Title of the modal in header */
  title?: string
  /** Remove the close button in header */
  hideCloseButton?: boolean
  /**
   * Modal's max-width.
   * @default Theme preset `components.dialog.max-width` via `var(--maz-dialog-max-width, 38rem)`
   */
  maxWidth?: string
  /**
   * Modal's min-width.
   * @default Theme preset `components.dialog.min-width` via `var(--maz-dialog-min-width, 32rem)`
   */
  minWidth?: string
  /**  Modal's content becomes scrollable - warning: a overflow is applied */
  scrollable?: boolean
  /** Persistent dialog (not closable by clicking outside and remove close button) */
  persistent?: boolean
  /** Add a divider under the header (always present with `scrollable`) */
  headerDivider?: boolean
  /**
   * Add horizontal and bottom padding around the content of the dialog, set `false` for full-bleed content (list, image, table)
   * @default true
   */
  contentPadding?: boolean
}

export interface MazDialogTriggerSlotProps {
  /** Open the dialog */
  open: () => void
  /** Close the dialog */
  close: () => void
  /** `true` while the dialog is open */
  isOpen: boolean
}

export interface MazDialogProps extends DialogProps, MazBackdropProps {}

const attrs = useAttrs()

const backdrop = ref<ComponentPublicInstance<typeof MazBackdrop>>()

const isOpen = ref(!!modelValue)

watch(() => modelValue, (value) => {
  isOpen.value = !!value
})

function open() {
  if (isOpen.value)
    return

  isOpen.value = true
  emit('update:model-value', true)
}

function close() {
  return backdrop.value?.close?.()
}

function onUpdateModelValue(value: boolean) {
  isOpen.value = value
  emit('update:model-value', value)
}

defineExpose({
  /**
   * Close the dialog
   * @description This is used to close the dialog
   */
  close,
  /**
   * Open the dialog
   * @description This is used to open the dialog without `v-model`
   */
  open,
})

const triggerWrapper = ref<HTMLElement>()

const growOrigin = computed(() => origin ?? triggerWrapper.value?.firstElementChild ?? undefined)

const isBottomAligned = computed(() => align === 'end' || align === 'none')

const wrapperAttrs = computed<{
  class?: ClassValue
  style: StyleValue
}>(() => ({
  class: attrs.class as ClassValue,
  style: attrs.style as StyleValue,
}))

const dialogContent = ref<HTMLElement>()

const slots = useSlots()
const hasFooter = computed(() => !!slots.footer)

const { t } = useTranslations()

const instanceId = useInstanceUniqId({ componentName: 'MazDialog' })
const titleId = computed(() => `${instanceId.value}-title`)
const descriptionId = computed(() => `${instanceId.value}-description`)
const hasTitle = computed(() => hasSlotContent(slots.title) || !!backdropProps.title)

if (scrollable) {
  watch(() => modelValue, async (newVal) => {
    await nextTick()
    if (newVal && dialogContent.value) {
      setTimeout(() => {
        dialogContent.value?.scrollTo({ top: 0, behavior: 'instant' })
      }, 0)
    }
  })
}
</script>

<template>
  <div
    v-if="slots.trigger"
    ref="triggerWrapper"
    class="m-dialog-trigger maz:contents"
  >
    <!--
      @slot Element that opens the dialog: the dialog grows out of it and goes back into it
        @binding {Function} open open the dialog
        @binding {Function} close close the dialog
        @binding {boolean} isOpen true while the dialog is open
    -->
    <slot
      name="trigger"
      :open
      :close
      :is-open="isOpen"
    />
  </div>
  <MazBackdrop
    v-bind="backdropProps"
    ref="backdrop"
    v-slot="{ close: closeDialog }"
    :model-value="isOpen"
    :align
    :animated
    :origin="growOrigin"
    grow-from-origin
    transition-name="modal-anim"
    :close-on-escape="closeOnEscape"
    content-padding
    :persistent
    justify="center"
    variant="dialog"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="onUpdateModelValue"
  >
    <div
      class="m-dialog maz:flex maz:max-w-full maz:min-w-full maz:origin-center maz:flex-col maz:rounded-xl maz:bg-container maz:text-foreground maz:shadow-elevation maz:tab-s:my-8 maz:dark:border maz:dark:border-divider"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="backdropProps.ariaLabelledby ?? (hasTitle ? titleId : undefined)"
      :aria-describedby="backdropProps.ariaDescribedby ?? descriptionId"
      :style="[{ '--max-width': maxWidth, '--min-width': minWidth }]"
      :class="{
        '--scrollable': scrollable,
        'maz:my-0 maz:max-h-[calc(100dvh-2rem)] maz:tab-s:max-h-[95dvh]': scrollable,
        '--align-bottom maz:rounded-b-none maz:tab-s:rounded-b-xl': isBottomAligned,
      }"
      v-bind="wrapperAttrs"
    >
      <!--
        @slot Header slot
          @binding {Function} close close function
      -->
      <slot name="header" :close="closeDialog">
        <div
          class="m-dialog-header maz:flex maz:items-center maz:py-3 maz:ps-6 maz:pe-3"
          :class="[
            hasSlotContent(slots.title) || title ? '--has-title maz:justify-between' : 'maz:justify-end',
            { '--divider maz:border-b maz:border-divider': headerDivider && !scrollable },
          ]"
        >
          <h2
            v-if="hasSlotContent(slots.title) || title"
            :id="titleId"
            class="m-dialog-title maz:my-0 maz:text-title-3"
          >
            <!--
                @slot Title slot in the header
              -->
            <slot name="title">
              {{ title }}
            </slot>
          </h2>

          <MazBtn
            v-if="!hideCloseButton && !persistent"
            color="transparent"
            size="sm"
            :icon="MazXMark"
            :aria-label="t('aria.close')"
            @click="closeDialog"
          />
        </div>
      </slot>
      <div
        :id="descriptionId"
        ref="dialogContent"
        class="m-dialog-content maz:flex-1"
        :class="{
          '--bottom-padding': !hasFooter,
          'maz:px-6': contentPadding,
          'maz:pb-4': contentPadding && !hasFooter,
          'maz:scrollbar-themed maz:overflow-auto maz:overscroll-contain maz:border-t maz:border-divider': scrollable,
          'maz:py-4': scrollable && contentPadding,
          'maz:pt-4': contentPadding && headerDivider && !scrollable,
          'maz:border-b': scrollable && hasFooter,
        }"
      >
        <!--
            @slot Default content
              @binding {Function} close close function
          -->
        <slot :close="closeDialog" />
      </div>
      <div v-if="hasFooter" class="m-dialog-footer maz:flex maz:items-center maz:justify-end maz:px-6 maz:py-4">
        <!--
            @slot Footer slot
              @binding {Function} close close function
          -->
        <slot name="footer" :close="closeDialog" />
      </div>
    </div>
  </MazBackdrop>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-dialog {
  @variant tab-s {
    max-inline-size: var(--max-width);
    min-inline-size: var(--min-width);
  }
}
</style>
