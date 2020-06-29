<template>
  <MazFlex
    flex
    direction-column
    flex1
    class="made-with-maz-ui"
  >
    <MazFlex
      flex1
      direction-column
    >
      <h2 class="maz-text-center maz-my-4">
        Projects Made With Mazel UI
      </h2>
      <div class="maz-container made-with-maz-ui__projects-list maz-flex maz-pt-2 maz-pb-5">
        <ProjectPreview
          v-for="(project, i) in projects"
          :key="`project-${i}`"
          :project="project"
          class="made-with-maz-ui__projects-list__item"
        />
      </div>
    </MazFlex>
    <NavFooter />
  </MazFlex>
</template>

<script>
import NavFooter from '~/components/NavFooter'
import ProjectPreview from '~/components/ProjectPreview'

import meta from '~/config/meta'

export default {
  name: 'MadeWithMazUi',
  components: {
    NavFooter,
    ProjectPreview
  },
  head () {
    return {
      title: 'Made with Maz UI',
      meta: meta({
        description: 'Discover some projects realized with the Maz UI components for Vue.JS and Nuxt.JS',
        title: 'Made with Maz UI | Maz UI'
      })
    }
  },
  asyncData () {
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
        },
        {
          name: 'Jellynote.com',
          description:
            'French startup: Help you to learn music easier',
          imgUrl: require('@/assets/img/projects/jellynote.jpg'),
          demoUrl: 'https://www.jellynote.com/'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .made-with-maz-ui {
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
    .made-with-maz-ui {
      color: $text-color-dark;
    }
  }
</style>
