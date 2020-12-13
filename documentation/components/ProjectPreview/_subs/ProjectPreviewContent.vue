<template>
  <div
    class="project-preview-content maz-flex-1 maz-flex maz-direction-column maz-space-between maz-p-3"
  >
    <div class="project-preview-content__text">
      <h3 class="maz-fs-18 maz-mb-2">
        {{ project.name }}
      </h3>
      <p class="maz-mb-2">
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
        color: var(--text-color);
      }

      p {
        color: var(--text-muted);
      }
    }
  }
</style>
