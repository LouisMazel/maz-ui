<template>
  <div class="maz-dialog-doc">
    <ComponentContainer :code="codeExample">
      <div class="flex">
        <MazBtn
          class="mr-2"
          @click.stop="hasDialogOpen = true"
        >
          Open Basic Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpen"
          max-width="800px"
        >
          <div slot="title">
            Basic Dialog
          </div>
          Dialog Content basic
        </MazDialog>
        <MazBtn
          color="success"
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
          color="danger"
          class="mr-2"
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
        <MazBtn
          color="dark"
          @click="hasDialogOpenDark = true"
        >
          Open Dark Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpenDark"
          dark
        >
          <div slot="title">
            Dark Dialog
          </div>
          Dialog Content Dark
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
        hasDialogOpenDark: false,
        codeExample: `<template>
  <MazBtn
    class="mr-2"
    @click.stop="hasDialogOpen = true"
  >
    Open Basic Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpen"
    max-width="800px"
  >
    <div slot="title">
      Basic Dialog
    </div>
    Dialog Content basic
  </MazDialog>
  <MazBtn
    color="success"
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
    color="danger"
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
  <MazDialog
    v-model="hasDialogOpenDark"
    dark
  >
    <div slot="title">
      Dark Dialog
    </div>
    Dialog Content Dark
  </MazDialog>
</template>

export default {
  data () {
    return {
      hasDialogOpen: false,
        hasDialogOpenDanger: false,
        hasDialogOpenSuccess: false,
        hasDialogOpenDark: false
    }
  }
}`
      }
    }
  }
</script>
