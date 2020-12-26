<template>
  <MazCard
    class="project-preview"
    :images="[{ slug: project.imgUrl, alt: `image illustration ${project.name}` }]"
    zoom
    width="100%"
    :gallery-height="300"
  >
    <!-- <ProjectPreviewContent :project="project" /> -->
    <template #title>
      <p class="maz-mb-2">
        {{ project.name }}
      </p>
    </template>
    <template #content>
      <p class="maz-mb-2">
        {{ project.description }}
      </p>
    </template>
    <template #footer>
      <ProjectPreviewFooter :project="project" />
    </template>
  </MazCard>
</template>

<script>
import ProjectPreviewFooter from './_subs/ProjectPreviewFooter'
export default {
  name: 'ProjectPreview',
  components: {
    ProjectPreviewFooter
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>
