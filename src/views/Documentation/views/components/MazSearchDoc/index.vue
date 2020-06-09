<template>
  <div class="maz-search-doc">
    <h3>
      Informations
    </h3>

    <p>
      This component uses <router-link :to="{name: 'MazInputDoc'}">
        MazInput
      </router-link> and therefore inherits all these options
    </p>

    <ComponentContainer
      :code="codeExample"
    >
      <h4 class="maz-mb-3">
        Basic use
      </h4>
      <p class="maz-mb-3">
        v-model="{{ selectedItem || 'null' }}"
      </p>
      <MazSearch
        v-model="selectedItem"
        :items="results"
        :loading="loading"
        item-text="label"
        @request="searchResults"
      />
    </ComponentContainer>
    <ComponentContainer
      :code="codeExample2"
    >
      <h4 class="maz-mb-3">
        Custom
      </h4>
      <p class="maz-mb-3">
        v-model="{{ selectedItem2 || 'null' }}"
      </p>
      <MazSearch
        v-model="selectedItem2"
        :items="results"
        placeholder="Search a person"
        left-icon-name="search"
        :loading="loading"
        color="secondary"
        clearable
        item-value="email"
        @request="searchResults"
      >
        <template v-slot="{ item }">
          <div class="item maz-flex maz-align-center">
            <img
              :src="item.image"
              :alt="item.label"
              class="maz-mr-3"
            />
            <div>
              <p>{{ item.first_name }} {{ item.last_name }}</p>
              <span class="maz-text-muted">{{ item.email }}</span>
            </div>
          </div>
        </template>
        <template v-slot:no-data>
          <div class="item maz-flex maz-flex-center">
            <p>No data custom template</p>
          </div>
        </template>
      </MazSearch>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazSearch
    v-model=&quot;query&quot;
    :items=&quot;items&quot;
    @request=&quot;searchResults&quot;
  />
</template>

<script>
  import { MazSearch } from 'maz-ui'
  export default {
    components: { MazSearch }
    data () {
      return {
        query: null,
        items: []
      }
    },
    methods: {
      searchResults (query) {
        // get items on your api
      }
    }
  }
</script>"
    />
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
      loading: false,
      results: null,
      codeExample: `<template>
  <MazSearch
    v-model="selectedItem"
    :items="results"
    :loading="loading"
    item-text="label"
    @request="searchResults"
  />
</template>

export default {
  data () {
    return {
      selectedItem: null,
      loading: false,
      results: [],
    }
  },
  methods: {
    async searchResults (query) {
      try {
        this.loading = true
        const response = await // your request
        this.results = response
      } catch (err) {
        throw new Error(err)
      } finally {
        this.loading = false
      }
    }
  }
}`,
      codeExample2: `<template>
  <MazSearch
    v-model="selectedItem2"
    :items="results"
    placeholder="Search a person"
    left-icon-name="search"
    :loading="loading"
    color="secondary"
    clearable
    item-value="email"
    :no-data="!results && !results.length"
    @request="searchResults"
  >
    <template v-slot="{ item }">
      <div
        class="item maz-flex maz-align-center"
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
        class="item maz-flex maz-flex-center"
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
      loading: false,
      results: [],
    }
  },
  methods: {
    async searchResults (query) {
      try {
        this.loading = true
        const response = await // your request
        this.results = response
      } catch (err) {
        throw new Error(err)
      } finally {
        this.loading = false
      }
    }
  }
}

<style lang="scss" scoped>
  .item {
    height: 60px;

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
      this.loading = true
      setTimeout(() => {
        this.loading = false
        if (query === '') this.results = []
        else {
          const random = users
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.round(Math.random() * 10) + 10)
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
