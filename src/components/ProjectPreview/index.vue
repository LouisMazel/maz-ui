<template>
  <div
    class="project-preview br-8 text-white flex direction-column space-between"
  >
    <div class="project-preview-header brt-8">
      <img
        class="project-preview__img brt-8"
        :src="project.imgUrl"
        :alt="`image illustration ${project.name}`"
      >
      <div
        v-if="project.demoUrl"
        class="layer brt-4 flex align-center justify-center"
      >
        <a
          :href="project.demoUrl"
          target="_blank"
          class="btn btn--primary--outline btn--rounded"
        >
          <i class="material-icons">
            visibility
          </i>
        </a>
      </div>
    </div>
    <ProjectPreviewContent :project="project" />
    <ProjectPreviewFooter :project="project" />
  </div>
</template>

<script>
  import ProjectPreviewFooter from './_subs/ProjectPreviewFooter'
  import ProjectPreviewContent from './_subs/ProjectPreviewContent'
  export default {
    name: 'ProjectPreview',
    components: {
      ProjectPreviewFooter,
      ProjectPreviewContent
    },
    props: {
      project: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .project-preview {
    background-color: $bg-color;
    border: 1px solid $hover-bg-color;
    text-decoration: none;
    transition: all 300ms;
    position: relative;

    &-header {
      overflow: hidden;
      position: relative;

      .layer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        opacity: 0;
        bottom: 7px;
        max-width: 100%;
        min-width: 288px;
        border-radius: 100%;
        background-color: transparent;
        transition: 300ms ease-in-out;
        transition-property: opacity, height;
        transform: scale(.3);
      }

      &:hover {
        img {
          filter: blur(1.5px);
        }

        .layer {
          opacity: 1;
          border-radius: 0;
          transform: scale(1);
          background-color: rgba(black, .3);
        }
      }
    }

    &:hover,
    &:focus {
      background-color: darken($bg-color, 5%);
      transform: translateY(-3px);
      box-shadow: 0 3px 12px darken($bg-color, 10%);
      outline: none;
    }

    &__img {
      max-width: 100%;
      min-width: 288px;
    }
  }

  .is-dark {
    .project-preview {
      background-color: $bg-color-dark-l;
      border-color: $hover-bg-color-dark;

      &:hover,
      &:focus {
        background-color: lighten($bg-color-dark, 5%);
        box-shadow: 0 3px 12px $bg-color-dark;
      }
    }
  }
</style>
