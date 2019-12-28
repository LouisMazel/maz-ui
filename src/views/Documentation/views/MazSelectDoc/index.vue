<template>
  <div class="maz-input-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazSelect
        v-model="selectValueExample"
        label="Custom label/placeholder text"
        :options="options"
      />
    </ComponentContainer>
    <div class="flex flex--wrap">
      <div class="flex-1 mr-4">
        <ComponentContainer>
          <MazSelect
            v-model="selectValue"
            :options="options"
          />
        </ComponentContainer>
        <p>
          Error
        </p>
        <ComponentContainer>
          <MazSelect
            v-model="selectValue"
            :options="options"
            error
          />
        </ComponentContainer>
        <p>
          Valid
        </p>
        <ComponentContainer>
          <MazSelect
            v-model="selectValue"
            :options="options"
            valid
          />
        </ComponentContainer>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazInputDoc',
    data () {
      return {
        selectValue: '',
        selectValueExample: '',
        options: [
          { label: 'None', value: null },
          { label: 'First option', value: 'first' },
          { label: 'Second option', value: 'second' },
          { label: 'Third option', value: 'third' }
        ],
        codeExample: `<template>
  <MazSelect
    v-model="selectValueExample"
    label="Custom label/placeholder text"
    :options="options"
  />
</template>

export default {
  data () {
    return {
      selectValueExample: '',
      options: [
        { label: 'None', value: null },
        { label: 'First option', value: 'first' },
        { label: 'Second option', value: 'second' },
        { label: 'Third option', value: 'third' }
      ],
    }
  }
}`
      }
    }
  }
</script>
