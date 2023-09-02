<template>
  <nav role="navigation" class="maz-nav-bar">
    <ul class="maz-nav-bar__list">
      <li
        v-for="({ label, link, route }, i) in items"
        :key="i"
        class="maz-nav-bar__list__item"
      >
        <Component
          :is="route ? 'RouterLink' : 'a'"
          class="maz-nav-bar__list__item__link"
          :class="{ 'maz-nav-bar__list__item__link--active': currentTab === i }"
          :to="route ? { name: route } : undefined"
          :href="link"
          @click="currentTab = i"
        >
          <svg
            class="maz-nav-bar__list__item__link__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <title>Skull</title>
            <path
              d="M448 225.64v99a64 64 0 01-40.23 59.42l-23.68 9.47A32 32 0 00364.6 417l-10 50.14A16 16 0 01338.88 480H173.12a16 16 0 01-15.69-12.86L147.4 417a32 32 0 00-19.49-23.44l-23.68-9.47A64 64 0 0164 324.67V224c0-105.92 85.77-191.81 191.65-192S448 119.85 448 225.64z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <circle
              cx="168"
              cy="280"
              r="40"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <circle
              cx="344"
              cy="280"
              r="40"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M256 336l-16 48h32l-16-48zM256 448v32M208 448v32M304 448v32"
            />
          </svg>
          <span class="maz-nav-bar__list__item__link__text">{{ label }}</span>
        </Component>
      </li>
      <div class="maz-nav-bar__list__indicator" :style="indicatorPosition" />
    </ul>
  </nav>
</template>

<script lang="ts" setup>
  import { PropType, computed, StyleValue, ref, onMounted } from 'vue'

  export interface NavItem {
    label: string
    route?: string
    link?: string
    icon?: string
    active?: boolean
  }

  export type NavItems = NavItem[]

  defineProps({
    items: { type: Array as PropType<NavItems>, required: true },
  })

  const currentTab = ref<number>(0)
  const isMounted = ref(false)

  onMounted(() => (isMounted.value = true))

  const indicatorPosition = computed<StyleValue>(() => {
    if (typeof currentTab.value !== 'number' || !isMounted.value) {
      return {}
    }

    const listItems = document.querySelectorAll('.maz-nav-bar__list__item')
    const listItemActive = listItems?.[currentTab.value] as HTMLElement

    const offset = listItemActive.offsetWidth / 2 + listItemActive.offsetWidth

    const translateXValue = listItemActive.offsetLeft - offset

    return {
      transform: `translateX(${translateXValue}px)`,
    }
  })
</script>

<style lang="postcss" scoped>
  .maz-nav-bar {
    @apply maz-relative maz-flex maz-h-[70px] maz-rounded-t-xl maz-bg-gray-800 maz-px-6;

    &__list {
      @apply maz-relative maz-flex maz-flex-1 maz-justify-center maz-text-center maz-text-gray-100;

      &__item {
        @apply maz-h-full maz-flex-1;

        &__link {
          @apply maz-relative maz-flex maz-h-full maz-w-full maz-flex-col maz-flex-center;

          & svg {
            @apply maz-relative maz-z-1 maz-h-9 maz-w-9 maz-text-primary maz-transition-all maz-duration-500;
          }

          & span {
            @apply maz-absolute maz-text-sm maz-opacity-0 maz-transition-all maz-duration-500;

            transform: translateY(30px);
          }

          &--active {
            & svg {
              @apply maz-text-gray-900;

              transform: translateY(-35px);
            }

            & span {
              @apply maz-opacity-100;

              transform: translateY(15px);
            }
          }
        }
      }

      &__indicator {
        @apply maz-absolute maz--top-1/2 maz-h-[70px] maz-w-[70px]
        maz-rounded-full maz-border-[6px] maz-border-white maz-bg-primary
        maz-transition-all maz-duration-500;

        transform: translateX(-100%);

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -22px;
          width: 20px;
          height: 20px;
          background-color: transparent;
          border-top-right-radius: 20px;
          box-shadow: 0 -10px 0 0 white;
        }

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -22px;
          width: 20px;
          height: 20px;
          background-color: transparent;
          border-top-left-radius: 20px;
          box-shadow: 0 -10px 0 0 white;
        }
      }
    }
  }
</style>
