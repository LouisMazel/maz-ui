<template>
  <div class="maz-draggable-list-doc">
    <ComponentContainer :code="codeExample">
      <div class="demo-container flex flex--wrap">
        <MazDraggableList
          v-model="list"
          class="flex-1 mr-3" />
        <MazDraggableList
          v-model="list"
          v-slot="{ item, index }"
          class="flex-1"
        >
          <div class="flex space-between w-100 align-center">
            <p>label: {{ item.label }}</p>
            <p>index: {{ index }}</p>
            <MazBtn
              fab
              size="sm">
              <i class="material-icons fs-20">
                edit
              </i>
            </MazBtn>
          </div>
        </MazDraggableList>
      </div>
      <MazBtn @click="resetOrder">
        Reset order
      </MazBtn>
    </ComponentContainer>
  </div>
</template>

<script>
export default {
  name: 'MazDraggableListDoc',
  data () {
    return {
      list: [
        { label: 'first', value: 0 },
        { label: 'second', value: 1 },
        { label: 'third', value: 2 },
        { label: 'fourth', value: 3 },
        { label: 'fifth', value: 4 },
        { label: 'sixth', value: 5 }
      ],
      codeExample: `<template>
  <div class="demo-container flex flex--wrap">
    <MazDraggableList
      v-model="list"
      class="flex-1 mr-3"
    />
    <MazDraggableList
      v-model="list"
      v-slot="{ item, index }"
      class="flex-1"
    >
      <div class="flex space-between w-100 align-center">
        <p>
          label: {{ item.label }}
        </p>
        <p>
          index: {{ index }}
        </p>
        <MazBtn
          fab
          size="sm"
        >
          <i class="material-icons fs-20">
            edit
          </i>
        </MazBtn>
      </div>
    </MazDraggableList>
  </div>
  <MazBtn
    @click="resetOrder"
  >
    Reset order
  </MazBtn>
</template>

export default {
  data () {
    return {
      list: [
        { label: 'first', value: 0 },
        { label: 'second', value: 1 },
        { label: 'third', value: 2 },
        { label: 'fourth', value: 3 },
        { label: 'fifth', value: 4 },
        { label: 'sixth', value: 5 }
      ],
    }
  },
  methods: {
    resetOrder () {
      this.list.sort((a, b) => a.value - b.value)
    }
  }
}`
    }
  },
  methods: {
    resetOrder () {
      this.list.sort((a, b) => a.value - b.value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-draggable-list-doc .demo-container {
    flex-direction: column;

    :first-child {
      margin-right: 0;
    }
  }
</style>
