<template>
  <div class="maz-draggable-list maz-mb-3">
    <Draggable
      v-model="items"
      v-bind="dragOptions"
      group="modules"
      @start="drag = true"
      @end="drag = false"
    >
      <TransitionGroup type="transition" tag="div" :name="!drag ? 'maz-flip-list' : undefined">
        <div
          v-for="(item, i) in modelValue"
          :key="`${itemKey ? item[itemKey] : Object.values(item)[0]}`"
          class="maz-draggable-list__item maz-align-center maz-space-between maz-flex"
        >
          <!-- Default item displayed in list -->
          <slot :item="item" :index="i" tag="div">
            <!-- `<span>{{ item }}</span>` -->
            <span>
              {{ item }}
            </span>
          </slot>
        </div>
      </TransitionGroup>
    </Draggable>
  </div>
</template>

<script lang="ts">
  import type { PropType } from 'vue'
  import { computed, defineComponent, ref } from 'vue'
  import Draggable from 'vuedraggable'

  /**
   * > Smart Draggable List
   */

  export default defineComponent({
    name: 'MazDraggableList',
    components: { Draggable },
    props: {
      // Must be an `Array` (use `v-model`)
      modelValue: { type: Array as PropType<any[]>, required: true },
      // is the item's key to build le list (must be different for each item)
      itemKey: { type: String, default: null },
    },
    emits: ['update:model-value'],
    setup(props, { emit }) {
      const items = computed({
        get() {
          return props.modelValue
        },
        set(value) {
          // update the v-model
          // @arg list updated
          emit('update:model-value', value)
        },
      })

      const drag = ref(false)
      const dragOptions = ref({
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      })

      return {
        items,
        drag,
        dragOptions,
      }
    },
  })
</script>
