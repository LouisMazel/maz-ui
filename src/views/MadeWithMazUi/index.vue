<template>
  <MazFlex
    flex
    direction-column
    flex1
    class="used-by">
    <MazFlex
      flex1
      direction-column
    >
      <h2 class="maz-text-center maz-my-4">
        Projects Made With Mazel UI
      </h2>
      <div class="maz-container used-by__projects-list maz-flex maz-pt-2 maz-pb-5">
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
          description:
            'An intelligent interface for displaying a list of data and performing filters, sorting and searching on it. Also to display the details of the data.',
          githubUrl: 'https://github.com/LouisMazel/vue-smart-list-ui',
          imgUrl: require('@/assets/img/projects/vue-smart-list-ui.png'),
          demoUrl: 'https://louismazel.github.io/vue-smart-list-ui/'
        },
        {
          name: 'Freelance Personnal Website',
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

    @media only screen and (max-width: $breakpoint-laptop-s) {
      &__main {
        flex-direction: column-reverse;
      }
    }

    &__projects-list {
      @media only screen and (max-width: $breakpoint-laptop-s) {
        flex-direction: column;
      }

      &__item {
        margin-right: 40px;

        @media only screen and (max-width: $breakpoint-laptop-s) {
          margin-right: 0;
          margin-bottom: 40px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .maz-is-dark {
    .used-by {
      color: $text-color-dark;
    }
  }
</style>
