<template>
  <MazBackDrop
    ref="backdropRef"
    v-bind="$attrs"
    :model-value="modelValue"
    :backdrop-class="['m-drawer', `--${variant}`, backdropClass]"
    :style="{
      '--maz-drawer-size': size,
    }"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div :class="['m-drawer-content-wrap', `--${variant}`]">
        <header
          class="m-drawer-header"
          :class="[$slots['title'] ? 'maz-justify-between' : 'maz-justify-end']"
        >
          <h4 class="maz-text-2xl maz-font-semibold">
            <slot name="title" :close="close"></slot>
          </h4>
          <div v-if="!noCloseBtn" class="maz-flex maz-justify-end">
            <MazBtn size="sm" color="transparent" @click="close">
              <MazIcon :src="XIcon" class="maz-h-5 maz-w-5" />
            </MazBtn>
          </div>
        </header>
        <div class="m-drawer-body">
          <slot :close="close"></slot>
        </div>
      </div>
    </template>
  </MazBackDrop>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue'

  import MazBackDrop from './MazBackDrop.vue'
  import MazBtn from './MazBtn.vue'
  import MazIcon from './MazIcon.vue'
  import XIcon from '@package/icons/x.svg'

  defineProps({
    modelValue: { type: Boolean, default: false },
    noCloseBtn: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    variant: {
      type: String as PropType<'right' | 'top'>,
      default: 'right',
      validator: (value: string) => {
        return ['right', 'top'].includes(value)
      },
    },
    backdropClass: { type: String, default: undefined },
    size: { type: String, default: '30rem' },
  })

  defineEmits(['open', 'close', 'update:model-value'])
</script>
