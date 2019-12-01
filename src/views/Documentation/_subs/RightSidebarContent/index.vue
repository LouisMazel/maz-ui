<template>
  <div class="right-sidebar-content p-2">
    <div class="flex justify-content-between">
      <h3
        class="mb-2"
      >
        {{ currentComponent | capitalize }}
      </h3>
      <MazBtn
        rounded
        outline
        size="sm"
        @click="$emit('close')"
      >
        X
      </MazBtn>
    </div>
    <h4
      class="mb-2"
    >
      Props API
    </h4>

    <table class="md">
      <tr>
        <th>Props</th>
        <th>Type</th>
        <th>Default</th>
        <th>Required</th>
      </tr>
      <tr
        v-for="(prop, i) in currentProps"
        :key="i"
        class="prop"
      >
        <td>{{ prop[0] | kebab }}</td>
        <td>{{ prop[1].type.name }}</td>
        <td :class="{ 'text-muted' :prop[1].default !== false && !prop[1].default }">
          {{
            (typeof prop[1].default === 'function'
              ? prop[1].default.name
              : prop[1].default === false ? 'false' : prop[1].default) || 'null'
          }}
        </td>
        <td :class="{ 'text-muted': !prop[1].required }">
          {{ prop[1].required || 'false' }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import {
    MazBtn, MazInput, MazSelect, MazPhoneNumberInput, MazSwitch, MazCheckbox,
    MazDialog, MazLoader, MazSidebar, MazSpinner, MazTransitionExpand
  } from '@/lib'

  export default {
    name: 'RightSidebarContent',
    components: {
      /* eslint-disable vue/no-unused-components */
      MazBtn,
      MazInput,
      MazPhoneNumberInput,
      MazSelect,
      MazSwitch,
      MazCheckbox,
      MazDialog,
      MazLoader,
      MazSidebar,
      MazSpinner,
      MazTransitionExpand
      /* eslint-enable */
    },
    computed: {
      currentComponent () {
        return this.$route.name.slice(0, -3)
      },
      currentProps () {
        const props = this.$options.components[this.currentComponent].props
        return props ? Object.entries(props) : []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .right-sidebar-content {
    background-color: var(--maz-bg-color);
    overflow-y: auto;
  }
</style>
