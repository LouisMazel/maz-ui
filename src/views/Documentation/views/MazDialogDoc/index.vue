<template>
  <div class="maz-dialog-doc">
    <ComponentContainer :code="codeExample">
      <div class="flex">
        <MazBtn
          class="mr-2"
          @click="hasDialogOpen = true"
        >
          Open Basic Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpen"
        >
          <div slot="title">
            Basic Dialog
          </div>
          Dialog Content Basic
        </MazDialog>
        <MazBtn
          type="success"
          class="mr-2"
          @click="hasDialogOpenSuccess = true"
        >
          Open Success Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpenSuccess"
          success
        >
          <div slot="title">
            Success Dialog
          </div>
          Dialog Content Success
        </MazDialog>
        <MazBtn
          type="danger"
          @click="hasDialogOpenDanger = true"
        >
          Open Danger Dialog
        </MazBtn>
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
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazDialogDoc',
    data () {
      return {
        hasDialogOpen: false,
        hasDialogOpenDanger: false,
        hasDialogOpenSuccess: false,
        codeExample: `<template>
  <MazBtn
    class="mr-2"
    @click="hasDialogOpen = true"
  >
    Open Basic Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpen"
  >
    <div slot="title">
      Basic Dialog
    </div>
    Dialog Content Basic
  </MazDialog>
  <MazBtn
    type="success"
    class="mr-2"
    @click="hasDialogOpenSuccess = true"
  >
    Open Success Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpenSuccess"
    success
  >
    <div slot="title">
      Success Dialog
    </div>
    Dialog Content Success
  </MazDialog>
  <MazBtn
    type="danger"
    @click="hasDialogOpenDanger = true"
  >
    Open Danger Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpenDanger"
    danger
  >
    <div slot="title">
      Danger Dialog
    </div>
    Dialog Content Danger
  </MazDialog>
</template>

export default {
  data () {
    return {
      hasDialogOpen: false,
      hasDialogOpenDanger: false,
      hasDialogOpenSuccess: false
    }
  }
}`
      }
    }
  }
</script>
