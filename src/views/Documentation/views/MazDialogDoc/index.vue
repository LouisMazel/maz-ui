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
      v-model="hasDialogOpen"
    >
      <div slot="title">
        Basic Dialog
      </div>
      Dialog Content Basic
    </MazDialog>

    <MazDialog
      v-model="hasDialogOpenSuccess"
      success
    >
      <div slot="title">
        Success Dialog
      </div>
      Dialog Content Success
    </MazDialog>

    <MazDialog
      v-model="hasDialogOpenDanger"
      danger
    >
      <div slot="title">
        Danger Dialog
      </div>
      Dialog Content Danger
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
