<template>
  <div class="social-buttons">
    <MazBtn
      v-for="social in socialMedias"
      :key="social.name"
      :title="social.name"
      :href="social.url"
      target="_blank"
      color="white"
      rounded
      size="mini"
      no-shadow
    >
      <i :class="`icon-${social.name}`" />
    </MazBtn>
  </div>
</template>

<script>
export default {
  name: 'SocialButtons',
  data() {
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
    color: $primary-color;

    &:last-child {
      margin-right: 0;
    }

    i {
      font-size: 1.571em;
    }
  }
}

.is-dark .social-buttons {
  a {
    background-color: $bg-color-dark;

    &:hover,
    &:focus {
      background-color: $hover-bg-color-dark;
    }
  }
}
</style>
