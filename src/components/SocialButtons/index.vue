<template>
  <div class="social-buttons">
    <a
      v-for="social in socialMedias"
      :key="social.name"
      :title="social.name"
      :href="social.url"
      target="_blank"
      class="btn btn--white btn--rounded flex align-center"
    >
      <i :class="`icon-${social.name}`" />
    </a>
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
            url: 'https://github.com/LouisMazel/vue-mazel-ui'
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
      color: var(--maz-primary-color);

      &:last-child {
        margin-right: 0;
      }

      i {
        font-size: 22px;
      }
    }
  }
</style>
