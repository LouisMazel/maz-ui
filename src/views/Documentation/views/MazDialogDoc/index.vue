<template>
  <div class="maz-dialog-doc">
    <h2 class="text-center">
      {{ this.$route.name.substring(3).slice(0, -3) }}
    </h2>
    <ComponentContainer>
      <MazBtn
        size="sm"
        @click="hasDialogOpen = true"
      >
        Open Dialog
      </MazBtn>
      <MazDialog
        v-if="hasDialogOpen"
        :value="hasDialogOpen"
      >
        Dialog Content
      </MazDialog>
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazDialogDoc',
    data () {
      return {
        hasDialogOpen: false
      }
    }
  }
</script>
