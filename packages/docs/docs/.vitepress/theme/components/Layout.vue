<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import Banner from './Banner.vue';

const { Layout } = DefaultTheme
</script>

<template>
  <Suspense>
    <template #default>
      <Layout>
        <template #layout-top>
          <Banner />
        </template>
      </Layout>
    </template>
  </Suspense>
</template>
