<template>
  <div class="social-buttons">
    <MazBtn
      v-for="social in socialMedias"
      :key="social.name"
      :title="social.name"
      :href="social.url"
      target="_blank"
      color="transparent"
      rounded
      fab
      size="md"
      no-shadow
    >
      <i :class="`icon-${social.name}`" />
    </MazBtn>
  </div>
</template>

<script>
export default {
  name: 'SocialButtons',
  data () {
    return {
      socialMedias: [
        {
          name: 'github',
          url: 'https://github.com/LouisMazel/maz-ui'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .social-buttons {
    a {
      margin-right: 15px;
      color: var(--maz-primary);
      background-color: var(--maz-bg-color);

      &:hover,
      &:focus {
        background-color: var(--maz-hover-color);
      }

      &:last-child {
        margin-right: 0;
      }

      i {
        font-size: 1.571rem;
      }
    }
  }
</style>
