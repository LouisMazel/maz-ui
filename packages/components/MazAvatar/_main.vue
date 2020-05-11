<template>
  <div
    class="maz-avatar maz-flex maz-flex-center maz-flex-fixed"
    :style="[pictureSize]"
    :class="{
      'has-link': !!url,
      'maz-elevation': !noElevation,
      'bordered': bordered,
      editable,
      square
    }"
  >
    <a
      v-if="url"
      :href="url"
      :target="target"
      class="maz-avatar__avatar-link maz-flex maz-flex-center"
    >
      <img
        :src="picturePath"
        alt="creator profile picture"
        class="maz-avatar__picture"
      >
    </a>
    <img
      v-else
      :src="picturePath"
      alt="creator profile picture"
      class="maz-avatar__picture"
      @click="editable ? $emit('edit', $event) : null"
    >
    <button
      v-if="editable"
      type="button"
      class="maz-avatar__editable-layer maz-flex maz-flex-center"
      @click="$emit('edit', $event)"
    >
      <i
        class="material-icons"
        aria-hidden="true"
      >
        edit
      </i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MazAvatar',
  props: {
    // url or path of the image
    src: { type: String, default: null },
    // url or path to link another page
    url: { type: String, default: null },
    // target attribute of link (if url is provide)
    target: { type: String, default: '_self' },
    // size of avatar
    size: { type: Number, default: 80 },
    // add border around the avatar
    bordered: { type: Boolean, default: false },
    // add an edit layer & emit `edit` event on click
    editable: { type: Boolean, default: false },
    // Make the avatar square
    square: { type: Boolean, default: false },
    // Remove the shadow behind the avatar
    noElevation: { type: Boolean, default: false }
  },
  computed: {
    picturePath () {
      return this.src || require('./svg/default-profile.svg')
    },
    pictureSize () {
      const { size } = this
      return {
        width: `${size}px`,
        height: `${size}px`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-avatar {
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    position: relative;

    img {
      transition: all .4s ease-in-out;
    }

    &__avatar-link {
      height: 100%;
    }

    $this: &;

    &.editable {
      #{$this}__editable-layer {
        position: absolute;
        opacity: 0;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        border: none;
        outline: none;
        border-radius: 100%;
        background-color: transparent;
        transition: all .3s ease-in-out;
        transform: scale(0);
        cursor: pointer;

        i {
          color: white;
        }
      }

      &:hover {
        img {
          filter: blur(1.5px);
        }

        #{$this}__editable-layer {
          opacity: 1;
          transform: scale(1);
          background-color: rgba($primary-color, .4);
        }
      }
    }

    &.bordered {
      border: $border-width * 2 solid $border-color;
    }

    &.has-link {
      cursor: pointer;
    }

    &__picture {
      vertical-align: middle;
      height: 100%;
    }

    &.square {
      border-radius: $border-radius;
    }
  }
</style>
