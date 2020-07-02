<template>
  <div class="maz-dialog-doc">
    <ComponentContainer :code="codeExample">
      <div class="maz-flex maz-flex-wrap maz-align-start">
        <MazBtn
          class="maz-mr-2 maz-mb-2"
          @click.stop="hasDialogOpen = true"
        >
          Open Basic Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpen"
          :max-width="800"
          title="Basic Dialog"
        >
          Dialog Content basic
        </MazDialog>
        <MazBtn
          color="success"
          class="maz-mr-2 maz-mb-2"
          @click="hasDialogOpenSuccess = true"
        >
          Open Success Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpenSuccess"
          success
          title="Success Dialog"
        >
          Dialog Content Success
        </MazDialog>
        <MazBtn
          color="danger"
          class="maz-mr-2 maz-mb-2"
          @click="hasDialogOpenDanger = true"
        >
          Open Danger Dialog
        </MazBtn>
        <MazBtn
          class="maz-mr-2 maz-mb-2"
          color="dark"
          @click="hasDialogOpenDark = true"
        >
          Open Dark Dialog
        </MazBtn>
        <MazBtn
          @click="hasDialogOpenFullSize = true"
        >
          Open Fullsize Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpenDanger"
          danger
          title="Danger Dialog"
        >
          Dialog Content Danger
        </MazDialog>
        <MazDialog
          v-model="hasDialogOpenDark"
          dark
          title="Dark Dialog"
        >
          Dark dialog content
        </MazDialog>
        <MazDialog
          v-model="hasDialogOpenFullSize"
          fullsize
          title="Full size dialog"
        >
          <h5 class="maz-my-6 maz-text-center">
            Full size dialog content
          </h5>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
          <p class="maz-my-6 maz-text-center">
            Scroll content
          </p>
        </MazDialog>
      </div>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-6"
    >

    <h4>
      How to use it ?
    </h4>

    <CodeContainer
      language="html"
      code="<template>
  <MazDialog
    v-model=&quot;hasDialogOpen&quot;
  >
    <div slot=&quot;title&quot;>
      Basic Dialog
    </div>
    Dialog Content basic
  </MazDialog>
</template>

<script>
  import { MazDialog } from 'maz-ui'
  export default {
    components: { MazDialog },
    data () {
      return {
        hasDialogOpen: false
      }
    }
  }
</script>"
    />
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
      hasDialogOpenFullSize: false,
      codeExample: `<template>
  <MazBtn
    class="maz-mr-2 maz-mb-2"
    @click.stop="hasDialogOpen = true"
  >
    Open Basic Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpen"
    :max-width="800"
    title="Basic Dialog"
  >
    Dialog Content basic
  </MazDialog>
  <MazBtn
    color="success"
    class="maz-mr-2 maz-mb-2"
    @click="hasDialogOpenSuccess = true"
  >
    Open Success Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpenSuccess"
    success
    title="Success Dialog"
  >
    Dialog Content Success
  </MazDialog>
  <MazBtn
    color="danger"
    class="maz-mr-2 maz-mb-2"
    @click="hasDialogOpenDanger = true"
  >
    Open Danger Dialog
  </MazBtn>
  <MazBtn
    class="maz-mr-2 maz-mb-2"
    color="dark"
    @click="hasDialogOpenDark = true"
  >
    Open Dark Dialog
  </MazBtn>
  <MazBtn
    @click="hasDialogOpenFullSize = true"
  >
    Open Fullsize Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpenDanger"
    danger
    title="Danger Dialog"
  >
    Dialog Content Danger
  </MazDialog>
  <MazDialog
    v-model="hasDialogOpenDark"
    dark
    title="Dark Dialog"
  >
    Dialog Content Dark
  </MazDialog>
  <MazDialog
    v-model="hasDialogOpenFullSize"
    fullsize
    title="Full size dialog"
  >

    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
    <h3 class="maz-my-6 maz-text-center">
      Full size dialog content
    </h3>
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
