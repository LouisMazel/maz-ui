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
      <h2 class="maz-text-center maz-mt-6">
        Projects Made With Maz UI
      </h2>
      <div class="maz-container made-with-maz-ui__projects-list maz-py-6">
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
        },
        {
          name: 'Whitebird.immo',
          description:
            'French startup: Property manager and trustee',
          imgUrl: require('@/assets/img/projects/whitebird.jpg'),
          demoUrl: 'https://www.whitebird.immo/'
        },
        {
          name: 'Vue Smart List UI',
          description:
            'An intelligent interface for displaying a list of data and performing filters, sorting and searching on it. Also to display the details of the data.',
          githubUrl: 'https://github.com/LouisMazel/vue-smart-list-ui',
          imgUrl: require('@/assets/img/projects/vue-smart-list-ui.png'),
          demoUrl: 'https://louismazel.github.io/vue-smart-list-ui/'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .made-with-maz-ui {
    color: var(--maz-text-color);

    @media only screen and (max-width: $breakpoint-laptop-s) {
      &__main {
        flex-direction: column-reverse;
      }
    }

    &__projects-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 40px;

      @media only screen and (max-width: $breakpoint-laptop-s) {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
</style>
