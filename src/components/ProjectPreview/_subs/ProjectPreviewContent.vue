<template>
  <div
    class="project-preview-content flex-1 flex direction-column space-between p-3"
  >
    <div class="project-preview-content__text">
      <h4 class="fs-18 mb-2">
        {{ project.name }}
      </h4>
      <p class="mb-2">
        {{ project.description }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectPreview',
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-preview-content {
    &__text {
      h4 {
        color: $text-color;
      }

      p {
        color: rgba($text-color, .54);
      }
    }
  }

  .maz-is-dark .project-preview-content {
    h4 {
      color: $text-color-dark;
    }

    p {
      color: rgba($text-color-dark, .54);
    }
  }
</style>
