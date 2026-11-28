<script lang="ts" setup>
const dialog = useDialog()

const clickPointOpen = ref(false)
const clickPointOrigin = ref<MouseEvent>()
const scrollableOpen = ref(false)
const plainFadeOpen = ref(false)
const confirmationResult = ref<string>()
const confirmResult = ref<string>()

function openFromClick(event: MouseEvent) {
  clickPointOrigin.value = event
  clickPointOpen.value = true
}

async function askWithEvent(event: MouseEvent) {
  const confirmed = await dialog.confirm({
    title: 'Archive the report',
    message: 'The origin of this dialog is the click event.',
    origin: event,
    identifier: 'pr2-confirm-event',
  })
  confirmResult.value = confirmed ? 'accepted' : 'rejected'
}

async function askWithConfirmation(event: MouseEvent) {
  const confirmed = await dialog.confirm({
    title: 'Delete the project',
    message: 'This action cannot be undone.',
    confirmation: 'my-project',
    acceptText: 'Delete',
    rejectText: 'Keep',
    origin: event,
    identifier: 'pr2-confirmation',
  })
  confirmationResult.value = confirmed ? 'deleted' : 'kept'
}
</script>

<template>
  <ModernisationSection
    id="pr2-dialogs"
    title="PR 2. Dialogs"
    description="A dialog grows out of the element that opened it and goes back into it. On a phone it is centered, no more stuck to the bottom."
  >
    <ModernisationDemo title="MazDialog with the trigger slot" hint="The dialog grows out of the button and returns into it. Change the button position by scrolling: the origin is read when it opens.">
      <div class="flex flex-wrap items-center gap-6">
        <MazDialog title="From a button">
          <template #trigger="{ open }">
            <MazBtn @click="open">
              Open from this button
            </MazBtn>
          </template>
          <p>This dialog knows its origin through the trigger slot.</p>
          <template #footer="{ close }">
            <MazBtn @click="close">
              Close
            </MazBtn>
          </template>
        </MazDialog>

        <div class="ms-auto">
          <MazDialog title="From a button on the end side">
            <template #trigger="{ open, isOpen }">
              <MazBtn color="secondary" :aria-expanded="isOpen" @click="open">
                Open from the end side
              </MazBtn>
            </template>
            <p>It grows from the other side of the row (mirrored in RTL).</p>
          </MazDialog>
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="From a click point" hint="origin is the click event: the dialog grows from the exact point you clicked, anywhere in the area below.">
      <div
        class="flex h-48 cursor-pointer items-center justify-center rounded-xl border border-dashed border-divider text-muted"
        role="button"
        tabindex="0"
        @click="openFromClick"
        @keydown.enter="openFromClick($event as unknown as MouseEvent)"
      >
        Click anywhere in this area
      </div>
      <MazDialog v-model="clickPointOpen" :origin="clickPointOrigin" title="From the click point">
        <p>It goes back to the same point when it closes.</p>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="useDialog().confirm with the event" hint="dialog.confirm({ origin: event }) gives the same motion from a script. Without origin, the last pressed element is used.">
      <div class="flex flex-wrap items-center gap-3">
        <MazBtn @click="askWithEvent">
          Confirm with the click event
        </MazBtn>
        <MazBtn
          color="secondary"
          @click="dialog.confirm({ title: 'No explicit origin', message: 'Grows from the last pressed element.', identifier: 'pr2-confirm-auto' })"
        >
          Confirm without origin
        </MazBtn>
        <span v-if="confirmResult" class="text-muted">Result: {{ confirmResult }}</span>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Reinforced confirmation" hint="The accept button stays disabled until the text is typed. Enter in the field submits.">
      <div class="flex flex-wrap items-center gap-3">
        <MazBtn color="destructive" @click="askWithConfirmation">
          Delete the project
        </MazBtn>
        <span v-if="confirmationResult" class="text-muted">Result: {{ confirmationResult }}</span>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Nested dialogs" hint="Escape and the focus trap only act on the top dialog. Each one returns into its own trigger.">
      <MazDialog title="First dialog">
        <template #trigger="{ open }">
          <MazBtn @click="open">
            Open the first dialog
          </MazBtn>
        </template>
        <p class="mb-4">
          The second one opens from the button below.
        </p>
        <MazDialog title="Second dialog">
          <template #trigger="{ open }">
            <MazBtn color="secondary" @click="open">
              Open the second dialog
            </MazBtn>
          </template>
          <p>Press Escape: only this one closes.</p>
        </MazDialog>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="Scrollable dialog" hint="The header and the footer stay in place, the content scrolls (touch included, touch-action is no longer blocked).">
      <MazBtn @click="scrollableOpen = true">
        Open a scrollable dialog
      </MazBtn>
      <MazDialog v-model="scrollableOpen" title="Long content" scrollable>
        <p v-for="i in 30" :key="i" class="pb-6">
          Paragraph {{ i }}
        </p>
        <template #footer="{ close }">
          <MazBtn @click="close">
            Done
          </MazBtn>
        </template>
      </MazDialog>
    </ModernisationDemo>

    <ModernisationDemo title="On a phone: new default and align=&quot;end&quot;" hint="Real 375px viewports (two iframes). Left: centered with margins (new default). Right: align=&quot;end&quot;, the old look. For a real bottom sheet, use MazBottomSheet.">
      <div class="flex flex-wrap justify-center gap-8">
        <figure class="flex flex-col items-center gap-2">
          <iframe
            title="Dialog on mobile, default"
            src="/modernisation-dialog-phone"
            loading="lazy"
            class="h-[640px] w-[375px] rounded-3xl border border-divider bg-surface"
          />
          <figcaption class="text-body-sm text-muted">
            default (centered)
          </figcaption>
        </figure>
        <figure class="flex flex-col items-center gap-2">
          <iframe
            title="Dialog on mobile, align end"
            src="/modernisation-dialog-phone?align=end"
            loading="lazy"
            class="h-[640px] w-[375px] rounded-3xl border border-divider bg-surface"
          />
          <figcaption class="text-body-sm text-muted">
            align="end"
          </figcaption>
        </figure>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Reduced motion and animated" hint="Left: follows the Reduced motion toggle of the toolbar (grows from the button, or a short fade). Right: animated=false, always a plain fade.">
      <div class="flex flex-wrap items-center gap-3">
        <MazDialog title="Follows reduced motion">
          <template #trigger="{ open }">
            <MazBtn @click="open">
              Grows (or fades if reduced)
            </MazBtn>
          </template>
          <p>Turn Reduced motion on in the toolbar and open it again.</p>
        </MazDialog>
        <MazBtn color="secondary" @click="plainFadeOpen = true">
          animated=false
        </MazBtn>
        <MazDialog v-model="plainFadeOpen" :animated="false" title="Plain fade">
          <p>No movement, only the fade.</p>
        </MazDialog>
      </div>
    </ModernisationDemo>
  </ModernisationSection>
</template>
