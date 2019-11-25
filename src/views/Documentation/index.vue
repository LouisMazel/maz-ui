<template>
  <div class="documentation flex flex-1">
    <MazSidebar
      v-model="hasLeftSidebarOpen"
      :width="250"
    >
      <LeftSidebarContent />
    </MazSidebar>
    <div class="documentation__container flex-1">
      <router-view class="px-5 py-3" />
      <NavFooter />
    </div>
    <MazSidebar
      v-model="hasRightSidebarOpen"
      :width="500"
      right
      absolute
      no-close-btn
    >
      <div class="p-2">
        <h3
          class="mb-2"
        >
          {{ currentComponent | capitalize }}
        </h3>
        <h4
          class="mb-2"
        >
          Props API
        </h4>

        <table>
          <tr>
            <th>Props</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
          <tr
            v-for="(prop, i) in currentProps"
            :key="i"
            class="prop"
          >
            <td>{{ prop[0] }}</td>
            <td>{{ prop[1].type.name }}</td>
            <td>
              {{
                (typeof prop[1].default === 'function'
                  ? prop[1].default.name
                  : prop[1].default === false ? 'false' : prop[1].default) || 'null'
              }}
            </td>
          </tr>
        </table>
      </div>
    </MazSidebar>
  </div>
</template>

<script>
  import LeftSidebarContent from './_subs/LeftSidebarContent'
  import NavFooter from '@/components/NavFooter'
  import MazBtn from './../../../packages/MazBtn'
  import MazInput from './../../../packages/MazInput'
  import MazPhoneNumberInput from './../../../packages/MazPhoneNumberInput'
  import { EventBus } from '@/services/EventBus'

  export default {
    name: 'Documentation',
    components: {
      LeftSidebarContent,
      /* eslint-disable vue/no-unused-components */
      MazBtn,
      MazInput,
      MazPhoneNumberInput,
      /* eslint-enable */
      NavFooter
    },
    data () {
      return {
        hasLeftSidebarOpen: true,
        hasRightSidebarOpen: false
      }
    },
    computed: {
      currentComponent () {
        return this.$route.name.slice(0, -3)
      },
      currentProps () {
        console.log('Object.entries(this.$options.components[this.currentComponent].props)', Object.entries(this.$options.components[this.currentComponent].props))
        return Object.entries(this.$options.components[this.currentComponent].props)
      }
    },
    created () {
      EventBus.$on('open-right-sidebar', () => {
        this.hasRightSidebarOpen = !this.hasRightSidebarOpen
      })
    },
    beforeDestroy () {
      if (process.env.NODE_ENV === 'production') {
        EventBus.$off('open-right-sidebar')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .documentation {
    min-height: 0;

    &__container {
      overflow-x: auto;
    }

    table {
      border-spacing: 0;
      border-radius: 8px;
      border-collapse: collapse;
      width: 100%;
      table-layout: fixed;
      overflow-wrap: break-word;
      overflow: hidden;
      word-break: break-all;
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 14px;
      box-shadow: 0 0 8px rgba(232, 237, 250, 1);
    }

    table tr {
      background-color: white;
      width: 100%;
    }

    table tr th,
    table tr td {
      padding: 6px 13px;
    }

    table tr:nth-child(2n) {
      background-color: var(--maz-hover-color);
    }
  }
</style>
