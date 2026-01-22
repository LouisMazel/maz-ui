<script setup lang="ts">
import { MazGithub } from '@maz-ui/icons'
import { truthyFilter } from '@maz-ui/utils'
import { MazAvatar, MazCardSpotlight } from 'maz-ui/components'

const {
  repo,
  creators,
  maintainers,
  ignored = ['dependabot[bot]'],
  links,
} = defineProps<{
  repo: string
  creators?: string[]
  maintainers?: string[]
  ignored?: string[]
  links?: { username: string, link: string, type: 'github' | 'twitter' }[]
}>()

async function fetchContributors() {
  try {
    const response = await fetch(`https://ungh.cc/repos/${repo}/contributors`)

    if (!response.ok) {
      throw new Error(`Error while fetching contributors: ${response.status}`)
    }

    const baseContributors = await response.json() as { contributors: { id: number, username: string, contributions: number }[] }

    const contributors = await Promise.all(baseContributors.contributors.map(async (contributor) => {
      if (ignored?.includes(contributor?.username)) {
        return null
      }

      const userResponse = await fetch(`https://ungh.cc/users/find/${contributor.username}`)
      const isCreator = creators?.includes(contributor.username)
      const isMaintainer = maintainers?.includes(contributor.username)
      const twitterLink = links?.find(link => link.username === contributor.username && link.type === 'twitter')?.link
      const githubLink = links?.find(link => link.username === contributor.username && link.type === 'github')?.link || `https://github.com/${contributor.username}`

      if (!userResponse.ok) {
        console.error(`Error while fetching user: ${userResponse.status}`)

        return {
          ...contributor,
          creator: isCreator,
          maintainer: isMaintainer,
          avatar: null,
          twitterLink,
          githubLink,
        }
      }

      const user = await userResponse.json() as { user: { id: number, username: string, avatar: string } }

      return {
        ...contributor,
        creator: isCreator,
        maintainer: isMaintainer,
        avatar: user.user.avatar,
        twitterLink,
        githubLink,
      }
    }))

    return contributors.filter(truthyFilter)
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error(errorMessage)

    return null
  }
}

const contributors = (await fetchContributors())?.filter(contributor => !ignored?.includes(contributor.username))
</script>

<template>
  <div>
    <h2>
      Contributors
    </h2>

    <div class="contributors vp-raw">
      <MazCardSpotlight v-for="{ id, username, avatar, contributions, creator, maintainer, twitterLink, githubLink } in contributors" :key="id" :color="creator ? 'primary' : maintainer ? 'secondary' : 'info'" content-class="contributor">
        <MazAvatar
          v-if="avatar"
          style="--maz-border-width: 1px"
          :src="avatar"
          :caption="username"
          :alt="username"
          :href="githubLink"
          target="_blank"
          bordered
        />

        <p class="name">
          {{ username }}
        </p>

        <p v-if="creator" class="title --creator">
          Creator
        </p>
        <p v-if="maintainer" class="title --maintainer">
          Maintainer
        </p>
        <p v-if="!(creator || maintainer)" class="title --contributor">
          Contributor
        </p>

        <p class="contributions">
          {{ contributions }} contributions
        </p>

        <div class="links">
          <a :href="githubLink" target="_blank">
            <MazGithub class="github-icon" />
          </a>

          <a v-if="twitterLink" :href="twitterLink" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M357.2 48L427.8 48 273.6 224.2 455 464 313 464 201.7 318.6 74.5 464 3.8 464 168.7 275.5-5.2 48 140.4 48 240.9 180.9 357.2 48zM332.4 421.8l39.1 0-252.4-333.8-42 0 255.3 333.8z" fill="currentColor" />
            </svg>
          </a>
        </div>
      </MazCardSpotlight>
    </div>
  </div>
</template>

<style lang="css" scoped>
.contributors {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15.625rem, 1fr));
  justify-content: center;
  gap: 1rem;

  :deep(.contributor) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 0.25rem;
  }

  .name {
    padding-top: 0.5rem;
    font-weight: bold;
    line-height: 1.5rem;
    font-size: 1rem;
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.02em;
    overflow-wrap: break-word;
  }

  .title {
    margin: 0;
    font-weight: 500;
    line-height: 1.25rem;
    font-size: 0.875rem;
    overflow-wrap: break-word;

    &.--creator {
      color: hsl(var(--maz-primary));
    }

    &.--maintainer {
      color: hsl(var(--maz-secondary));
    }

    &.--contributor {
      color: hsl(var(--maz-info));
    }
  }

  .contributions {
    margin: 0;
    font-weight: 500;
    color: var(--vp-c-text-2);
    line-height: 1.25rem;
    font-size: 0.7875rem;
    overflow-wrap: break-word;
  }

  .links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    color: var(--vp-c-text-2);

    a {
      transition: color 0.2s ease-in-out;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 100%;
        height: 100%;
      }

      &:hover {
        color: hsl(var(--maz-primary));
      }
    }
  }
}
</style>
