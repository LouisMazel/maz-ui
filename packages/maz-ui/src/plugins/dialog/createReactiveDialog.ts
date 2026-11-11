import type { Component, MaybeRefOrGetter } from 'vue'
import type { MazDialogConfirmProps } from '../../components/MazDialogConfirm.vue'
import { computed, defineComponent, h, isReactive, isRef, ref, toValue } from 'vue'
import MazDialogConfirm from '../../components/MazDialogConfirm.vue'

export interface ReactiveDialogConfig {
  props: Record<string, unknown>
  content?: Component
  contentProps?: MaybeRefOrGetter<Record<string, unknown>>
}

export function isReactiveSource(value: unknown): boolean {
  return isRef(value) || isReactive(value) || typeof value === 'function'
}

export function createReactiveDialog({ props: allProps, content, contentProps }: ReactiveDialogConfig) {
  const props = { ...allProps }
  delete props.content
  delete props.contentProps

  type ButtonProps = MazDialogConfirmProps['acceptProps']

  return defineComponent({
    name: 'MazDialogConfirmReactive',
    setup(_, { expose }) {
      const dialog = ref<{ close?: () => void, isActive?: boolean }>()

      expose({
        close: () => dialog.value?.close?.(),
        isActive: computed(() => !!dialog.value?.isActive),
      })

      return () => h(
        MazDialogConfirm,
        {
          ...props,
          acceptProps: toValue(props.acceptProps as MaybeRefOrGetter<ButtonProps>),
          rejectProps: toValue(props.rejectProps as MaybeRefOrGetter<ButtonProps>),
          ref: dialog,
        } as unknown as MazDialogConfirmProps,
        content
          ? {
              default: (slotProps: Record<string, unknown>) => h(content, {
                ...toValue(contentProps),
                ...slotProps,
              }),
            }
          : undefined,
      )
    },
  })
}
