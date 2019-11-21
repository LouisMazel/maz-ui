<template>
  <div class="maz-loader flex align-center justify-content-center">
    <div class="maz-loader__anim">
      <div /><div /><div /><div /><div /><div /><div /><div />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazLoader'
  }
</script>

<style lang="scss" scoped>
  .maz-loader {
    height: 100px;

    &__anim {
      display: inline-block;
      position: relative;
      width: 64px;
      height: 64px;
      animation: custom-loader-anim 10s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    &__anim div {
      animation: custom-loader-anim 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      transform-origin: 32px 32px;
    }

    &__anim div::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--maz-primary-color);
      margin: -3px 0 0 -3px;
    }

    &__anim div:nth-child(1) {
      animation-delay: -0.036s;
    }

    &__anim div:nth-child(1)::after {
      top: 50px;
      left: 50px;
    }

    &__anim div:nth-child(2) {
      animation-delay: -0.072s;
    }

    &__anim div:nth-child(2)::after {
      top: 54px;
      left: 45px;
    }

    &__anim div:nth-child(3) {
      animation-delay: -0.108s;
    }

    &__anim div:nth-child(3)::after {
      top: 57px;
      left: 39px;
    }

    &__anim div:nth-child(4) {
      animation-delay: -0.144s;
    }

    &__anim div:nth-child(4)::after {
      top: 58px;
      left: 32px;
    }

    &__anim div:nth-child(5) {
      animation-delay: -0.18s;
    }

    &__anim div:nth-child(5)::after {
      top: 57px;
      left: 25px;
    }

    &__anim div:nth-child(6) {
      animation-delay: -0.216s;
    }

    &__anim div:nth-child(6)::after {
      top: 54px;
      left: 19px;
    }

    &__anim div:nth-child(7) {
      animation-delay: -0.252s;
    }

    &__anim div:nth-child(7)::after {
      top: 50px;
      left: 14px;
    }

    &__anim div:nth-child(8) {
      animation-delay: -0.288s;
    }

    &__anim div:nth-child(8)::after {
      top: 45px;
      left: 10px;
    }

    @keyframes custom-loader-anim {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
