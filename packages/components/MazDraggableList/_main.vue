<template>
  <div class="maz-draggable-list mb-3">
    <draggable
      v-model="items"
      v-bind="dragOptions"
      group="modules"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group
        type="transition"
        tag="div"
        :name="!drag ? 'flip-list' : null"
      >
        <div
          v-for="(item, i) in value"
          :key="`${itemKey ? item[itemKey] : Object.values(item)[0]}-${i}`"
          class="maz-draggable-list__item flex align-center space-between"
        >
          <!-- Default item displayed in list -->
          <slot
            :item="item"
            :index="i"
            tag="div"
          >
            <!-- `<span>{{ item }}</span>` -->
            <span>
              {{ item }}
            </span>
          </slot>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  /**
   * > Smart Draggable List
   */

  export default {
    name: 'MazDraggableList',
    components: { draggable },
    props: {
      // Must be an `Array` (use `v-model`)
      value: { type: Array, required: true },
      // is the item's key to build le list (must be different for each item)
      itemKey: { type: String, default: null }
    },
    data () {
      return {
        drag: false,
        dragOptions: {
          animation: 200,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost'
        }
      }
    },
    computed: {
      items: {
        get () {
          return this.value
        },
        set (value) {
          // update the v-model
          // @arg list updated
          this.$emit('input', value)
        }
      }
    }
  }
</script>
