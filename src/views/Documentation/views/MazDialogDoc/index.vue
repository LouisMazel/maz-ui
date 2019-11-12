<template>
  <div class="maz-dialog-doc">
    <h2 class="text-center">
      {{ this.$route.name.substring(3).slice(0, -3) }}
    </h2>
    <ComponentContainer>
      <div class="flex">
        <MazBtn
          size="sm"
          class="mr-2"
          @click="hasDialogOpen = true"
        >
          Open Basic Dialog
        </MazBtn>
        <MazBtn
          size="sm"
          type="success"
          class="mr-2"
          @click="hasDialogOpenSuccess = true"
        >
          Open Success Dialog
        </MazBtn>
        <MazBtn
          size="sm"
          type="danger"
          @click="hasDialogOpenDanger = true"
        >
          Open Danger Dialog
        </MazBtn>
      </div>
    </ComponentContainer>

    <MazDialog
      v-show="hasDialogOpen"
      @close="hasDialogOpen = false"
    >
      <div slot="title">
        Basic Dialog
      </div>
      Dialog Content Basic
    </MazDialog>

    <MazDialog
      v-show="hasDialogOpenSuccess"
      success
      @close="hasDialogOpenSuccess = false"
    >
      <div slot="title">
        Success Dialog
      </div>
      Dialog Content Success
    </MazDialog>

    <MazDialog
      v-show="hasDialogOpenDanger"
      danger
      @close="hasDialogOpenDanger = false"
    >
      <div slot="title">
        Danger Dialog
      </div>
      Dialog Content Success
    </MazDialog>
  </div>
</template>

<script>
  export default {
    name: 'MazDialogDoc',
    data () {
      return {
        hasDialogOpen: false,
        hasDialogOpenDanger: false,
        hasDialogOpenSuccess: false
      }
    }
  }
</script>
