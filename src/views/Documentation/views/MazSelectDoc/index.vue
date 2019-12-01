<template>
  <div class="maz-input-doc flex flex-wrap">
    <div class="flex-1 mr-4">
      <h3>Light</h3>
      <ComponentContainer>
        <MazSelect
          v-model="selectValue"
          :options="options"
        />
      </ComponentContainer>
      <ComponentContainer>
        <p class="mb-2">
          Error
        </p>
        <MazSelect
          v-model="selectValue"
          :options="options"
          error
        />
      </ComponentContainer>
      <ComponentContainer>
        <p class="mb-2">
          Valid
        </p>
        <MazSelect
          v-model="selectValue"
          :options="options"
          valid
        />
      </ComponentContainer>
    </div>
    <div class="flex-1">
      <h3>Dark</h3>
      <ComponentContainer dark>
        <MazSelect
          v-model="selectValue"
          :options="options"
          dark
        />
      </ComponentContainer>
      <ComponentContainer dark>
        <p class="mb-2">
          Error
        </p>
        <MazSelect
          v-model="selectValue"
          :options="options"
          dark
          error
        />
      </ComponentContainer>
      <ComponentContainer dark>
        <p class="mb-2">
          Valid
        </p>
        <MazSelect
          v-model="selectValue"
          :options="options"
          dark
          valid
        />
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazInputDoc',
    data () {
      return {
        selectValue: '',
        options: [
          { label: 'None' },
          { label: 'First option', value: 'first' },
          { label: 'Second option', value: 'second' },
          { label: 'Third option', value: 'third' }
        ]
      }
    }
  }
</script>
