<template>
  <div class="project-preview-content flex-1 flex direction-column space-between p-3">
    <div class="project-preview-content__text">
      <h4 class="fs-18 mb-2">
        {{ project.name }}
      </h4>
      <p class="mb-2 text-white-muted">
        {{ project.description }}
      </p>
    </div>
    <!-- <Keywords
      :keywords="project.keywords"
    /> -->
  </div>
</template>

<script>
  // import Keywords from '@/components/Keywords'

  export default {
    name: 'ProjectPreview',
    // components: {
    //   Keywords
    // },
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
        color: $text-color-dark;
      }

      p {
        color: rgba($text-color-dark, 0.54);
      }
    }
  }
</style>
