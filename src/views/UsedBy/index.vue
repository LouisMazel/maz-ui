<template>
  <MazFlex
    flex
    direction-column
    flex1
    class="used-by"
  >
    <MazFlex
      flex1
    >
      <h2 class="text-center my-4">
        Projects Made With Mazel UI
      </h2>
      <div class="container used-by__projects-list flex alig-center py-5">
        <ProjectPreview
          v-for="(project, i) in projects"
          :key="`project-${i}`"
          :project="project"
          class="used-by__projects-list__item"
        />
      </div>
    </MazFlex>
    <NavFooter />
  </MazFlex>
</template>

<script>
  import NavFooter from '@/components/NavFooter'
  import ProjectPreview from '@/components/ProjectPreview'

  export default {
    name: 'UsedBy',
    components: {
      NavFooter,
      ProjectPreview
    },
    data () {
      return {
        projects: [
          {
            name: 'Vue Smart List UI',
            description: 'An intelligent interface for displaying a list of data and performing filters, sorting and searching on it. Also to display the details of the data.',
            githubUrl: 'https://github.com/LouisMazel/vue-smart-list-ui',
            imgUrl: require('@/assets/img/projects/vue-smart-list-ui.png'),
            demoUrl: 'https://louismazel.github.io/vue-smart-list-ui/'
          },
          {
            name: 'Freelance Personnal Website',
            description: 'Freelance Personnal Website',
            imgUrl: require('@/assets/img/projects/loicmazuel.png'),
            demoUrl: 'https://www.loicmazuel.com/'
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .used-by {
    color: $text-color;

    .used-by__projects-list__item {
      margin: 0 20px;
    }
  }

  .is-dark {
    .used-by {
      color: $text-color-dark;
    }
  }
</style>
