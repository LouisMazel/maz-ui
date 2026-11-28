---
title: MazInputSecret
description: MazInputSecret is a field for a secret that is saved on a server and never read back (API key, token, password). It shows a masked saved state with replace and clear actions, otherwise a password input. Built on MazInput.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Without a saved secret, it is a password input. With `saved`, the secret is displayed masked and the user can replace or clear it. The component never knows the saved secret: `v-model` only holds what the user types to replace it.

<ComponentDemo>
  <MazInputSecret
    v-model="newSecret"
    label="API key"
    :saved="hasSecret"
    block
    @clear="hasSecret = false"
  />

  <MazBtn class="maz:mt-4" size="sm" @click="save">
    Save the typed key
  </MazBtn>

<template #code>

```vue
<script lang="ts" setup>
import MazInputSecret from 'maz-ui/components/MazInputSecret'
import { ref } from 'vue'

const newSecret = ref('')
const hasSecret = ref(true)

function save() {
  if (!newSecret.value)
    return

  api.saveSecret(newSecret.value)
  newSecret.value = ''
  hasSecret.value = true
}
</script>

<template>
  <MazInputSecret
    v-model="newSecret"
    label="API key"
    :saved="hasSecret"
    @clear="hasSecret = false"
  />
</template>
```

  </template>
</ComponentDemo>

- Click "Replace" to type a new secret, "Cancel" goes back to the masked state and empties `v-model`.
- `clear` is emitted by the "Clear" button: delete the secret on your side, then set `saved` to `false`.
- When `saved` changes, the replace mode is left.
- The password input uses `autocomplete="new-password"`, so browsers do not fill it with a stored password.

## Texts

`replace-label`, `clear-label`, `cancel-label` and `saved-text` (read by screen readers on the masked field) replace the default texts (translated).

<ComponentDemo>
  <MazInputSecret
    v-model="otherSecret"
    top-label="Webhook token"
    replace-label="Change"
    clear-label="Remove"
    assistive-text="The token is never displayed again"
    saved
    block
  />

<template #code>

```vue
<MazInputSecret
  v-model="token"
  top-label="Webhook token"
  replace-label="Change"
  clear-label="Remove"
  assistive-text="The token is never displayed again"
  saved
/>
```

  </template>
</ComponentDemo>

## Sizes, colors and states

`size`, `rounded-size`, `color`, `error`, `success`, `warning` and `disabled` work as on `MazInput`. The other attributes and `MazInput` props (`start-icon`, `name`...) are passed to the field.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazInputSecret v-model="otherSecret" label="Small" size="sm" saved block />
    <MazInputSecret v-model="otherSecret" label="Error" error assistive-text="Invalid key" block />
    <MazInputSecret v-model="otherSecret" label="Disabled" saved disabled block />
  </div>

<template #code>

```vue
<MazInputSecret v-model="secret" label="Small" size="sm" saved />
<MazInputSecret v-model="secret" label="Error" error assistive-text="Invalid key" />
<MazInputSecret v-model="secret" label="Disabled" saved disabled />
```

  </template>
</ComponentDemo>

::: tip
Do not fake a saved secret with a `MazInput type="password"` and a placeholder of bullets: use this component.
:::

## Password strength

Add `strength` to show how strong the typed secret is: a meter fills, a verdict rolls and the rules tick themselves. The score goes from `0` to `4` and is emitted by the `strength` event.

<ComponentDemo>
  <MazInputSecret v-model="strongSecret" label="Password" strength block />

<template #code>

```html
<MazInputSecret v-model="password" label="Password" strength @strength="score = $event" />
```

  </template>
</ComponentDemo>

The default rules are the length (8 characters), lowercase, uppercase, a number and a symbol. Pass an object to change them: your own rules, the minimum length or the scoring.

<ComponentDemo>
  <MazInputSecret
    v-model="customSecret"
    label="Passphrase"
    :strength="{
      minLength: 12,
      rules: ['length', 'number', { label: 'No spaces', test: value => !value.includes(' ') }],
      score: (value, results) => results.filter(result => result.passed).length + (value.length > 20 ? 1 : 0),
    }"
    block
  />

<template #code>

```html
<MazInputSecret
  v-model="passphrase"
  label="Passphrase"
  :strength="{
    minLength: 12,
    rules: ['length', 'number', { label: 'No spaces', test: value => !value.includes(' ') }],
    score: (value, results) => results.filter(result => result.passed).length + (value.length > 20 ? 1 : 0),
  }"
/>
```

  </template>
</ComponentDemo>

`showRules: false` keeps the meter and the verdict only. The texts come from the translations (`inputSecret.*`).

## Motion

- The meter fills, the verdict rolls and a check is drawn in front of each rule that is met.

Set `:animated="false"` to turn them off. Reduced motion is respected.

## Accessibility

- The masked field is read-only and described by `saved-text`.
- The buttons are real buttons, disabled with the component.
- The input gets the focus when the replace mode starts.
- The meter is a `meter` with the verdict as its text, and each rule says if it is met. The input is described by the strength block.

<!--@include: ./../../.vitepress/generated-docs/maz-input-secret.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'

  const newSecret = ref('')
  const hasSecret = ref(true)
  const otherSecret = ref('')
  const strongSecret = ref('')
  const customSecret = ref('')

  function save() {
    if (!newSecret.value)
      return

    newSecret.value = ''
    hasSecret.value = true
  }
</script>
