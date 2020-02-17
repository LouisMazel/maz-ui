<template>
  <div class="maz-search-doc">
    <ComponentContainer
      :code="codeExample"
      language="js"
    >
      <h2 class="mb-3">
        Basic use
      </h2>
      <p class="mb-3">
        v-model="{{ selectedItem || 'null' }}"
      </p>
      <MazSearch
        v-model="selectedItem"
        :items="results"
        :loader="loader"
        item-text="label"
        @request="searchResults"
      />
    </ComponentContainer>
    <ComponentContainer
      :code="codeExample2"
      language="js"
    >
      <h2 class="mb-3">
        Custom
      </h2>
      <p class="mb-3">
        v-model="{{ selectedItem2 || 'null' }}"
      </p>
      <MazSearch
        v-model="selectedItem2"
        :items="results"
        label="Search a person"
        left-icon-name="search"
        :loader="loader"
        clearable
        item-value="email"
        @request="searchResults"
      >
        <template v-slot="{ item }">
          <div
            class="item flex align-center"
          >
            <img
              :src="item.image"
              :alt="item.label"
              class="mr-3"
            >
            <div>
              <p>{{ item.first_name }} {{ item.last_name }}</p>
              <span class="text-muted">{{ item.email }}</span>
            </div>
          </div>
        </template>
        <template v-slot:no-data>
          <div
            class="item flex flex-center"
          >
            <p>No data custom template</p>
          </div>
        </template>
      </MazSearch>
    </ComponentContainer>
  </div>
</template>

<script>
  import users from '@/mocks/users'

  export default {
    name: 'MazSearchDoc',
    data () {
      return {
        selectedItem: null,
        selectedItem2: null,
        users,
        loader: false,
        results: null,
        codeExample: `<template>
  <MazSearch
    v-model="selectedItem"
    :items="results"
    :loader="loader"
    item-text="label"
    @request="searchResults"
  />
</template>

export default {
  data () {
    return {
      selectedItem: null,
      loader: false,
      results: [],
    }
  },
  methods: {
    async searchResults (query) {
      try {
        this.loader = true
        const response = await // your request
        this.results = response
      } catch (err) {
        throw new Error(err)
      } finally {
        this.loader = false
      }
    }
  }
}`,
        codeExample2: `<template>
  <MazSearch
    v-model="selectedItem2"
    :items="results"
    label="Search a person"
    left-icon-name="search"
    :loader="loader"
    clearable
    item-value="email"
    :no-data="!results && !results.length"
    @request="searchResults"
  >
    <template v-slot="{ item }">
      <div
        class="item flex align-center"
      >
        <img
          :src="item.image"
          :alt="item.label"
          class="mr-3"
        >
        <div>
          <p>{{ item.first_name }} {{ item.last_name }}</p>
          <span class="text-muted">{{ item.email }}</span>
        </div>
      </div>
    </template>
    <template v-slot:no-data>
      <div
        class="item flex flex-center"
      >
        <p>No data custom template</p>
      </div>
    </template>
  </MazSearch>
</template>

export default {
  data () {
    return {
      selectedItem: null,
      loader: false,
      results: [],
    }
  },
  methods: {
    async searchResults (query) {
      try {
        this.loader = true
        const response = await // your request
        this.results = response
      } catch (err) {
        throw new Error(err)
      } finally {
        this.loader = false
      }
    }
  }
}

<style lang="scss" scoped>
  .item {
    height: 60px;

    &:hover,
    &.keyboard-selected {
      background-color: $hover-color;
    }

    img {
      border-radius: 50%;
      height: 40px;
      width: 40px;
    }
  }
</style>`
      }
    },
    methods: {
      searchResults (query) {
        this.loader = true
        setTimeout(() => {
          this.loader = false
          if (query === '') this.results = []
          else {
            const random = users.sort(() => 0.5 - Math.random()).slice(0, Math.round(Math.random() * 10) + 10)
            this.results = random
          }
        }, 1000)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-search-doc {
    .item {
      height: 60px;

      img {
        border-radius: 50%;
        height: 40px;
        width: 40px;
      }
    }
  }
</style>
