<template>
  <div class="maz-textarea maz-flex maz-flex-col">
    <label v-if="label" :for="instanceId"> {{ label }} </label>

    <textarea
      :id="instanceId"
      v-bind="$attrs"
      v-model="inputValue"
      :name="name"
      rows="5"
      cols="33"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useInstanceUniqId } from '@package/helpers'
  import { computed } from 'vue'
  import { getCurrentInstance } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: undefined,
    },
    id: { type: String, default: undefined },
    name: { type: String, default: 'MazTextarea' },
    // placeholder: { type: String, default: undefined },
    label: { type: String, default: undefined },
  })

  const emits = defineEmits(['input'])

  const instance = getCurrentInstance()

  const { instanceId } = useInstanceUniqId({
    componentName: 'MazInput',
    instance,
    providedId: props.id,
  })

  const inputValue = computed({
    get: () => props.modelValue,
    set: (value: unknown) => emits('input', value),
  })
</script>
