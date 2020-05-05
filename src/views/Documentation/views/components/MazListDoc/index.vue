<template>
  <div class="maz-list-doc">
    <ComponentContainer :code="codeExample">
      <div class="lists-container">
        <div class="list-1">
          <h2 class="mb-2">
            Basic list
          </h2>
          <p class="text-muted mb-3">
            Any options
          </p>
          <MazList>
            <MazListItem
              v-for="item in items"
              :key="`list-1-${item.id}`">
              <p>{{ item.title }}</p>
              <p class="text-muted">
                {{ item.id }}
              </p>
            </MazListItem>
          </MazList>
        </div>
        <div class="list-2">
          <h2 class="mb-2">
            Hover & animate list
          </h2>
          <MazBtn
            size="sm"
            class="mb-2"
            @click="reorderItems">
            Shuffle items
          </MazBtn>

          <MazList transition>
            <MazListItem
              v-for="item in items"
              :key="`list-2-${item.id}`"
              hover
              tag="button"
            >
              <p>{{ item.title }}</p>
              <p class="text-muted">
                {{ item.id }}
              </p>
            </MazListItem>
          </MazList>
        </div>
        <div class="list-3">
          <h2 class="mb-2">
            Scrollable list & no-shadow
          </h2>
          <p class="text-muted mb-3">
            Just set `max-height` CSS property to the list
          </p>
          <MazList
            no-shadow
            class="scrollable-list">
            <MazListItem
              v-for="item in items"
              :key="`list-3-${item.id}`"
              tag="button"
            >
              <p>{{ item.title }}</p>
              <p class="text-muted">
                {{ item.id }}
              </p>
            </MazListItem>
          </MazList>
        </div>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
export default {
  name: 'MazListDoc',
  data () {
    return {
      items: [
        { id: 0, title: 'Item 1' },
        { id: 1, title: 'Item 2' },
        { id: 2, title: 'Item 3' },
        { id: 3, title: 'Item 4' },
        { id: 4, title: 'Item 5' },
        { id: 5, title: 'Item 6' },
        { id: 6, title: 'Item 7' },
        { id: 7, title: 'Item 8' },
        { id: 8, title: 'Item 1' }
      ],
      codeExample: `<template>
  <div class="lists-container">
    <div class="list-1">
      <h2 class="mb-2">
        Basic list
      </h2>
      <p class="text-muted mb-3">
        Any options
      </p>
      <MazList>
        <MazListItem
          v-for="(item) in items"
          :key="list-1-{YOUR-ITEM-ID}"
        >
          <p>{{ item.title }}</p>
          <p class="text-muted">
            {{ item.id }}
          </p>
        </MazListItem>
      </MazList>
    </div>
    <div class="list-2">
      <h2 class="mb-2">
        Hover & animate list
      </h2>
      <MazBtn
        size="sm"
        class="mb-2"
        @click="reorderItems"
      >
        Shuffle items
      </MazBtn>

      <MazList
        transition
      >
        <MazListItem
          v-for="(item) in items"
          :key="list-2-{YOUR-ITEM-ID}"
          hover
          tag="button"
        >
          <p>{{ item.title }}</p>
          <p class="text-muted">
            {{ item.id }}
          </p>
        </MazListItem>
      </MazList>
    </div>
    <div class="list-3">
      <h2 class="mb-2">
        Scrollable list & no-shadow
      </h2>
      <p class="text-muted mb-3">
        Just set 'max-height' CSS property to the list
      </p>
      <MazList
        no-shadow
        class="scrollable-list"
      >
        <MazListItem
          v-for="(item) in items"
          :key="list-3-{YOUR-ITEM-ID}"
          tag="button"
        >
          <p>{{ item.title }}</p>
          <p class="text-muted">
            {{ item.id }}
          </p>
        </MazListItem>
      </MazList>
    </div>
  </div>
</template>

export default {
  data () {
    return {
      items: [
        { label: 'first', value: 0 },
        { label: 'second', value: 1 },
        { label: 'third', value: 2 },
        { label: 'fourth', value: 3 },
        { label: 'fifth', value: 4 },
        { label: 'sixth', value: 5 }
      ]
    }
  },
  methods: {
    reorderItems () {
      this.items.sort(() => Math.random() - 0.5)
    }
  }
}`
    }
  },
  methods: {
    reorderItems () {
      this.items.sort(() => Math.random() - 0.5)
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-list-doc {
    .lists-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(1, auto);
      grid-gap: 30px;

      @media only screen and (max-width: $breakpoint-laptop-s) {
        grid-template-columns: repeat(1, 1fr);
      }

      .scrollable-list {
        max-height: 250px;
      }
    }
  }
</style>
