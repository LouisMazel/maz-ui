<template>
  <div class="right-sidebar-content p-3">
    <div class="flex justify-end">
      <MazBtn
        fab
        @click="$emit('close')"
      >
        <i class="material-icons fs-20 flex flex-center">
          close
        </i>
      </MazBtn>
    </div>
    <MdRenderer :file-name="currentComponent" />
  </div>
</template>

<script>
  import MdRenderer from '@/components/MdRenderer'

  export default {
    name: 'RightSidebarContent',
    components: {
      MdRenderer
    },
    computed: {
      currentComponent () {
        return this.$route.name.slice(0, -3)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .right-sidebar-content {
    overflow-y: auto;
  }
</style>
