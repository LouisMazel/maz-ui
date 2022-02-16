<template>
  <div class="flex flex-1 items-center justify-center py-2 text-center">
    <Loading class="m-auto" />
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'nuxt-property-decorator'
  import Loading from '@/components/global/Loading.vue'

  @Component({
    components: {
      Loading,
    },
  })
  export default class CalendarLoader extends Vue {}
</script>
