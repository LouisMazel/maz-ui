<template>
  <div
    class="project-preview maz-border-radius maz-text-white maz-flex maz-direction-column maz-space-between maz-overflow-hidden maz-border maz-border-solid maz-border-color"
  >
    <div class="project-preview-header maz-border-top-radius">
      <img
        class="project-preview__img maz-border-top-radius"
        :src="project.imgUrl"
        :alt="`image illustration ${project.name}`"
      />
      <div
        v-if="project.demoUrl"
        class="layer maz-flex maz-align-center maz-justify-center"
      >
        <a
          :href="project.demoUrl"
          target="_blank"
          class="maz-btn maz-btn--primary--outline maz-btn--rounded"
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
      transform: translateY(-3px);
      box-shadow: 0 3px 12px darken($bg-color, 10%);
      outline: none;
    }

    &__img {
      max-width: 100%;
      min-width: 288px;
    }
  }

  .maz-is-dark {
    .project-preview {
      background-color: $bg-color-dark-l;

      &:hover,
      &:focus {
        background-color: lighten($bg-color-dark, 5%);
        box-shadow: 0 3px 12px $bg-color-dark;
      }
    }
  }
</style>
