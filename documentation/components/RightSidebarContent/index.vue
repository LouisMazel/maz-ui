<template>
  <div class="right-sidebar-content maz-p-3">
    <div class="maz-flex maz-justify-end">
      <MazBtn
        fab
        @click="$emit('close')"
      >
        <i class="material-icons maz-fs-20 maz-flex maz-flex-center">
          close
        </i>
      </MazBtn>
    </div>
    <MdRenderer :file-name="currentComponent" />
  </div>
</template>

<script>
import MdRenderer from '@/components/MdRenderer'

const toPascalCase = (string) => {
  return `${string}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), s => s.toUpperCase())
}

export default {
  name: 'RightSidebarContent',
  components: {
    MdRenderer
  },
  computed: {
    currentComponent () {
      return toPascalCase(this.$route.name.substring(14))
    }
  }
}
</script>

<style lang="scss" scoped>
  .right-sidebar-content {
    overflow-y: auto;
  }
</style>
