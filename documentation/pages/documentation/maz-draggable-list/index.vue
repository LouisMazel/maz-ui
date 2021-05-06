<template>
  <div class="maz-draggable-list-doc">
    <ComponentContainer :code="codeExample">
      <div class="demo-container maz-flex maz-flex-wrap">
        <MazDraggableList
          v-model="list"
          class="maz-flex-1 maz-mr-3"
        />
        <MazDraggableList
          v-slot="{ item, index }"
          v-model="list"
          class="maz-flex-1"
        >
          <div class="maz-flex maz-space-between maz-w-100 maz-align-center">
            <p>label: {{ item.label }}</p>
            <p>index: {{ index }}</p>
            <MazBtn
              fab
              size="sm"
            >
              <i class="material-icons maz-fs-20">
                edit
              </i>
            </MazBtn>
          </div>
        </MazDraggableList>

        <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">
        <p>
          The list in data object is updated. Value :
        </p>
        <CodeContainer
          :code="`${listValue}` || 'null'"
          language="json"
        />
      </div>
      <MazBtn @click="resetOrder">
        Reset order
      </MazBtn>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h4>
      How to use it ?
    </h4>

    <CodeContainer
      language="html"
      code="<template>
  <MazDraggableList
    v-model=&quot;list&quot;
  />
</template>

<script>
  import { MazDraggableList } from 'maz-ui'
  export default {
    components: { MazDraggableList }
    data () {
      return {
        list: [
          { label: 'first', value: 0 },
          { label: 'second', value: 1 },
          { label: 'third', value: 2 },
          { label: 'fourth', value: 3 },
          { label: 'fifth', value: 4 },
          { label: 'sixth', value: 5 }
        ]
      }
    }
  }
</script>"
    />
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
  <div class="demo-container maz-flex maz-flex-wrap">
    <MazDraggableList
      v-model="list"
      class="maz-flex-1 maz-mr-3"
    />
    <MazDraggableList
      v-model="list"
      v-slot="{ item, index }"
      class="maz-flex-1"
    >
      <div class="maz-flex space-between w-100 align-center">
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
          <i class="material-icons maz-fs-20">
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
  computed: {
    listValue () {
      return this.getJson(this.list)
    }
  },
  methods: {
    resetOrder () {
      this.list.sort((a, b) => a.value - b.value)
    },
    getJson (e) {
      return JSON.stringify(e).replace(/,/g, ',\n').replace(/{/g, '{\n').replace(/}/g, '\n}')
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
