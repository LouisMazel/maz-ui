<template>
  <div class="maz-dialog-doc">
    <ComponentContainer>
      <div class="flex">
        <MazBtn
          class="mr-2"
          @click="hasDialogOpen = true"
        >
          Open Basic Dialog
        </MazBtn>
        <MazBtn
          type="success"
          class="mr-2"
          @click="hasDialogOpenSuccess = true"
        >
          Open Success Dialog
        </MazBtn>
        <MazBtn
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
