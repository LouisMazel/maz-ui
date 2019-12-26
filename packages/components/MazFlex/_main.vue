<template>
  <div
    class="maz-flex"
    :class="[
      classes
    ]"
  >
    <slot />
  </div>
</template>

<script>
  import { pascalCaseToKebabCase } from '@/utils'

  const classesWithNumber = ['flex1', 'flex25', 'flex33', 'flex50', 'flex75', 'flex100']
  const hasNumberClass = (key) => classesWithNumber.includes(key)

  export default {
    name: 'MazFlex',
    props: {
      flex: { type: Boolean, default: false },
      directionColumn: { type: Boolean, default: false },
      directionColumnReverse: { type: Boolean, default: false },
      directionRow: { type: Boolean, default: false },
      directionRowReverse: { type: Boolean, default: false },
      alignStart: { type: Boolean, default: false },
      alignEnd: { type: Boolean, default: false },
      alignCenter: { type: Boolean, default: false },
      justifyEnd: { type: Boolean, default: false },
      justifyStart: { type: Boolean, default: false },
      justifyCenter: { type: Boolean, default: false },
      spaceBetween: { type: Boolean, default: false },
      spaceAround: { type: Boolean, default: false },
      flex1: { type: Boolean, default: false },
      flex100: { type: Boolean, default: false },
      flex75: { type: Boolean, default: false },
      flex50: { type: Boolean, default: false },
      flex33: { type: Boolean, default: false },
      flex25: { type: Boolean, default: false },
      fill: { type: Boolean, default: false },
      fluid: { type: Boolean, default: false },
      wrap: { type: Boolean, default: false },
      grow: { type: Boolean, default: false },
      fixed: { type: Boolean, default: false }
    },
    computed: {
      classes () {
        return Object.entries(this.$props).map((entry) => {
          const key = entry[0]
          const value = entry[1]
          if (value) {
            return hasNumberClass(key)
              ? `flex-${key.split('flex')[1]}`
              : pascalCaseToKebabCase(key)
          }
        })
      }
    }
  }
</script>
