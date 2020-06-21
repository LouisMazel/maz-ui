<template>
  <div class="documentation">
    Doc
  </div>
</template>

<script>
export default {
  name: 'Documentation',
  middleware: [
    function ({ redirect }) {
      redirect('/documentation/get-started')
    },
  ],
}
</script>
