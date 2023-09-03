<template>
  <div class="n-gallery-scroll-buttons tw-flex tw-justify-around">
    <NButton color="white" no-bordered fab @click="$emit('scroll-up')">
      <NIcon size="2.3em" class="tw-transform tw--rotate-90" name="navigation-chevron" />
    </NButton>
    <NButton color="white" no-bordered fab @click="$emit('scroll-down')">
      <NIcon size="2.3em" class="tw-transform tw-rotate-90" name="navigation-chevron" />
    </NButton>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from '@nuxtjs/composition-api'

  export default defineComponent({
    name: 'NGalleryScrollButtons',
  })
</script>
