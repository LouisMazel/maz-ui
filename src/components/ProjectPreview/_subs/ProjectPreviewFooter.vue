<template>
  <div class="project-preview-footer p-3 flex justify-end">
    <a
      v-if="project.githubUrl"
      :href="project.githubUrl"
      class="btn btn--white--outline btn--white flex align-center"
      target="_blank"
    >
      GITHUB
    </a>
    <a
      v-if="project.npmUrl"
      :href="project.npmUrl"
      class="btn btn--danger--outline btn--npm ml-3"
      target="_blank"
    >
      <svg viewBox="0 0 780 250">
        <path
          fill="#231F20"
          d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z"
        />
      </svg>
    </a>
    <a
      v-if="project.demoUrl"
      :href="project.demoUrl"
      class="btn btn--primary--outline ml-3"
      target="_blank"
    >
      SHOW PROJECT
    </a>
  </div>
</template>

<script>
  export default {
    name: 'ProjectPreviewFooter',
    props: {
      project: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .project-preview-footer {
    border-top: 1px solid $hover-bg-color;

    .btn--npm svg {
      width: 35px;

      path {
        fill: $danger-color;
      }
    }

    .btn--white:hover {
      color: $bg-color-dark;
    }
  }

  .is-dark .project-preview-footer {
    border-top: 1px solid $bg-color-dark;
  }
</style>
