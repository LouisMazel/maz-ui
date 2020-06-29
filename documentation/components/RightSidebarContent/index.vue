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
import { toPascalCase } from '~/utils'

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
