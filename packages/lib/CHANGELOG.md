# Change Log

## v4.4.0...v4.5.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.4.0...v4.5.0)

### 🚀 Features

- **maz-ui:** MazReadMore - new component to truncate long text ([3d4b4e32](https://github.com/LouisMazel/maz-ui/commit/3d4b4e32))

  Truncate text or slot content with "Read more" / "Read less" toggle.
  Features:
  - maxLines: truncate by line count (CSS line-clamp)
  - maxChars: truncate by character count (works with text prop and slot)
  - Customizable colors, expand/collapse text
  - Full accessibility support (aria-expanded, aria-controls)

- **maz-ui:** MazSkeleton - new component for loading placeholders ([05133f82](https://github.com/LouisMazel/maz-ui/commit/05133f82))

  Display loading placeholders with animated shimmer effect.
  Features:
  - Shapes: rectangle, circle, square
  - Customizable size, width, height
  - Rounded sizes: none, sm, md, lg, xl, full
  - Disable animation option
  - Accessibility support (role="status", aria-live)

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.3...v4.4.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.4.0)

### 🚀 Features

- **maz-ui:** Add resetForm function and auto-reset on submit success ([2f0e40bb](https://github.com/LouisMazel/maz-ui/commit/2f0e40bb))

  This commit introduces a new resetForm() function in useFormValidator
  that completely resets the form to its initial state.
  The form is now automatically reset after successful submission by
  default. This behavior can be controlled using the resetOnSuccess option.
  Usage:
  - Automatic reset (default): The form resets automatically after
    handleSubmit succeeds
  - Manual reset: Call resetForm() at any time to reset the form
  - Disable auto-reset: Pass { resetOnSuccess: false } to handleSubmit
    options or to useFormValidator options
    When the form is reset, all fields return to their default values,
    all validation errors are cleared, and all state flags (isDirty,
    isSubmitted, isSubmitting) are reset.

- **maz-ui:** MazStepper - add content property and point slot ([17b8285d](https://github.com/LouisMazel/maz-ui/commit/17b8285d))

  Add ability to define step content directly via steps property instead of using slots.
  Support HTML in all step properties (title, subtitle, titleInfo, content) using v-html.
  Add new "point" slot to customize step number/icon display.
  Optimize component loading with async imports.
  Usage:
  - Use content property: :steps="[{ content: 'My content' }]"
  - Customize point: <template #point="{ step }">...</template>
  - Use HTML in properties: { title: '<span class="text-primary">Title</span>' }

- **maz-ui:** MazBtnGroup - new component to group MazBtn components ([1f525753](https://github.com/LouisMazel/maz-ui/commit/1f525753))
- **maz-ui:** MazBtn - add active prop and active state styles ([54b08bef](https://github.com/LouisMazel/maz-ui/commit/54b08bef))

  Use the `active` prop to programmatically set an active visual state on the button.

### 🔥 Performance

- **maz-ui:** Optimize MazCardSpotlight animation performance ([fb48f617](https://github.com/LouisMazel/maz-ui/commit/fb48f617))

  The MazCardSpotlight component now has significantly better performance when used in
  lists with multiple cards. The spotlight animation is now much smoother and consumes
  less resources, especially when scrolling through long lists.
  The animation is automatically paused when the component is not visible in the viewport.

### 🩹 Fixes

- **maz-ui:** MazDropdown - add support of accent color for menu item ([e7a392b1](https://github.com/LouisMazel/maz-ui/commit/e7a392b1))
- **maz-ui:** MazAnimateCounter - hydration issue with SSR ([70e2feec](https://github.com/LouisMazel/maz-ui/commit/70e2feec))
- **maz-ui:** MazDropdown - accessibility issues with aria attributes ([69569a0f](https://github.com/LouisMazel/maz-ui/commit/69569a0f))
- **maz-ui:** MazPagination - accessibility issues with aria attributes ([32465823](https://github.com/LouisMazel/maz-ui/commit/32465823))
- **maz-ui:** MazRadioButtons - items alignment ([9fc4e064](https://github.com/LouisMazel/maz-ui/commit/9fc4e064))

### 💅 Refactors

- **maz-ui:** MazAnimatedText - you can now choose the gradient colors ([d54fe39e](https://github.com/LouisMazel/maz-ui/commit/d54fe39e))
- **maz-ui:** MazAnimatedText - make gradientVia prop optionnal ([de8b2e29](https://github.com/LouisMazel/maz-ui/commit/de8b2e29))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.3...v4.4.0-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.4.0-beta.1)

### 🚀 Features

- **maz-ui:** Add resetForm function and auto-reset on submit success ([9eb89c52d](https://github.com/LouisMazel/maz-ui/commit/9eb89c52d))

  This commit introduces a new resetForm() function in useFormValidator
  that completely resets the form to its initial state.
  The form is now automatically reset after successful submission by
  default. This behavior can be controlled using the resetOnSuccess option.
  Usage:
  - Automatic reset (default): The form resets automatically after
    handleSubmit succeeds
  - Manual reset: Call resetForm() at any time to reset the form
  - Disable auto-reset: Pass { resetOnSuccess: false } to handleSubmit
    options or to useFormValidator options
    When the form is reset, all fields return to their default values,
    all validation errors are cleared, and all state flags (isDirty,
    isSubmitted, isSubmitting) are reset.

- **maz-ui:** MazStepper - add content property and point slot ([f7519f23b](https://github.com/LouisMazel/maz-ui/commit/f7519f23b))

  Add ability to define step content directly via steps property instead of using slots.
  Support HTML in all step properties (title, subtitle, titleInfo, content) using v-html.
  Add new "point" slot to customize step number/icon display.
  Optimize component loading with async imports.
  Usage:
  - Use content property: :steps="[{ content: 'My content' }]"
  - Customize point: <template #point="{ step }">...</template>
  - Use HTML in properties: { title: '<span class="text-primary">Title</span>' }

- **maz-ui:** MazBtnGroup - new component to group MazBtn components ([496de3c4a](https://github.com/LouisMazel/maz-ui/commit/496de3c4a))
- **maz-ui:** MazBtn - add active prop and active state styles ([6a538d6c4](https://github.com/LouisMazel/maz-ui/commit/6a538d6c4))

  Use the `active` prop to programmatically set an active visual state on the button.

### 🔥 Performance

- **maz-ui:** Optimize MazCardSpotlight animation performance ([ccf1bfa6e](https://github.com/LouisMazel/maz-ui/commit/ccf1bfa6e))

  The MazCardSpotlight component now has significantly better performance when used in
  lists with multiple cards. The spotlight animation is now much smoother and consumes
  less resources, especially when scrolling through long lists.
  The animation is automatically paused when the component is not visible in the viewport.

### 🩹 Fixes

- **maz-ui:** MazDropdown - add support of accent color for menu item ([4cd49edb5](https://github.com/LouisMazel/maz-ui/commit/4cd49edb5))
- **maz-ui:** MazAnimateCounter - hydration issue with SSR ([7c54eccd5](https://github.com/LouisMazel/maz-ui/commit/7c54eccd5))
- **maz-ui:** MazDropdown - accessibility issues with aria attributes ([2b77b7ff3](https://github.com/LouisMazel/maz-ui/commit/2b77b7ff3))
- **maz-ui:** MazPagination - accessibility issues with aria attributes ([fbc437d82](https://github.com/LouisMazel/maz-ui/commit/fbc437d82))
- **maz-ui:** MazRadioButtons - items alignment ([f66286c93](https://github.com/LouisMazel/maz-ui/commit/f66286c93))

### 💅 Refactors

- **maz-ui:** MazAnimatedText - you can now choose the gradient colors ([9e46d9ffa](https://github.com/LouisMazel/maz-ui/commit/9e46d9ffa))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.4-beta.6...v4.3.4-beta.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.4-beta.6...v4.3.4-beta.7)

### 🩹 Fixes

- **maz-ui:** MazDropdown - accessibility issues with aria attributes ([2b77b7ff](https://github.com/LouisMazel/maz-ui/commit/2b77b7ff))
- **maz-ui:** MazPagination - accessibility issues with aria attributes ([fbc437d8](https://github.com/LouisMazel/maz-ui/commit/fbc437d8))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.4-beta.5...v4.3.4-beta.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.4-beta.5...v4.3.4-beta.6)

### 🚀 Features

- **maz-ui:** MazStepper - add content property and point slot ([f7519f23](https://github.com/LouisMazel/maz-ui/commit/f7519f23))

  Add ability to define step content directly via steps property instead of using slots.
  Support HTML in all step properties (title, subtitle, titleInfo, content) using v-html.
  Add new "point" slot to customize step number/icon display.
  Optimize component loading with async imports.
  Usage:
  - Use content property: :steps="[{ content: 'My content' }]"
  - Customize point: `<template #point="{ step }">...</template>`
  - Use HTML in properties: { title: `<span class="text-primary">Title</span>` }w

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.4-beta.4...v4.3.4-beta.5

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.4-beta.4...v4.3.4-beta.5)

### 🩹 Fixes

- **maz-ui:** MazAnimateCounter - hydration issue with SSR ([7c54eccd](https://github.com/LouisMazel/maz-ui/commit/7c54eccd))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.4-beta.3...v4.3.4-beta.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.4-beta.3...v4.3.4-beta.4)

### 🚀 Features

- **maz-ui:** Add resetForm function and auto-reset on submit success ([9eb89c52](https://github.com/LouisMazel/maz-ui/commit/9eb89c52))

  This commit introduces a new resetForm() function in useFormValidator
  that completely resets the form to its initial state.
  The form is now automatically reset after successful submission by
  default. This behavior can be controlled using the resetOnSuccess option.
  Usage:
  - Automatic reset (default): The form resets automatically after
    handleSubmit succeeds
  - Manual reset: Call resetForm() at any time to reset the form
  - Disable auto-reset: Pass { resetOnSuccess: false } to handleSubmit
    options or to useFormValidator options
    When the form is reset, all fields return to their default values,
    all validation errors are cleared, and all state flags (isDirty,
    isSubmitted, isSubmitting) are reset.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.4-beta.2...v4.3.4-beta.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.4-beta.2...v4.3.4-beta.3)

### 🩹 Fixes

- **maz-ui:** MazDropdown - add support of accent color for menu item ([4cd49edb](https://github.com/LouisMazel/maz-ui/commit/4cd49edb))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.4-beta.1...v4.3.4-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.4-beta.1...v4.3.4-beta.2)

### 🔥 Performance

- **maz-ui:** Optimize MazCardSpotlight animation performance ([ccf1bfa6](https://github.com/LouisMazel/maz-ui/commit/ccf1bfa6))

  The MazCardSpotlight component now has significantly better performance when used in
  lists with multiple cards. The spotlight animation is now much smoother and consumes
  less resources, especially when scrolling through long lists.
  The animation is automatically paused when the component is not visible in the viewport.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.4-beta.0...v4.3.4-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.4-beta.0...v4.3.4-beta.1)

### 💅 Refactors

- **maz-ui:** MazAnimatedText - you can now choose the gradient colors ([9e46d9ff](https://github.com/LouisMazel/maz-ui/commit/9e46d9ff))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.3...v4.3.4-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.3.4-beta.0)

No relevant changes since last release

## v4.3.2...v4.3.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.2...v4.3.3)

### 🩹 Fixes

- **maz-ui:** MazSelect - cannot open the option list when disabled - #1404 ([#1404](https://github.com/LouisMazel/maz-ui/issues/1404))
- **maz-ui:** MazDropdown - don't close dropdown panel when close-on-click is false - #1403 ([#1403](https://github.com/LouisMazel/maz-ui/issues/1403))
- **maz-ui:** MazTable - The selected rows are no longer reset when changing pages - #1402 ([#1402](https://github.com/LouisMazel/maz-ui/issues/1402))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.1...v4.3.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2)

### 🩹 Fixes

- **maz-ui:** MazInputPhoneNumber - emit correct country code when detected from phone input #1390 ([#1390](https://github.com/LouisMazel/maz-ui/issues/1390))

  When a user enters a phone number in international format, the component
  now correctly emits the detected country code. Previously, the country
  selector would update visually but the model would retain the original
  value because results.value.countryCode was not updated when updateResults
  was false.

- **maz-ui:** MazSelect - prevent focus loss in modals when using search feature #1378 ([#1378](https://github.com/LouisMazel/maz-ui/issues/1378))

  When MazSelect with search feature is placed inside a modal (e.g. Bootstrap Modal),
  prevent the keyboard event from propagating which caused focus management conflicts.
  The modal's focus trap was intercepting the focus transfer to the search input,
  causing the input to lose focus after a single character.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.1...v4.3.2-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.2)

### 🩹 Fixes

- **maz-ui:** MazInputPhoneNumber - emit correct country code when detected from phone input #1390 ([#1390](https://github.com/LouisMazel/maz-ui/issues/1390))

  When a user enters a phone number in international format, the component
  now correctly emits the detected country code. Previously, the country
  selector would update visually but the model would retain the original
  value because results.value.countryCode was not updated when updateResults
  was false.

- **maz-ui:** MazSelect - prevent focus loss in modals when using search feature #1378 ([#1378](https://github.com/LouisMazel/maz-ui/issues/1378))

  When MazSelect with search feature is placed inside a modal (e.g. Bootstrap Modal),
  prevent the keyboard event from propagating which caused focus management conflicts.
  The modal's focus trap was intercepting the focus transfer to the search input,
  causing the input to lose focus after a single character.

### ❤️ Contributors

- LouisMazel <me@loicmazuel.com>

## v4.3.1...v4.3.2-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.1)

No relevant changes since last release

## v4.3.1...v4.3.2-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.0)

No relevant changes since last release

## v4.3.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1-beta.0...v4.3.1)

No relevant changes since last release

## v4.3.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.0...v4.3.1-beta.0)

No relevant changes since last release

## v4.2.1...v4.3.0

### 🩹 Fixes

- **maz-ui:** MazDatePicker - correct check if model is range value and not null - #1366 ([#1366](https://github.com/LouisMazel/maz-ui/issues/1366))
- **maz-ui:** MazDatePicker - correct check if model is range value and not null - #1366 ([#1366](https://github.com/LouisMazel/maz-ui/issues/1366))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.0-beta.0...v4.3.0-rc.0

No relevant changes since last release

## v4.3.0-alpha.1...v4.3.0-beta.0

### 🩹 Fixes

- **maz-ui:** MazDatePicker - correct check if model is range value and not null - #1366 ([#1366](https://github.com/LouisMazel/maz-ui/issues/1366))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.0-alpha.0...v4.3.0-alpha.1

No relevant changes since last release

## v4.2.0...v4.2.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.0...v4.2.1)

### 💅 Refactors

- **maz-ui:** MazModulesResolver - add formatJson to auto imported modules ([2de93fe5](https://github.com/LouisMazel/maz-ui/commit/2de93fe5))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-beta.0...v4.2.1-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-beta.0...v4.2.1-beta.2)

No relevant changes since last release

## v4.2.1-beta.0...v4.2.1-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-beta.0...v4.2.1-beta.1)

No relevant changes since last release

## v4.2.1-alpha.16...v4.2.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.16...v4.2.1-beta.0)

No relevant changes since last release

## v4.2.1-alpha.12...v4.2.1-alpha.13

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.12...v4.2.1-alpha.13)

No relevant changes for this release

## v4.2.1-alpha.9...v4.2.1-alpha.10

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.9...v4.2.1-alpha.10)

No relevant changes for this release

## v4.2.1-alpha.8...v4.2.1-alpha.9

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.8...v4.2.1-alpha.9)

### 💅 Refactors

- **maz-ui:** MazModulesResolver - add formatJson to auto imported modules ([b62ff36cf](https://github.com/LouisMazel/maz-ui/commit/b62ff36cf))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.8...v4.2.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8...v4.2.0)

### 🩹 Fixes

- **@maz-ui/nuxt:** Type declarations of composables ([54fc2e1d](https://github.com/LouisMazel/maz-ui/commit/54fc2e1d))
- **maz-ui:** MazDropdown - popover should be closed on click outside ([efa438db](https://github.com/LouisMazel/maz-ui/commit/efa438db))
- **@maz-ui/nuxt:** Type declarations of composables ([b32b9608](https://github.com/LouisMazel/maz-ui/commit/b32b9608))
- **maz-ui:** MazDropdown - popover should be closed on click outside ([06053305](https://github.com/LouisMazel/maz-ui/commit/06053305))

### 📖 Documentation

- **maz-ui:** MazBtn - update doc ([813fd51a](https://github.com/LouisMazel/maz-ui/commit/813fd51a))

### 💄 Styles

- **maz-ui:** MazBackdrop - make the overlay background darker ([41b90845](https://github.com/LouisMazel/maz-ui/commit/41b90845))
- **maz-ui:** MazDropzone - use a link instead of a button to select file ([535d409e](https://github.com/LouisMazel/maz-ui/commit/535d409e))
- **maz-ui:** MazBackdrop - make the overlay background darker ([cdd1a9b4](https://github.com/LouisMazel/maz-ui/commit/cdd1a9b4))
- **maz-ui:** MazDropzone - use a link instead of a button to select file ([7fa6843f](https://github.com/LouisMazel/maz-ui/commit/7fa6843f))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.9-alpha.0...v4.1.9-alpha.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.9-alpha.0...v4.1.9-alpha.1)

### 📖 Documentation

- **maz-ui:** MazBtn - update doc ([f25b9849d](https://github.com/LouisMazel/maz-ui/commit/f25b9849d))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7...v4.1.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7...v4.1.8)

### 🩹 Fixes

- **@maz-ui/nuxt:** Type declarations of composables ([54fc2e1d3](https://github.com/LouisMazel/maz-ui/commit/54fc2e1d3))
- **maz-ui:** MazDropdown - popover should be closed on click outside ([efa438db9](https://github.com/LouisMazel/maz-ui/commit/efa438db9))

### 💄 Styles

- **maz-ui:** MazBackdrop - make the overlay background darker ([41b90845e](https://github.com/LouisMazel/maz-ui/commit/41b90845e))
- **maz-ui:** MazDropzone - use a link instead of a button to select file ([535d409ee](https://github.com/LouisMazel/maz-ui/commit/535d409ee))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.8-beta.2...v4.1.8-beta.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.2...v4.1.8-beta.3)

### 🩹 Fixes

- **maz-ui:** MazDropdown - popover should be closed on click outside ([efa438db](https://github.com/LouisMazel/maz-ui/commit/efa438db))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.8-beta.1...v4.1.8-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.1...v4.1.8-beta.2)

**Note:** No relevant commits found

## v4.1.8-beta.0...v4.1.8-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.0...v4.1.8-beta.1)

**Note:** No relevant commits found

## v4.1.7-beta.8...v4.1.8-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.8...v4.1.8-beta.0)

### 🚀 Features

- **maz-ui:** Add parallel upload with worker pool and enhanced file type detection in MazDropzone ([fe9b489c](https://github.com/LouisMazel/maz-ui/commit/fe9b489c))
- **maz-ui:** Add parallel upload with worker pool and enhanced file type detection in MazDropzone ([5e28bb23](https://github.com/LouisMazel/maz-ui/commit/5e28bb23))

### 🔥 Performance

- Tree-shaking improvements of packages ([4dd42ba4](https://github.com/LouisMazel/maz-ui/commit/4dd42ba4))

### 🩹 Fixes

- **maz-ui:** MazCard - a linked card should not have zoom feature on the gallery ([863fb1cf](https://github.com/LouisMazel/maz-ui/commit/863fb1cf))
- **maz-ui:** MazDropdown - correct prop heritage to popover component ([cd679d9d](https://github.com/LouisMazel/maz-ui/commit/cd679d9d))
- **maz-ui:** MazSelect - selected option should be focus on open & selected option focused has outline style ([5807d3bf](https://github.com/LouisMazel/maz-ui/commit/5807d3bf))
- **maz-ui:** MazSelect - multiple not working, correct declaration type of props ([0fe6791f](https://github.com/LouisMazel/maz-ui/commit/0fe6791f))
- **maz-ui:** MazDatePicker - custom shortcuts was not displayed ([f232da95](https://github.com/LouisMazel/maz-ui/commit/f232da95))
- Plugin declarations component custom properties - fix #1331 ([#1331](https://github.com/LouisMazel/maz-ui/issues/1331))
- **maz-ui:** MazInput - reduce complexity of css selectors - fix #1319 ([#1319](https://github.com/LouisMazel/maz-ui/issues/1319))
- **maz-ui:** MazSelect - search input padding and scroll to option behavior ([cdd1fdbb](https://github.com/LouisMazel/maz-ui/commit/cdd1fdbb))
- **maz-ui:** MazDatePicker - popover won't open when MazDatePicker is lazy loaded ([8e29f870](https://github.com/LouisMazel/maz-ui/commit/8e29f870))
- **maz-ui:** MazCard - a linked card should not have zoom feature on the gallery ([7379bed1](https://github.com/LouisMazel/maz-ui/commit/7379bed1))
- **maz-ui:** MazDropdown - correct prop heritage to popover component ([f1296857](https://github.com/LouisMazel/maz-ui/commit/f1296857))
- **maz-ui:** MazSelect - selected option should be focus on open & selected option focused has outline style ([0ef32339](https://github.com/LouisMazel/maz-ui/commit/0ef32339))
- **maz-ui:** MazSelect - multiple not working, correct declaration type of props ([cf262929](https://github.com/LouisMazel/maz-ui/commit/cf262929))
- **maz-ui:** MazDatePicker - custom shortcuts was not displayed ([cdf4e954](https://github.com/LouisMazel/maz-ui/commit/cdf4e954))
- Plugin declarations component custom properties - fix #1331 ([#1331](https://github.com/LouisMazel/maz-ui/issues/1331))
- **maz-ui:** MazInput - reduce complexity of css selectors - fix #1319 ([#1319](https://github.com/LouisMazel/maz-ui/issues/1319))
- **maz-ui:** MazSelect - search input padding and scroll to option behavior ([6235d52a](https://github.com/LouisMazel/maz-ui/commit/6235d52a))
- **maz-ui:** MazDatePicker - popover won't open when MazDatePicker is lazy loaded ([e2476f03](https://github.com/LouisMazel/maz-ui/commit/e2476f03))
- **maz-ui:** Fix invalid country code detection from browser locale in MazInputPhoneNumber ([80a9fe26](https://github.com/LouisMazel/maz-ui/commit/80a9fe26))
- **maz-ui:** MazSelect - remove search wrapper when search is not enabled ([6f6752c1](https://github.com/LouisMazel/maz-ui/commit/6f6752c1))
- **@maz-ui/nuxt:** Type declarations of composables ([54fc2e1d](https://github.com/LouisMazel/maz-ui/commit/54fc2e1d))

### 💅 Refactors

- **maz-ui:** MazDatePicker - prefer-position and fallback-position are controllable with props ([30935856](https://github.com/LouisMazel/maz-ui/commit/30935856))
- **maz-ui:** MazLink - supports background, muted and contrast colors ([b44858f5](https://github.com/LouisMazel/maz-ui/commit/b44858f5))
- **maz-ui:** MazLink - supports colors 'none' to inherits color from parent ([e46367f0](https://github.com/LouisMazel/maz-ui/commit/e46367f0))
- **maz-ui:** MazLink - rename 'none' to 'inherit' ([a69f356a](https://github.com/LouisMazel/maz-ui/commit/a69f356a))
- **maz-ui:** MazPopover - remove width max-content ([b2abc9f6](https://github.com/LouisMazel/maz-ui/commit/b2abc9f6))
- **maz-ui:** MazCard - ensure card has no zoom feature on gallery when it's linked ([0dd16faa](https://github.com/LouisMazel/maz-ui/commit/0dd16faa))
- **maz-ui:** UseMutationObserver - can be used outside from setup function ([32f0ee5b](https://github.com/LouisMazel/maz-ui/commit/32f0ee5b))
- **maz-ui:** MazAnimatedElement & MazAnimatedText - animation optimization with requestAnimationFrame ([719a4002](https://github.com/LouisMazel/maz-ui/commit/719a4002))
- **maz-ui:** Accessibilty - support of rtl direction ([9bd1a3d9](https://github.com/LouisMazel/maz-ui/commit/9bd1a3d9))
- **docs:** Accessibilty - support of rtl direction ([b7c04c49](https://github.com/LouisMazel/maz-ui/commit/b7c04c49))
- **maz-ui:** MazDatePicker - show hour in input only if time picker is enabled ([a020562b](https://github.com/LouisMazel/maz-ui/commit/a020562b))
- **maz-ui:** Minor improvements in MazBtn, MazIcon and composables ([1186d201](https://github.com/LouisMazel/maz-ui/commit/1186d201))
- **@maz-ui/icons:** Improve tree-shaking with individual icon files ([c0838f05](https://github.com/LouisMazel/maz-ui/commit/c0838f05))
- **maz-ui:** MazDatePicker - prefer-position and fallback-position are controllable with props ([87f1be02](https://github.com/LouisMazel/maz-ui/commit/87f1be02))
- **maz-ui:** MazLink - supports background, muted and contrast colors ([07a65ffd](https://github.com/LouisMazel/maz-ui/commit/07a65ffd))
- **maz-ui:** MazLink - supports colors 'none' to inherits color from parent ([b21f8c0a](https://github.com/LouisMazel/maz-ui/commit/b21f8c0a))
- **maz-ui:** MazLink - rename 'none' to 'inherit' ([6268c49e](https://github.com/LouisMazel/maz-ui/commit/6268c49e))
- **maz-ui:** MazPopover - remove width max-content ([e7fbc35c](https://github.com/LouisMazel/maz-ui/commit/e7fbc35c))
- **maz-ui:** MazCard - ensure card has no zoom feature on gallery when it's linked ([d44ab79c](https://github.com/LouisMazel/maz-ui/commit/d44ab79c))
- **maz-ui:** UseMutationObserver - can be used outside from setup function ([a0a6ccd5](https://github.com/LouisMazel/maz-ui/commit/a0a6ccd5))
- **maz-ui:** MazAnimatedElement & MazAnimatedText - animation optimization with requestAnimationFrame ([e519aad9](https://github.com/LouisMazel/maz-ui/commit/e519aad9))
- **maz-ui:** Accessibilty - support of rtl direction ([8cc99bf5](https://github.com/LouisMazel/maz-ui/commit/8cc99bf5))
- **docs:** Accessibilty - support of rtl direction ([aa715eda](https://github.com/LouisMazel/maz-ui/commit/aa715eda))
- **maz-ui:** MazDatePicker - show hour in input only if time picker is enabled ([5a4701c8](https://github.com/LouisMazel/maz-ui/commit/5a4701c8))
- **maz-ui:** Minor improvements in MazBtn, MazIcon and composables ([b4fec020](https://github.com/LouisMazel/maz-ui/commit/b4fec020))
- **@maz-ui/icons:** Improve tree-shaking with individual icon files ([dc0bd1f8](https://github.com/LouisMazel/maz-ui/commit/dc0bd1f8))

### 💄 Styles

- **maz-ui:** MazBtn - adjust text color of background and contrast colors ([6db8243b](https://github.com/LouisMazel/maz-ui/commit/6db8243b))
- **maz-ui:** MazPopover - use text foreground for background color ([7f594790](https://github.com/LouisMazel/maz-ui/commit/7f594790))
- **maz-ui:** MazRadioButtons - use provided color for the button borders ([0e52a678](https://github.com/LouisMazel/maz-ui/commit/0e52a678))
- **maz-ui:** Toaster - toast has different style between dark and light ([bded3e77](https://github.com/LouisMazel/maz-ui/commit/bded3e77))
- **maz-ui:** MazBtn - adjust text color of background and contrast colors ([84b265c5](https://github.com/LouisMazel/maz-ui/commit/84b265c5))
- **maz-ui:** MazPopover - use text foreground for background color ([a1f40d8e](https://github.com/LouisMazel/maz-ui/commit/a1f40d8e))
- **maz-ui:** MazRadioButtons - use provided color for the button borders ([0cf90bfc](https://github.com/LouisMazel/maz-ui/commit/0cf90bfc))
- **maz-ui:** Toaster - toast has different style between dark and light ([81afe160](https://github.com/LouisMazel/maz-ui/commit/81afe160))
- **maz-ui:** MazBackdrop - make the overlay background darker ([41b90845](https://github.com/LouisMazel/maz-ui/commit/41b90845))
- **maz-ui:** MazDropzone - use a link instead of a button to select file ([535d409e](https://github.com/LouisMazel/maz-ui/commit/535d409e))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.6...v4.1.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.6...v4.1.7)

### 🚀 Features

- **maz-ui:** Add parallel upload with worker pool and enhanced file type detection in MazDropzone ([5e28bb23](https://github.com/LouisMazel/maz-ui/commit/5e28bb23))

### 🔥 Performance

- Tree-shaking improvements of packages ([4dd42ba4](https://github.com/LouisMazel/maz-ui/commit/4dd42ba4))

### 🩹 Fixes

- **maz-ui:** MazCard - a linked card should not have zoom feature on the gallery ([7379bed1](https://github.com/LouisMazel/maz-ui/commit/7379bed1))
- **maz-ui:** MazDropdown - correct prop heritage to popover component ([f1296857](https://github.com/LouisMazel/maz-ui/commit/f1296857))
- **maz-ui:** MazSelect - selected option should be focus on open & selected option focused has outline style ([0ef32339](https://github.com/LouisMazel/maz-ui/commit/0ef32339))
- **maz-ui:** MazSelect - multiple not working, correct declaration type of props ([cf262929](https://github.com/LouisMazel/maz-ui/commit/cf262929))
- **maz-ui:** MazDatePicker - custom shortcuts was not displayed ([cdf4e954](https://github.com/LouisMazel/maz-ui/commit/cdf4e954))
- Plugin declarations component custom properties - fix #1331 ([#1331](https://github.com/LouisMazel/maz-ui/issues/1331))
- **maz-ui:** MazInput - reduce complexity of css selectors - fix #1319 ([#1319](https://github.com/LouisMazel/maz-ui/issues/1319))
- **maz-ui:** MazSelect - search input padding and scroll to option behavior ([6235d52a](https://github.com/LouisMazel/maz-ui/commit/6235d52a))
- **maz-ui:** MazDatePicker - popover won't open when MazDatePicker is lazy loaded ([e2476f03](https://github.com/LouisMazel/maz-ui/commit/e2476f03))
- **maz-ui:** Fix invalid country code detection from browser locale in MazInputPhoneNumber ([80a9fe26](https://github.com/LouisMazel/maz-ui/commit/80a9fe26))
- **maz-ui:** MazSelect - remove search wrapper when search is not enabled ([6f6752c1](https://github.com/LouisMazel/maz-ui/commit/6f6752c1))

### 💅 Refactors

- **maz-ui:** MazDatePicker - prefer-position and fallback-position are controllable with props ([87f1be02](https://github.com/LouisMazel/maz-ui/commit/87f1be02))
- **maz-ui:** MazLink - supports background, muted and contrast colors ([07a65ffd](https://github.com/LouisMazel/maz-ui/commit/07a65ffd))
- **maz-ui:** MazLink - supports colors 'none' to inherits color from parent ([b21f8c0a](https://github.com/LouisMazel/maz-ui/commit/b21f8c0a))
- **maz-ui:** MazLink - rename 'none' to 'inherit' ([6268c49e](https://github.com/LouisMazel/maz-ui/commit/6268c49e))
- **maz-ui:** MazPopover - remove width max-content ([e7fbc35c](https://github.com/LouisMazel/maz-ui/commit/e7fbc35c))
- **maz-ui:** MazCard - ensure card has no zoom feature on gallery when it's linked ([d44ab79c](https://github.com/LouisMazel/maz-ui/commit/d44ab79c))
- **maz-ui:** UseMutationObserver - can be used outside from setup function ([a0a6ccd5](https://github.com/LouisMazel/maz-ui/commit/a0a6ccd5))
- **maz-ui:** MazAnimatedElement & MazAnimatedText - animation optimization with requestAnimationFrame ([e519aad9](https://github.com/LouisMazel/maz-ui/commit/e519aad9))
- **maz-ui:** Accessibilty - support of rtl direction ([8cc99bf5](https://github.com/LouisMazel/maz-ui/commit/8cc99bf5))
- **docs:** Accessibilty - support of rtl direction ([aa715eda](https://github.com/LouisMazel/maz-ui/commit/aa715eda))
- **maz-ui:** MazDatePicker - show hour in input only if time picker is enabled ([5a4701c8](https://github.com/LouisMazel/maz-ui/commit/5a4701c8))
- **maz-ui:** Minor improvements in MazBtn, MazIcon and composables ([b4fec020](https://github.com/LouisMazel/maz-ui/commit/b4fec020))
- **@maz-ui/icons:** Improve tree-shaking with individual icon files ([dc0bd1f8](https://github.com/LouisMazel/maz-ui/commit/dc0bd1f8))

### 💄 Styles

- **maz-ui:** MazBtn - adjust text color of background and contrast colors ([84b265c5](https://github.com/LouisMazel/maz-ui/commit/84b265c5))
- **maz-ui:** MazPopover - use text foreground for background color ([a1f40d8e](https://github.com/LouisMazel/maz-ui/commit/a1f40d8e))
- **maz-ui:** MazRadioButtons - use provided color for the button borders ([0cf90bfc](https://github.com/LouisMazel/maz-ui/commit/0cf90bfc))
- **maz-ui:** Toaster - toast has different style between dark and light ([81afe160](https://github.com/LouisMazel/maz-ui/commit/81afe160))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.7...v4.1.7-beta.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.7...v4.1.7-beta.8)

### 💅 Refactors

- **@maz-ui/icons:** Improve tree-shaking with individual icon files ([c0838f05](https://github.com/LouisMazel/maz-ui/commit/c0838f05))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.6...v4.1.7-beta.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.6...v4.1.7-beta.7)

### 🚀 Features

- **maz-ui:** Add parallel upload with worker pool and enhanced file type detection in MazDropzone ([fe9b489c](https://github.com/LouisMazel/maz-ui/commit/fe9b489c))

### 💅 Refactors

- **maz-ui:** Minor improvements in MazBtn, MazIcon and composables ([1186d201](https://github.com/LouisMazel/maz-ui/commit/1186d201))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.5...v4.1.7-beta.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.5...v4.1.7-beta.6)

### 🩹 Fixes

- **maz-ui:** MazSelect - search input padding and scroll to option behavior ([cdd1fdbb](https://github.com/LouisMazel/maz-ui/commit/cdd1fdbb))
- **maz-ui:** MazDatePicker - popover won't open when MazDatePicker is lazy loaded ([8e29f870](https://github.com/LouisMazel/maz-ui/commit/8e29f870))

### 💅 Refactors

- **maz-ui:** MazAnimatedElement & MazAnimatedText - animation optimization with requestAnimationFrame ([719a4002](https://github.com/LouisMazel/maz-ui/commit/719a4002))
- **maz-ui:** Accessibilty - support of rtl direction ([9bd1a3d9](https://github.com/LouisMazel/maz-ui/commit/9bd1a3d9))
- **docs:** Accessibilty - support of rtl direction ([b7c04c49](https://github.com/LouisMazel/maz-ui/commit/b7c04c49))
- **maz-ui:** MazDatePicker - show hour in input only if time picker is enabled ([a020562b](https://github.com/LouisMazel/maz-ui/commit/a020562b))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.4...v4.1.7-beta.5

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.4...v4.1.7-beta.5)

### 🩹 Fixes

- Plugin declarations component custom properties - fix #1331 ([#1331](https://github.com/LouisMazel/maz-ui/issues/1331))
- **maz-ui:** MazInput - reduce complexity of css selectors - fix #1319 ([#1319](https://github.com/LouisMazel/maz-ui/issues/1319))

### 💅 Refactors

- **maz-ui:** UseMutationObserver - can be used outside from setup function ([32f0ee5b](https://github.com/LouisMazel/maz-ui/commit/32f0ee5b))

### 💄 Styles

- **maz-ui:** MazRadioButtons - use provided color for the button borders ([0e52a678](https://github.com/LouisMazel/maz-ui/commit/0e52a678))
- **maz-ui:** Toaster - toast has different style between dark and light ([bded3e77](https://github.com/LouisMazel/maz-ui/commit/bded3e77))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.3...v4.1.7-beta.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.3...v4.1.7-beta.4)

### 🩹 Fixes

- **maz-ui:** MazDatePicker - custom shortcuts was not displayed ([f232da95](https://github.com/LouisMazel/maz-ui/commit/f232da95))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.2...v4.1.7-beta.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.2...v4.1.7-beta.3)

### 🩹 Fixes

- **maz-ui:** MazSelect - multiple not working, correct declaration type of props ([0fe6791f](https://github.com/LouisMazel/maz-ui/commit/0fe6791f))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.1...v4.1.7-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.1...v4.1.7-beta.2)

### 💅 Refactors

- **maz-ui:** MazCard - ensure card has no zoom feature on gallery when it's linked ([0dd16faa](https://github.com/LouisMazel/maz-ui/commit/0dd16faa))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.0...v4.1.7-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.0...v4.1.7-beta.1)

### 🩹 Fixes

- **maz-ui:** MazCard - a linked card should not have zoom feature on the gallery ([863fb1cf](https://github.com/LouisMazel/maz-ui/commit/863fb1cf))
- **maz-ui:** MazDropdown - correct prop heritage to popover component ([cd679d9d](https://github.com/LouisMazel/maz-ui/commit/cd679d9d))
- **maz-ui:** MazSelect - selected option should be focus on open & selected option focused has outline style ([5807d3bf](https://github.com/LouisMazel/maz-ui/commit/5807d3bf))

### 💅 Refactors

- **maz-ui:** MazDatePicker - prefer-position and fallback-position are controllable with props ([30935856](https://github.com/LouisMazel/maz-ui/commit/30935856))
- **maz-ui:** MazLink - supports background, muted and contrast colors ([b44858f5](https://github.com/LouisMazel/maz-ui/commit/b44858f5))
- **maz-ui:** MazLink - supports colors 'none' to inherits color from parent ([e46367f0](https://github.com/LouisMazel/maz-ui/commit/e46367f0))
- **maz-ui:** MazLink - rename 'none' to 'inherit' ([a69f356a](https://github.com/LouisMazel/maz-ui/commit/a69f356a))
- **maz-ui:** MazPopover - remove width max-content ([b2abc9f6](https://github.com/LouisMazel/maz-ui/commit/b2abc9f6))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.6...v4.1.7-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.6...v4.1.7-beta.0)

### 💄 Styles

- **maz-ui:** MazBtn - adjust text color of background and contrast colors ([6db8243b](https://github.com/LouisMazel/maz-ui/commit/6db8243b))
- **maz-ui:** MazPopover - use text foreground for background color ([7f594790](https://github.com/LouisMazel/maz-ui/commit/7f594790))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.5...v4.1.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.5...v4.1.6)

**Note:** No relevant commits found

## v4.1.4...v4.1.5

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.4...v4.1.5)

**Note:** No relevant commits found

## v4.1.3...v4.1.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.3...v4.1.4)

**Note:** No relevant commits found

## v4.1.2...v4.1.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.2...v4.1.3)

### 💅 Refactors

- **maz-ui:** MazRadioButtons - introduce size prop option ([4f52fb43d](https://github.com/LouisMazel/maz-ui/commit/4f52fb43d))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.1-beta.1...v4.1.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.1...v4.1.2)

### 🩹 Fixes

- **maz-ui:** MazSelect - reactivity warning with useTemplateRef - fix #1305 ([#1305](https://github.com/LouisMazel/maz-ui/issues/1305))
- **maz-ui:** MazSelect - reactivity warning with useTemplateRef - fix #1305 ([#1305](https://github.com/LouisMazel/maz-ui/issues/1305))
- **maz-ui:** MazBtn - remove width max-content CSS rule ([2b3d69f9a](https://github.com/LouisMazel/maz-ui/commit/2b3d69f9a))

### 📖 Documentation

- **maz-ui:** Updte readme with plugin installation ([305be8a89](https://github.com/LouisMazel/maz-ui/commit/305be8a89))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.1-beta.0...v4.1.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.0...v4.1.1)

### 🩹 Fixes

- **maz-ui:** MazSelect - reactivity warning with useTemplateRef - fix #1305 ([#1305](https://github.com/LouisMazel/maz-ui/issues/1305))
- **maz-ui:** MazSelect - reactivity warning with useTemplateRef - fix #1305 ([#1305](https://github.com/LouisMazel/maz-ui/issues/1305))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.1-beta.0...v4.1.1-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.0...v4.1.1-beta.1)

**Note:** No relevant commits found

## v4.1.0...v4.1.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.0...v4.1.1-beta.0)

### 🩹 Fixes

- **maz-ui:** MazSelect - reactivity warning with useTemplateRef - fix #1305 ([#1305](https://github.com/LouisMazel/maz-ui/issues/1305))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.1...v4.1.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.1...v4.1.0)

### 🚀 Features

- **maz-ui:** Add new composable - useMutationObserver ([01f6edc84](https://github.com/LouisMazel/maz-ui/commit/01f6edc84))

### 🩹 Fixes

- **maz-ui:** MazDatePicker - correct position ref selector for popover ([bc8e729c7](https://github.com/LouisMazel/maz-ui/commit/bc8e729c7))
- **maz-ui:** MazSelect - reactivity warning with optionList ref - fix #1305 ([#1305](https://github.com/LouisMazel/maz-ui/issues/1305))

### 💅 Refactors

- **maz-ui:** MazBtn - add with max-content to fit with content ([62c125832](https://github.com/LouisMazel/maz-ui/commit/62c125832))

### 💄 Styles

- **maz-ui:** MazInput - adjust position of floating label ([319a6200e](https://github.com/LouisMazel/maz-ui/commit/319a6200e))
- **maz-ui:** MazBtn - adjust icon sizing/spacing and pastel variant colors ([6ff110469](https://github.com/LouisMazel/maz-ui/commit/6ff110469))
- **maz-ui:** MazBadge - adujst color of pastel variant ([29a6cc3fa](https://github.com/LouisMazel/maz-ui/commit/29a6cc3fa))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.39...v4.0.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.39...v4.0.1)

### 💅 Refactors

- **maz-ui:** Disable heritage attributs for some components ([8222257d4](https://github.com/LouisMazel/maz-ui/commit/8222257d4))
- **maz-ui:** Adjust destructive color to be darker ([f9bef9710](https://github.com/LouisMazel/maz-ui/commit/f9bef9710))
- **maz-ui:** MazBtn, MazBadge - adjust colors of pastel variant ([23e5cfed2](https://github.com/LouisMazel/maz-ui/commit/23e5cfed2))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.39...v4.0.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.39...v4.0.0)

**Note:** No relevant commits found

## v4.0.0-beta.37...v4.0.0-beta.38

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.37...v4.0.0-beta.38)

**Note:** No relevant commits found

## v4.0.0-beta.36...v4.0.0-beta.37

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.36...v4.0.0-beta.37)

### 🚀 Features

- **maz-ui:** MazDropdown - Add transition option to choose customize the animation ([7c0ebe468](https://github.com/LouisMazel/maz-ui/commit/7c0ebe468))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.35...v4.0.0-beta.36

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.35...v4.0.0-beta.36)

**Note:** No relevant commits found

## v4.0.0-beta.34...v4.0.0-beta.35

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.34...v4.0.0-beta.35)

### 🩹 Fixes

- **maz-ui:** MazBackdrop - listen pointerdown instead click on backdrop to close the dialog - fix #1211 ([#1211](https://github.com/LouisMazel/maz-ui/issues/1211))

### 💅 Refactors

- **maz-ui:** MazBackdrop - accessibility and UX improvements ([34fe331f2](https://github.com/LouisMazel/maz-ui/commit/34fe331f2))
- **maz-ui:** MazDialog - remove onBackdropClicked from slot properties ([72746bc25](https://github.com/LouisMazel/maz-ui/commit/72746bc25))
- **maz-ui:** Adjust colors after theme changes ([b6138450e](https://github.com/LouisMazel/maz-ui/commit/b6138450e))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.33...v4.0.0-beta.34

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.33...v4.0.0-beta.34)

### 💅 Refactors

- **maz-ui:** MazCardSpotlight - set padding min to 1px ([11d5861cf](https://github.com/LouisMazel/maz-ui/commit/11d5861cf))
- **maz-ui:** Toast - set progress bar position min to 1px from bottom ([b5acb1724](https://github.com/LouisMazel/maz-ui/commit/b5acb1724))
- **maz-ui:** MazPopover - set trap focus for dropdown menu ([04630b4fe](https://github.com/LouisMazel/maz-ui/commit/04630b4fe))
- **maz-ui:** UseDisplayNames - add type descriptions and improve reactivity ([b0556695c](https://github.com/LouisMazel/maz-ui/commit/b0556695c))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.32...v4.0.0-beta.33

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.32...v4.0.0-beta.33)

### 🩹 Fixes

- **maz-ui:** VTooltip - destroy instances not open ([05f48c1db](https://github.com/LouisMazel/maz-ui/commit/05f48c1db))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.31...v4.0.0-beta.32

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.31...v4.0.0-beta.32)

**Note:** No relevant commits found

## v4.0.0-beta.30...v4.0.0-beta.31

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.30...v4.0.0-beta.31)

### 🚀 Features

- **maz-ui:** MazDatePicker - add a new option 'min-max-auto' to set or not set the current date to the minimum or maximum date when it is not in between ([8a2a8455a](https://github.com/LouisMazel/maz-ui/commit/8a2a8455a))

### 🩹 Fixes

- **maz-ui:** MazBtn - add background color for 'background' color instead of transparent ([d7e32cd74](https://github.com/LouisMazel/maz-ui/commit/d7e32cd74))

### 💅 Refactors

- **maz-ui:** VTooltip - remove useless container to avoid DOM injection ([5bf2a62ee](https://github.com/LouisMazel/maz-ui/commit/5bf2a62ee))
- **maz-ui:** MazPopover - render trigger slot only if element is provided and add transition animation ([e42087f44](https://github.com/LouisMazel/maz-ui/commit/e42087f44))
- **maz-ui:** MazCard - update style of title and subtitle ([5d5f9ecd0](https://github.com/LouisMazel/maz-ui/commit/5d5f9ecd0))
- **maz-ui:** MazCarousel - add title prop and customize scroll bar ([9749b01d6](https://github.com/LouisMazel/maz-ui/commit/9749b01d6))
- **maz-ui:** MazDropdown - use 'background' color by default ([64157821c](https://github.com/LouisMazel/maz-ui/commit/64157821c))
- **maz-ui:** MazSelect - add prop 'transition' to choose the animation of the list option ([43d9855b1](https://github.com/LouisMazel/maz-ui/commit/43d9855b1))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.29...v4.0.0-beta.30

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.29...v4.0.0-beta.30)

**Note:** No relevant commits found

## v4.0.0-beta.28...v4.0.0-beta.29

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.28...v4.0.0-beta.29)

**Note:** No relevant commits found

## v4.0.0-beta.27...v4.0.0-beta.28

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.27...v4.0.0-beta.28)

**Note:** No relevant commits found

## v4.0.0-beta.26...v4.0.0-beta.27

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.26...v4.0.0-beta.27)

### 🩹 Fixes

- **maz-ui:** UseInstanceUniqId - hydration issue with nuxt ([3ec0c846b](https://github.com/LouisMazel/maz-ui/commit/3ec0c846b))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.25...v4.0.0-beta.26

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.25...v4.0.0-beta.26)

**Note:** No relevant commits found

## v4.0.0-beta.24...v4.0.0-beta.25

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.24...v4.0.0-beta.25)

**Note:** No relevant commits found

## v4.0.0-beta.23...v4.0.0-beta.24

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.23...v4.0.0-beta.24)

### 🩹 Fixes

- **maz-ui:** Enhanced positioning in MazPopover component ([4b00355af](https://github.com/LouisMazel/maz-ui/commit/4b00355af))
- **maz-ui:** Add position reference to MazDatePicker for improved positioning of panel ([6d08f2efe](https://github.com/LouisMazel/maz-ui/commit/6d08f2efe))

### 💅 Refactors

- **maz-ui:** Update MazPopover component to support autoPlacement and improve positioning logic ([efd4450c7](https://github.com/LouisMazel/maz-ui/commit/efd4450c7))
- **maz-ui:** Update position handling in MazDatePicker, MazSelect, and MazSelectCountry components to support new positioning values and improve default behavior ([3008e4a93](https://github.com/LouisMazel/maz-ui/commit/3008e4a93))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.22...v4.0.0-beta.23

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.22...v4.0.0-beta.23)

### 🩹 Fixes

- **maz-ui:** MazDatePicker, MazDropdown, MazInput, MazSelect - should follow parent sizes ([8f2b58058](https://github.com/LouisMazel/maz-ui/commit/8f2b58058))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.21...v4.0.0-beta.22

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.21...v4.0.0-beta.22)

### 🩹 Fixes

- **maz-ui:** Update MazDropdown component to disable closeOnClick and enhance trigger handling ([a6fa4d874](https://github.com/LouisMazel/maz-ui/commit/a6fa4d874))
- **maz-ui:** Update file data binding types in MazDropzone component ([069ecaf75](https://github.com/LouisMazel/maz-ui/commit/069ecaf75))

### 💅 Refactors

- **maz-ui:** Update MazPopover component to enhance type definitions and improve hover delay ([bc7a74b56](https://github.com/LouisMazel/maz-ui/commit/bc7a74b56))
- **maz-ui:** Enhance type definitions in MazRadioButtons component for improved flexibility ([c6566be07](https://github.com/LouisMazel/maz-ui/commit/c6566be07))
- **maz-ui:** Update MazToast component styles and button handling for improved UI consistency ([623fa238b](https://github.com/LouisMazel/maz-ui/commit/623fa238b))
- **maz-ui:** Improve positioning logic and cleanup in MazPopover component for better performance and reliability ([25004046a](https://github.com/LouisMazel/maz-ui/commit/25004046a))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.20...v4.0.0-beta.21

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.20...v4.0.0-beta.21)

### 🚀 Features

- **@maz-ui/nuxt:** Detecte nuxt pages on spa mode ([5aade8a64](https://github.com/LouisMazel/maz-ui/commit/5aade8a64))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.19...v4.0.0-beta.20

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.19...v4.0.0-beta.20)

**Note:** No relevant commits found

## v4.0.0-beta.18...v4.0.0-beta.19

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.18...v4.0.0-beta.19)

### 🚀 Features

- **maz-ui:** V4.0.0 ([c5309b260](https://github.com/LouisMazel/maz-ui/commit/c5309b260))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **maz-ui:** MazSlider - add step option ([eafb4cf56](https://github.com/LouisMazel/maz-ui/commit/eafb4cf56))
- **@maz-ui/icons:** Add new @maz-ui/icons package to export SVG icons and Vue JS components icons ([cb1a243dd](https://github.com/LouisMazel/maz-ui/commit/cb1a243dd))
- **maz-ui:** Plugin Toaster and useToast - improve UI and UX of toast (BREAKING_CHANGES) ([414e1c6b5](https://github.com/LouisMazel/maz-ui/commit/414e1c6b5))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([6254ffa7e](https://github.com/LouisMazel/maz-ui/commit/6254ffa7e))
- **@maz-ui/nuxt:** New standalone package for the nuxt module (no longer included in maz-ui bundle) ([2922aed6a](https://github.com/LouisMazel/maz-ui/commit/2922aed6a))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([d81463fc0](https://github.com/LouisMazel/maz-ui/commit/d81463fc0))
- **@maz-ui/nuxt:** Implemente @maz-ui/themes - set and manage themes with nuxt ([0dc3d8656](https://github.com/LouisMazel/maz-ui/commit/0dc3d8656))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([f6978f418](https://github.com/LouisMazel/maz-ui/commit/f6978f418))
- **maz-ui:** MazPopover - new component to display content as overlay ([e84fc95fa](https://github.com/LouisMazel/maz-ui/commit/e84fc95fa))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([41516f9af](https://github.com/LouisMazel/maz-ui/commit/41516f9af))
- **maz-ui:** MazSelect - use popover to display option list ([5383c51e4](https://github.com/LouisMazel/maz-ui/commit/5383c51e4))
- **maz-ui:** MazDropdown - use popover to display the dropdown menu ([3b0ac1188](https://github.com/LouisMazel/maz-ui/commit/3b0ac1188))
- **maz-ui:** MazInputPhoneNumber - display formatted number as input value ([96741a145](https://github.com/LouisMazel/maz-ui/commit/96741a145))
- **maz-ui:** MazInputPhoneNumber, MazSelect, MazDropdown and vTooltip display the content in a popover ([d92eed803](https://github.com/LouisMazel/maz-ui/commit/d92eed803))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([05f936be9](https://github.com/LouisMazel/maz-ui/commit/05f936be9))
- **maz-ui:** MazSelectCountry - new form component to select country and languages ([c04555fa1](https://github.com/LouisMazel/maz-ui/commit/c04555fa1))
- **@maz-ui/themes:** Use cookie to store color mode ([e9853bec1](https://github.com/LouisMazel/maz-ui/commit/e9853bec1))
- **maz-ui:** MazUi plugin can install plugins and directives ([2c4c6436b](https://github.com/LouisMazel/maz-ui/commit/2c4c6436b))
- **maz-ui:** MazGallery - add prop option to choose background color ([2986c9425](https://github.com/LouisMazel/maz-ui/commit/2986c9425))
- **maz-ui:** MazDropdown, Mazpopover - new trigger mode 'adaptive' for desktop and mobile ([9d5b51a6a](https://github.com/LouisMazel/maz-ui/commit/9d5b51a6a))
- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([99a4d0f3b](https://github.com/LouisMazel/maz-ui/commit/99a4d0f3b))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([10258f4ae](https://github.com/LouisMazel/maz-ui/commit/10258f4ae))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([7c5b6827d](https://github.com/LouisMazel/maz-ui/commit/7c5b6827d))
- **maz-ui:** MazPopover - improve popover position placement and animations ([5eadd40f8](https://github.com/LouisMazel/maz-ui/commit/5eadd40f8))
- **maz-ui:** Add vite/client types into tsconfig ([a0ff04adc](https://github.com/LouisMazel/maz-ui/commit/a0ff04adc))
- **maz-ui:** Rename MazDialogPromise component to MazDialogConfirm and add more button options ([e175d0d64](https://github.com/LouisMazel/maz-ui/commit/e175d0d64))
- **maz-ui:** MazInput - add loading state component with spinner support ([5be37b824](https://github.com/LouisMazel/maz-ui/commit/5be37b824))
- **maz-ui:** MazDialogConfirm - add option to hide default buttons ([faaec8d5f](https://github.com/LouisMazel/maz-ui/commit/faaec8d5f))
- **maz-ui:** Replace alpha color used as background color in components ([af41870a6](https://github.com/LouisMazel/maz-ui/commit/af41870a6))
- **maz-ui:** V4.0.0 ([e160a883b](https://github.com/LouisMazel/maz-ui/commit/e160a883b))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **maz-ui:** MazSlider - add step option ([af399673a](https://github.com/LouisMazel/maz-ui/commit/af399673a))
- **@maz-ui/icons:** Add new @maz-ui/icons package to export SVG icons and Vue JS components icons ([3d4701bdd](https://github.com/LouisMazel/maz-ui/commit/3d4701bdd))
- **maz-ui:** Plugin Toaster and useToast - improve UI and UX of toast (BREAKING_CHANGES) ([7ad14ee68](https://github.com/LouisMazel/maz-ui/commit/7ad14ee68))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([84366e00b](https://github.com/LouisMazel/maz-ui/commit/84366e00b))
- **@maz-ui/nuxt:** New standalone package for the nuxt module (no longer included in maz-ui bundle) ([9b1439661](https://github.com/LouisMazel/maz-ui/commit/9b1439661))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([5c5a8f4f4](https://github.com/LouisMazel/maz-ui/commit/5c5a8f4f4))
- **@maz-ui/nuxt:** Implemente @maz-ui/themes - set and manage themes with nuxt ([7915d1e73](https://github.com/LouisMazel/maz-ui/commit/7915d1e73))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([58344db69](https://github.com/LouisMazel/maz-ui/commit/58344db69))
- **maz-ui:** MazPopover - new component to display content as overlay ([e36029d4b](https://github.com/LouisMazel/maz-ui/commit/e36029d4b))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([a1cdaf475](https://github.com/LouisMazel/maz-ui/commit/a1cdaf475))
- **maz-ui:** MazSelect - use popover to display option list ([d5292e71c](https://github.com/LouisMazel/maz-ui/commit/d5292e71c))
- **maz-ui:** MazDropdown - use popover to display the dropdown menu ([14c614bd4](https://github.com/LouisMazel/maz-ui/commit/14c614bd4))
- **maz-ui:** MazInputPhoneNumber - display formatted number as input value ([28e323b76](https://github.com/LouisMazel/maz-ui/commit/28e323b76))
- **maz-ui:** MazInputPhoneNumber, MazSelect, MazDropdown and vTooltip display the content in a popover ([9ec5e3a99](https://github.com/LouisMazel/maz-ui/commit/9ec5e3a99))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([edebcbf3d](https://github.com/LouisMazel/maz-ui/commit/edebcbf3d))
- **maz-ui:** MazSelectCountry - new form component to select country and languages ([38111a052](https://github.com/LouisMazel/maz-ui/commit/38111a052))
- **@maz-ui/themes:** Use cookie to store color mode ([f20621394](https://github.com/LouisMazel/maz-ui/commit/f20621394))
- **maz-ui:** MazUi plugin can install plugins and directives ([ddc43c81d](https://github.com/LouisMazel/maz-ui/commit/ddc43c81d))
- **maz-ui:** MazGallery - add prop option to choose background color ([05ffe009e](https://github.com/LouisMazel/maz-ui/commit/05ffe009e))
- **maz-ui:** MazDropdown, Mazpopover - new trigger mode 'adaptive' for desktop and mobile ([c20abbad6](https://github.com/LouisMazel/maz-ui/commit/c20abbad6))
- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([25facb424](https://github.com/LouisMazel/maz-ui/commit/25facb424))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([809916edc](https://github.com/LouisMazel/maz-ui/commit/809916edc))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([0ae52a962](https://github.com/LouisMazel/maz-ui/commit/0ae52a962))
- **maz-ui:** MazPopover - improve popover position placement and animations ([4985cf3b3](https://github.com/LouisMazel/maz-ui/commit/4985cf3b3))
- **maz-ui:** Add vite/client types into tsconfig ([dae257b2d](https://github.com/LouisMazel/maz-ui/commit/dae257b2d))
- **maz-ui:** Rename MazDialogPromise component to MazDialogConfirm and add more button options ([15d054acc](https://github.com/LouisMazel/maz-ui/commit/15d054acc))
- **maz-ui:** MazInput - add loading state component with spinner support ([09efa2d90](https://github.com/LouisMazel/maz-ui/commit/09efa2d90))
- **maz-ui:** MazDialogConfirm - add option to hide default buttons ([2950bbe6a](https://github.com/LouisMazel/maz-ui/commit/2950bbe6a))
- **maz-ui:** Replace alpha color used as background color in components ([e04eab776](https://github.com/LouisMazel/maz-ui/commit/e04eab776))

### 🔥 Performance

- **maz-ui:** Toast uses passive event to improve perf ([fbc2d5f11](https://github.com/LouisMazel/maz-ui/commit/fbc2d5f11))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([f2f4f275a](https://github.com/LouisMazel/maz-ui/commit/f2f4f275a))
- **maz-ui:** Toast uses passive event to improve perf ([31fbb3b75](https://github.com/LouisMazel/maz-ui/commit/31fbb3b75))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([78911e4cf](https://github.com/LouisMazel/maz-ui/commit/78911e4cf))

### 🩹 Fixes

- Update component paths and improve documentation references ([c1fe6d72c](https://github.com/LouisMazel/maz-ui/commit/c1fe6d72c))
- **@maz-ui/icons:** Export svg files correctly ([5ede33435](https://github.com/LouisMazel/maz-ui/commit/5ede33435))
- **maz-ui:** Utilities export path ([6bb55de9c](https://github.com/LouisMazel/maz-ui/commit/6bb55de9c))
- Add --concurrency=1 to nx:affected:pre-commit to fix lint-staged backup issue ([c85f3d3d1](https://github.com/LouisMazel/maz-ui/commit/c85f3d3d1))
- **maz-ui:** UseFormField - improve types ([0c18dd1ad](https://github.com/LouisMazel/maz-ui/commit/0c18dd1ad))
- **maz-ui:** UseFormField & useFormValidator - improve types ([71b32a04f](https://github.com/LouisMazel/maz-ui/commit/71b32a04f))
- **@maz-ui/nuxt:** Inject initial color choosen ([b5b9d3d2f](https://github.com/LouisMazel/maz-ui/commit/b5b9d3d2f))
- Update component paths and improve documentation references ([b6a7101c8](https://github.com/LouisMazel/maz-ui/commit/b6a7101c8))
- **@maz-ui/icons:** Export svg files correctly ([eb654c44c](https://github.com/LouisMazel/maz-ui/commit/eb654c44c))
- **maz-ui:** Utilities export path ([93c84ce9f](https://github.com/LouisMazel/maz-ui/commit/93c84ce9f))
- Add --concurrency=1 to nx:affected:pre-commit to fix lint-staged backup issue ([bac680821](https://github.com/LouisMazel/maz-ui/commit/bac680821))
- **maz-ui:** UseFormField - improve types ([a919a7614](https://github.com/LouisMazel/maz-ui/commit/a919a7614))
- **maz-ui:** UseFormField & useFormValidator - improve types ([452d07b43](https://github.com/LouisMazel/maz-ui/commit/452d07b43))
- **@maz-ui/nuxt:** Inject initial color choosen ([4d24387d4](https://github.com/LouisMazel/maz-ui/commit/4d24387d4))

### 💅 Refactors

- **maz-ui:** MazPicker - improve UI and UX ([03b5a6fe6](https://github.com/LouisMazel/maz-ui/commit/03b5a6fe6))
- **maz-ui:** MazInput - improve UI and UX (BREAKING_CHANGES) ([413c2688c](https://github.com/LouisMazel/maz-ui/commit/413c2688c))
- **maz-ui:** Apply default border color to components ([98566be9c](https://github.com/LouisMazel/maz-ui/commit/98566be9c))
- **@maz-ui/themes:** Compatibility with vue and nuxt improvements ([53ccfd3c9](https://github.com/LouisMazel/maz-ui/commit/53ccfd3c9))
- **maz-ui:** MazBtn, MazBadge - rename props outline to outlined ([f750b2616](https://github.com/LouisMazel/maz-ui/commit/f750b2616))
- **maz-ui:** Rename toaster plugin to toast ([a69040c61](https://github.com/LouisMazel/maz-ui/commit/a69040c61))
- **maz-ui:** MazLink can be a button ([e97412aa2](https://github.com/LouisMazel/maz-ui/commit/e97412aa2))
- **maz-ui:** Typescript support improvements for directives ([320436e4d](https://github.com/LouisMazel/maz-ui/commit/320436e4d))
- **@maz-ui/translations:** Improve locale messages lazy loading ([daae8c871](https://github.com/LouisMazel/maz-ui/commit/daae8c871))
- **maz-ui:** MazPicker - improve UI and UX ([5963014d3](https://github.com/LouisMazel/maz-ui/commit/5963014d3))
- **maz-ui:** MazInput - improve UI and UX (BREAKING_CHANGES) ([ed98285ad](https://github.com/LouisMazel/maz-ui/commit/ed98285ad))
- **maz-ui:** Apply default border color to components ([99d7956a9](https://github.com/LouisMazel/maz-ui/commit/99d7956a9))
- **@maz-ui/themes:** Compatibility with vue and nuxt improvements ([7201434c3](https://github.com/LouisMazel/maz-ui/commit/7201434c3))
- **maz-ui:** MazBtn, MazBadge - rename props outline to outlined ([c2361c9bf](https://github.com/LouisMazel/maz-ui/commit/c2361c9bf))
- **maz-ui:** Rename toaster plugin to toast ([e75c44553](https://github.com/LouisMazel/maz-ui/commit/e75c44553))
- **maz-ui:** MazLink can be a button ([9412e72e8](https://github.com/LouisMazel/maz-ui/commit/9412e72e8))
- **maz-ui:** Typescript support improvements for directives ([23ae58472](https://github.com/LouisMazel/maz-ui/commit/23ae58472))
- **@maz-ui/translations:** Improve locale messages lazy loading ([6c64cfec2](https://github.com/LouisMazel/maz-ui/commit/6c64cfec2))

### 📖 Documentation

- **docs:** @maz-ui/nuxt - new documentation ([47ebb0a99](https://github.com/LouisMazel/maz-ui/commit/47ebb0a99))
- **docs:** Add documentation about resolvers ([bef76e9ea](https://github.com/LouisMazel/maz-ui/commit/bef76e9ea))
- **docs:** @maz-ui/nuxt - new documentation ([4294d5f9a](https://github.com/LouisMazel/maz-ui/commit/4294d5f9a))
- **docs:** Add documentation about resolvers ([05e79969c](https://github.com/LouisMazel/maz-ui/commit/05e79969c))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.17...v4.0.0-beta.18

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.17...v4.0.0-beta.18)

### 🚀 Features

- **maz-ui:** V4.0.0 ([c5309b260](https://github.com/LouisMazel/maz-ui/commit/c5309b260))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **maz-ui:** MazSlider - add step option ([eafb4cf56](https://github.com/LouisMazel/maz-ui/commit/eafb4cf56))
- **@maz-ui/icons:** Add new @maz-ui/icons package to export SVG icons and Vue JS components icons ([cb1a243dd](https://github.com/LouisMazel/maz-ui/commit/cb1a243dd))
- **maz-ui:** Plugin Toaster and useToast - improve UI and UX of toast (BREAKING_CHANGES) ([414e1c6b5](https://github.com/LouisMazel/maz-ui/commit/414e1c6b5))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([6254ffa7e](https://github.com/LouisMazel/maz-ui/commit/6254ffa7e))
- **@maz-ui/nuxt:** New standalone package for the nuxt module (no longer included in maz-ui bundle) ([2922aed6a](https://github.com/LouisMazel/maz-ui/commit/2922aed6a))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([d81463fc0](https://github.com/LouisMazel/maz-ui/commit/d81463fc0))
- **@maz-ui/nuxt:** Implemente @maz-ui/themes - set and manage themes with nuxt ([0dc3d8656](https://github.com/LouisMazel/maz-ui/commit/0dc3d8656))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([f6978f418](https://github.com/LouisMazel/maz-ui/commit/f6978f418))
- **maz-ui:** MazPopover - new component to display content as overlay ([e84fc95fa](https://github.com/LouisMazel/maz-ui/commit/e84fc95fa))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([41516f9af](https://github.com/LouisMazel/maz-ui/commit/41516f9af))
- **maz-ui:** MazSelect - use popover to display option list ([5383c51e4](https://github.com/LouisMazel/maz-ui/commit/5383c51e4))
- **maz-ui:** MazDropdown - use popover to display the dropdown menu ([3b0ac1188](https://github.com/LouisMazel/maz-ui/commit/3b0ac1188))
- **maz-ui:** MazInputPhoneNumber - display formatted number as input value ([96741a145](https://github.com/LouisMazel/maz-ui/commit/96741a145))
- **maz-ui:** MazInputPhoneNumber, MazSelect, MazDropdown and vTooltip display the content in a popover ([d92eed803](https://github.com/LouisMazel/maz-ui/commit/d92eed803))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([05f936be9](https://github.com/LouisMazel/maz-ui/commit/05f936be9))
- **maz-ui:** MazSelectCountry - new form component to select country and languages ([c04555fa1](https://github.com/LouisMazel/maz-ui/commit/c04555fa1))
- **@maz-ui/themes:** Use cookie to store color mode ([e9853bec1](https://github.com/LouisMazel/maz-ui/commit/e9853bec1))
- **maz-ui:** MazUi plugin can install plugins and directives ([2c4c6436b](https://github.com/LouisMazel/maz-ui/commit/2c4c6436b))
- **maz-ui:** MazGallery - add prop option to choose background color ([2986c9425](https://github.com/LouisMazel/maz-ui/commit/2986c9425))
- **maz-ui:** MazDropdown, Mazpopover - new trigger mode 'adaptive' for desktop and mobile ([9d5b51a6a](https://github.com/LouisMazel/maz-ui/commit/9d5b51a6a))
- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([99a4d0f3b](https://github.com/LouisMazel/maz-ui/commit/99a4d0f3b))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([10258f4ae](https://github.com/LouisMazel/maz-ui/commit/10258f4ae))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([7c5b6827d](https://github.com/LouisMazel/maz-ui/commit/7c5b6827d))
- **maz-ui:** MazPopover - improve popover position placement and animations ([5eadd40f8](https://github.com/LouisMazel/maz-ui/commit/5eadd40f8))
- **maz-ui:** Add vite/client types into tsconfig ([a0ff04adc](https://github.com/LouisMazel/maz-ui/commit/a0ff04adc))
- **maz-ui:** Rename MazDialogPromise component to MazDialogConfirm and add more button options ([e175d0d64](https://github.com/LouisMazel/maz-ui/commit/e175d0d64))
- **maz-ui:** MazInput - add loading state component with spinner support ([5be37b824](https://github.com/LouisMazel/maz-ui/commit/5be37b824))
- **maz-ui:** MazDialogConfirm - add option to hide default buttons ([faaec8d5f](https://github.com/LouisMazel/maz-ui/commit/faaec8d5f))
- **maz-ui:** V4.0.0 ([e160a883b](https://github.com/LouisMazel/maz-ui/commit/e160a883b))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **maz-ui:** MazSlider - add step option ([af399673a](https://github.com/LouisMazel/maz-ui/commit/af399673a))
- **@maz-ui/icons:** Add new @maz-ui/icons package to export SVG icons and Vue JS components icons ([3d4701bdd](https://github.com/LouisMazel/maz-ui/commit/3d4701bdd))
- **maz-ui:** Plugin Toaster and useToast - improve UI and UX of toast (BREAKING_CHANGES) ([7ad14ee68](https://github.com/LouisMazel/maz-ui/commit/7ad14ee68))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([84366e00b](https://github.com/LouisMazel/maz-ui/commit/84366e00b))
- **@maz-ui/nuxt:** New standalone package for the nuxt module (no longer included in maz-ui bundle) ([9b1439661](https://github.com/LouisMazel/maz-ui/commit/9b1439661))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([5c5a8f4f4](https://github.com/LouisMazel/maz-ui/commit/5c5a8f4f4))
- **@maz-ui/nuxt:** Implemente @maz-ui/themes - set and manage themes with nuxt ([7915d1e73](https://github.com/LouisMazel/maz-ui/commit/7915d1e73))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([58344db69](https://github.com/LouisMazel/maz-ui/commit/58344db69))
- **maz-ui:** MazPopover - new component to display content as overlay ([e36029d4b](https://github.com/LouisMazel/maz-ui/commit/e36029d4b))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([a1cdaf475](https://github.com/LouisMazel/maz-ui/commit/a1cdaf475))
- **maz-ui:** MazSelect - use popover to display option list ([d5292e71c](https://github.com/LouisMazel/maz-ui/commit/d5292e71c))
- **maz-ui:** MazDropdown - use popover to display the dropdown menu ([14c614bd4](https://github.com/LouisMazel/maz-ui/commit/14c614bd4))
- **maz-ui:** MazInputPhoneNumber - display formatted number as input value ([28e323b76](https://github.com/LouisMazel/maz-ui/commit/28e323b76))
- **maz-ui:** MazInputPhoneNumber, MazSelect, MazDropdown and vTooltip display the content in a popover ([9ec5e3a99](https://github.com/LouisMazel/maz-ui/commit/9ec5e3a99))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([edebcbf3d](https://github.com/LouisMazel/maz-ui/commit/edebcbf3d))
- **maz-ui:** MazSelectCountry - new form component to select country and languages ([38111a052](https://github.com/LouisMazel/maz-ui/commit/38111a052))
- **@maz-ui/themes:** Use cookie to store color mode ([f20621394](https://github.com/LouisMazel/maz-ui/commit/f20621394))
- **maz-ui:** MazUi plugin can install plugins and directives ([ddc43c81d](https://github.com/LouisMazel/maz-ui/commit/ddc43c81d))
- **maz-ui:** MazGallery - add prop option to choose background color ([05ffe009e](https://github.com/LouisMazel/maz-ui/commit/05ffe009e))
- **maz-ui:** MazDropdown, Mazpopover - new trigger mode 'adaptive' for desktop and mobile ([c20abbad6](https://github.com/LouisMazel/maz-ui/commit/c20abbad6))
- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([25facb424](https://github.com/LouisMazel/maz-ui/commit/25facb424))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([809916edc](https://github.com/LouisMazel/maz-ui/commit/809916edc))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([0ae52a962](https://github.com/LouisMazel/maz-ui/commit/0ae52a962))
- **maz-ui:** MazPopover - improve popover position placement and animations ([4985cf3b3](https://github.com/LouisMazel/maz-ui/commit/4985cf3b3))
- **maz-ui:** Add vite/client types into tsconfig ([dae257b2d](https://github.com/LouisMazel/maz-ui/commit/dae257b2d))
- **maz-ui:** Rename MazDialogPromise component to MazDialogConfirm and add more button options ([15d054acc](https://github.com/LouisMazel/maz-ui/commit/15d054acc))
- **maz-ui:** MazInput - add loading state component with spinner support ([09efa2d90](https://github.com/LouisMazel/maz-ui/commit/09efa2d90))
- **maz-ui:** MazDialogConfirm - add option to hide default buttons ([2950bbe6a](https://github.com/LouisMazel/maz-ui/commit/2950bbe6a))
- **maz-ui:** Replace alpha color used as background color in components ([e04eab776](https://github.com/LouisMazel/maz-ui/commit/e04eab776))

### 🔥 Performance

- **maz-ui:** Toast uses passive event to improve perf ([fbc2d5f11](https://github.com/LouisMazel/maz-ui/commit/fbc2d5f11))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([f2f4f275a](https://github.com/LouisMazel/maz-ui/commit/f2f4f275a))
- **maz-ui:** Toast uses passive event to improve perf ([31fbb3b75](https://github.com/LouisMazel/maz-ui/commit/31fbb3b75))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([78911e4cf](https://github.com/LouisMazel/maz-ui/commit/78911e4cf))

### 🩹 Fixes

- Update component paths and improve documentation references ([c1fe6d72c](https://github.com/LouisMazel/maz-ui/commit/c1fe6d72c))
- **@maz-ui/icons:** Export svg files correctly ([5ede33435](https://github.com/LouisMazel/maz-ui/commit/5ede33435))
- **maz-ui:** Utilities export path ([6bb55de9c](https://github.com/LouisMazel/maz-ui/commit/6bb55de9c))
- Add --concurrency=1 to nx:affected:pre-commit to fix lint-staged backup issue ([c85f3d3d1](https://github.com/LouisMazel/maz-ui/commit/c85f3d3d1))
- **maz-ui:** UseFormField - improve types ([0c18dd1ad](https://github.com/LouisMazel/maz-ui/commit/0c18dd1ad))
- **maz-ui:** UseFormField & useFormValidator - improve types ([71b32a04f](https://github.com/LouisMazel/maz-ui/commit/71b32a04f))
- Update component paths and improve documentation references ([b6a7101c8](https://github.com/LouisMazel/maz-ui/commit/b6a7101c8))
- **@maz-ui/icons:** Export svg files correctly ([eb654c44c](https://github.com/LouisMazel/maz-ui/commit/eb654c44c))
- **maz-ui:** Utilities export path ([93c84ce9f](https://github.com/LouisMazel/maz-ui/commit/93c84ce9f))
- Add --concurrency=1 to nx:affected:pre-commit to fix lint-staged backup issue ([bac680821](https://github.com/LouisMazel/maz-ui/commit/bac680821))
- **maz-ui:** UseFormField - improve types ([a919a7614](https://github.com/LouisMazel/maz-ui/commit/a919a7614))
- **maz-ui:** UseFormField & useFormValidator - improve types ([452d07b43](https://github.com/LouisMazel/maz-ui/commit/452d07b43))
- **@maz-ui/nuxt:** Inject initial color choosen ([4d24387d4](https://github.com/LouisMazel/maz-ui/commit/4d24387d4))

### 💅 Refactors

- **maz-ui:** MazPicker - improve UI and UX ([03b5a6fe6](https://github.com/LouisMazel/maz-ui/commit/03b5a6fe6))
- **maz-ui:** MazInput - improve UI and UX (BREAKING_CHANGES) ([413c2688c](https://github.com/LouisMazel/maz-ui/commit/413c2688c))
- **maz-ui:** Apply default border color to components ([98566be9c](https://github.com/LouisMazel/maz-ui/commit/98566be9c))
- **@maz-ui/themes:** Compatibility with vue and nuxt improvements ([53ccfd3c9](https://github.com/LouisMazel/maz-ui/commit/53ccfd3c9))
- **maz-ui:** MazBtn, MazBadge - rename props outline to outlined ([f750b2616](https://github.com/LouisMazel/maz-ui/commit/f750b2616))
- **maz-ui:** Rename toaster plugin to toast ([a69040c61](https://github.com/LouisMazel/maz-ui/commit/a69040c61))
- **maz-ui:** MazLink can be a button ([e97412aa2](https://github.com/LouisMazel/maz-ui/commit/e97412aa2))
- **maz-ui:** Typescript support improvements for directives ([320436e4d](https://github.com/LouisMazel/maz-ui/commit/320436e4d))
- **@maz-ui/translations:** Improve locale messages lazy loading ([daae8c871](https://github.com/LouisMazel/maz-ui/commit/daae8c871))
- **maz-ui:** MazPicker - improve UI and UX ([5963014d3](https://github.com/LouisMazel/maz-ui/commit/5963014d3))
- **maz-ui:** MazInput - improve UI and UX (BREAKING_CHANGES) ([ed98285ad](https://github.com/LouisMazel/maz-ui/commit/ed98285ad))
- **maz-ui:** Apply default border color to components ([99d7956a9](https://github.com/LouisMazel/maz-ui/commit/99d7956a9))
- **@maz-ui/themes:** Compatibility with vue and nuxt improvements ([7201434c3](https://github.com/LouisMazel/maz-ui/commit/7201434c3))
- **maz-ui:** MazBtn, MazBadge - rename props outline to outlined ([c2361c9bf](https://github.com/LouisMazel/maz-ui/commit/c2361c9bf))
- **maz-ui:** Rename toaster plugin to toast ([e75c44553](https://github.com/LouisMazel/maz-ui/commit/e75c44553))
- **maz-ui:** MazLink can be a button ([9412e72e8](https://github.com/LouisMazel/maz-ui/commit/9412e72e8))
- **maz-ui:** Typescript support improvements for directives ([23ae58472](https://github.com/LouisMazel/maz-ui/commit/23ae58472))
- **@maz-ui/translations:** Improve locale messages lazy loading ([6c64cfec2](https://github.com/LouisMazel/maz-ui/commit/6c64cfec2))

### 📖 Documentation

- **docs:** @maz-ui/nuxt - new documentation ([47ebb0a99](https://github.com/LouisMazel/maz-ui/commit/47ebb0a99))
- **docs:** Add documentation about resolvers ([bef76e9ea](https://github.com/LouisMazel/maz-ui/commit/bef76e9ea))
- **docs:** @maz-ui/nuxt - new documentation ([4294d5f9a](https://github.com/LouisMazel/maz-ui/commit/4294d5f9a))
- **docs:** Add documentation about resolvers ([05e79969c](https://github.com/LouisMazel/maz-ui/commit/05e79969c))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.16...v4.0.0-beta.17

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.16...v4.0.0-beta.17)

**Note:** No relevant commits found

## v4.0.0-beta.15...v4.0.0-beta.16

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.15...v4.0.0-beta.16)

### 🚀 Features

- **maz-ui:** V4.0.0 ([d59c08f2a](https://github.com/LouisMazel/maz-ui/commit/d59c08f2a))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **maz-ui:** MazSlider - add step option ([9becb79c2](https://github.com/LouisMazel/maz-ui/commit/9becb79c2))
- **@maz-ui/icons:** Add new @maz-ui/icons package to export SVG icons and Vue JS components icons ([9e3955d6b](https://github.com/LouisMazel/maz-ui/commit/9e3955d6b))
- **maz-ui:** Plugin Toaster and useToast - improve UI and UX of toast (BREAKING_CHANGES) ([d7617bd74](https://github.com/LouisMazel/maz-ui/commit/d7617bd74))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([b76f65c52](https://github.com/LouisMazel/maz-ui/commit/b76f65c52))
- **@maz-ui/nuxt:** New standalone package for the nuxt module (no longer included in maz-ui bundle) ([d8e4dd466](https://github.com/LouisMazel/maz-ui/commit/d8e4dd466))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([7726ff8e7](https://github.com/LouisMazel/maz-ui/commit/7726ff8e7))
- **@maz-ui/nuxt:** Implemente @maz-ui/themes - set and manage themes with nuxt ([d369b1f62](https://github.com/LouisMazel/maz-ui/commit/d369b1f62))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([bc23c6a66](https://github.com/LouisMazel/maz-ui/commit/bc23c6a66))
- **maz-ui:** MazPopover - new component to display content as overlay ([22d61d056](https://github.com/LouisMazel/maz-ui/commit/22d61d056))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([a6ce6e642](https://github.com/LouisMazel/maz-ui/commit/a6ce6e642))
- **maz-ui:** MazSelect - use popover to display option list ([4bf8d747e](https://github.com/LouisMazel/maz-ui/commit/4bf8d747e))
- **maz-ui:** MazDropdown - use popover to display the dropdown menu ([c3b324e95](https://github.com/LouisMazel/maz-ui/commit/c3b324e95))
- **maz-ui:** MazInputPhoneNumber - display formatted number as input value ([754d1677f](https://github.com/LouisMazel/maz-ui/commit/754d1677f))
- **maz-ui:** MazInputPhoneNumber, MazSelect, MazDropdown and vTooltip display the content in a popover ([44406d094](https://github.com/LouisMazel/maz-ui/commit/44406d094))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([f8c2518f0](https://github.com/LouisMazel/maz-ui/commit/f8c2518f0))
- **maz-ui:** MazSelectCountry - new form component to select country and languages ([97fedf75e](https://github.com/LouisMazel/maz-ui/commit/97fedf75e))
- **@maz-ui/themes:** Use cookie to store color mode ([780157cd7](https://github.com/LouisMazel/maz-ui/commit/780157cd7))
- **maz-ui:** MazUi plugin can install plugins and directives ([68c43f6d4](https://github.com/LouisMazel/maz-ui/commit/68c43f6d4))
- **maz-ui:** MazGallery - add prop option to choose background color ([b1a37eeb6](https://github.com/LouisMazel/maz-ui/commit/b1a37eeb6))
- **maz-ui:** MazDropdown, Mazpopover - new trigger mode 'adaptive' for desktop and mobile ([2ed51aaa9](https://github.com/LouisMazel/maz-ui/commit/2ed51aaa9))
- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([26e1c7b10](https://github.com/LouisMazel/maz-ui/commit/26e1c7b10))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([98d415cc7](https://github.com/LouisMazel/maz-ui/commit/98d415cc7))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([68fdcbf60](https://github.com/LouisMazel/maz-ui/commit/68fdcbf60))
- **maz-ui:** MazPopover - improve popover position placement and animations ([fb9d89cfc](https://github.com/LouisMazel/maz-ui/commit/fb9d89cfc))
- **maz-ui:** Add vite/client types into tsconfig ([f93eb4045](https://github.com/LouisMazel/maz-ui/commit/f93eb4045))
- **maz-ui:** Rename MazDialogPromise component to MazDialogConfirm and add more button options ([3e0f76de7](https://github.com/LouisMazel/maz-ui/commit/3e0f76de7))
- **maz-ui:** MazInput - add loading state component with spinner support ([ec4e0cfef](https://github.com/LouisMazel/maz-ui/commit/ec4e0cfef))
- **maz-ui:** MazDialogConfirm - add option to hide default buttons ([6606917cb](https://github.com/LouisMazel/maz-ui/commit/6606917cb))
- **maz-ui:** V4.0.0 ([c5309b260](https://github.com/LouisMazel/maz-ui/commit/c5309b260))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **maz-ui:** MazSlider - add step option ([eafb4cf56](https://github.com/LouisMazel/maz-ui/commit/eafb4cf56))
- **@maz-ui/icons:** Add new @maz-ui/icons package to export SVG icons and Vue JS components icons ([cb1a243dd](https://github.com/LouisMazel/maz-ui/commit/cb1a243dd))
- **maz-ui:** Plugin Toaster and useToast - improve UI and UX of toast (BREAKING_CHANGES) ([414e1c6b5](https://github.com/LouisMazel/maz-ui/commit/414e1c6b5))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([6254ffa7e](https://github.com/LouisMazel/maz-ui/commit/6254ffa7e))
- **@maz-ui/nuxt:** New standalone package for the nuxt module (no longer included in maz-ui bundle) ([2922aed6a](https://github.com/LouisMazel/maz-ui/commit/2922aed6a))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([d81463fc0](https://github.com/LouisMazel/maz-ui/commit/d81463fc0))
- **@maz-ui/nuxt:** Implemente @maz-ui/themes - set and manage themes with nuxt ([0dc3d8656](https://github.com/LouisMazel/maz-ui/commit/0dc3d8656))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([f6978f418](https://github.com/LouisMazel/maz-ui/commit/f6978f418))
- **maz-ui:** MazPopover - new component to display content as overlay ([e84fc95fa](https://github.com/LouisMazel/maz-ui/commit/e84fc95fa))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([41516f9af](https://github.com/LouisMazel/maz-ui/commit/41516f9af))
- **maz-ui:** MazSelect - use popover to display option list ([5383c51e4](https://github.com/LouisMazel/maz-ui/commit/5383c51e4))
- **maz-ui:** MazDropdown - use popover to display the dropdown menu ([3b0ac1188](https://github.com/LouisMazel/maz-ui/commit/3b0ac1188))
- **maz-ui:** MazInputPhoneNumber - display formatted number as input value ([96741a145](https://github.com/LouisMazel/maz-ui/commit/96741a145))
- **maz-ui:** MazInputPhoneNumber, MazSelect, MazDropdown and vTooltip display the content in a popover ([d92eed803](https://github.com/LouisMazel/maz-ui/commit/d92eed803))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([05f936be9](https://github.com/LouisMazel/maz-ui/commit/05f936be9))
- **maz-ui:** MazSelectCountry - new form component to select country and languages ([c04555fa1](https://github.com/LouisMazel/maz-ui/commit/c04555fa1))
- **@maz-ui/themes:** Use cookie to store color mode ([e9853bec1](https://github.com/LouisMazel/maz-ui/commit/e9853bec1))
- **maz-ui:** MazUi plugin can install plugins and directives ([2c4c6436b](https://github.com/LouisMazel/maz-ui/commit/2c4c6436b))
- **maz-ui:** MazGallery - add prop option to choose background color ([2986c9425](https://github.com/LouisMazel/maz-ui/commit/2986c9425))
- **maz-ui:** MazDropdown, Mazpopover - new trigger mode 'adaptive' for desktop and mobile ([9d5b51a6a](https://github.com/LouisMazel/maz-ui/commit/9d5b51a6a))
- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([99a4d0f3b](https://github.com/LouisMazel/maz-ui/commit/99a4d0f3b))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([10258f4ae](https://github.com/LouisMazel/maz-ui/commit/10258f4ae))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([7c5b6827d](https://github.com/LouisMazel/maz-ui/commit/7c5b6827d))
- **maz-ui:** MazPopover - improve popover position placement and animations ([5eadd40f8](https://github.com/LouisMazel/maz-ui/commit/5eadd40f8))
- **maz-ui:** Add vite/client types into tsconfig ([a0ff04adc](https://github.com/LouisMazel/maz-ui/commit/a0ff04adc))
- **maz-ui:** Rename MazDialogPromise component to MazDialogConfirm and add more button options ([e175d0d64](https://github.com/LouisMazel/maz-ui/commit/e175d0d64))
- **maz-ui:** MazInput - add loading state component with spinner support ([5be37b824](https://github.com/LouisMazel/maz-ui/commit/5be37b824))
- **maz-ui:** MazDialogConfirm - add option to hide default buttons ([faaec8d5f](https://github.com/LouisMazel/maz-ui/commit/faaec8d5f))

### 🔥 Performance

- **maz-ui:** Toast uses passive event to improve perf ([8bd22a1b6](https://github.com/LouisMazel/maz-ui/commit/8bd22a1b6))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([7f96b720f](https://github.com/LouisMazel/maz-ui/commit/7f96b720f))
- **maz-ui:** Toast uses passive event to improve perf ([fbc2d5f11](https://github.com/LouisMazel/maz-ui/commit/fbc2d5f11))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([f2f4f275a](https://github.com/LouisMazel/maz-ui/commit/f2f4f275a))

### 🩹 Fixes

- Update component paths and improve documentation references ([2a970a176](https://github.com/LouisMazel/maz-ui/commit/2a970a176))
- **@maz-ui/icons:** Export svg files correctly ([dd760f3d0](https://github.com/LouisMazel/maz-ui/commit/dd760f3d0))
- **maz-ui:** Utilities export path ([d31aee3ea](https://github.com/LouisMazel/maz-ui/commit/d31aee3ea))
- Add --concurrency=1 to nx:affected:pre-commit to fix lint-staged backup issue ([da73cb0c1](https://github.com/LouisMazel/maz-ui/commit/da73cb0c1))
- **maz-ui:** UseFormField - improve types ([ad3d9db43](https://github.com/LouisMazel/maz-ui/commit/ad3d9db43))
- **maz-ui:** UseFormField & useFormValidator - improve types ([c5e1e91ed](https://github.com/LouisMazel/maz-ui/commit/c5e1e91ed))
- Update component paths and improve documentation references ([c1fe6d72c](https://github.com/LouisMazel/maz-ui/commit/c1fe6d72c))
- **@maz-ui/icons:** Export svg files correctly ([5ede33435](https://github.com/LouisMazel/maz-ui/commit/5ede33435))
- **maz-ui:** Utilities export path ([6bb55de9c](https://github.com/LouisMazel/maz-ui/commit/6bb55de9c))
- Add --concurrency=1 to nx:affected:pre-commit to fix lint-staged backup issue ([c85f3d3d1](https://github.com/LouisMazel/maz-ui/commit/c85f3d3d1))
- **maz-ui:** UseFormField - improve types ([0c18dd1ad](https://github.com/LouisMazel/maz-ui/commit/0c18dd1ad))
- **maz-ui:** UseFormField & useFormValidator - improve types ([71b32a04f](https://github.com/LouisMazel/maz-ui/commit/71b32a04f))

### 💅 Refactors

- **maz-ui:** MazPicker - improve UI and UX ([26b827210](https://github.com/LouisMazel/maz-ui/commit/26b827210))
- **maz-ui:** MazInput - improve UI and UX (BREAKING_CHANGES) ([0c979efe7](https://github.com/LouisMazel/maz-ui/commit/0c979efe7))
- **maz-ui:** Apply default border color to components ([9254573d0](https://github.com/LouisMazel/maz-ui/commit/9254573d0))
- **@maz-ui/themes:** Compatibility with vue and nuxt improvements ([cd369d2f0](https://github.com/LouisMazel/maz-ui/commit/cd369d2f0))
- **maz-ui:** MazBtn, MazBadge - rename props outline to outlined ([5de3baf27](https://github.com/LouisMazel/maz-ui/commit/5de3baf27))
- **maz-ui:** Rename toaster plugin to toast ([48386006a](https://github.com/LouisMazel/maz-ui/commit/48386006a))
- **maz-ui:** MazLink can be a button ([507ca66ff](https://github.com/LouisMazel/maz-ui/commit/507ca66ff))
- **maz-ui:** Typescript support improvements for directives ([5d79004e0](https://github.com/LouisMazel/maz-ui/commit/5d79004e0))
- **@maz-ui/translations:** Improve locale messages lazy loading ([4a4e16d6c](https://github.com/LouisMazel/maz-ui/commit/4a4e16d6c))
- **maz-ui:** MazPicker - improve UI and UX ([03b5a6fe6](https://github.com/LouisMazel/maz-ui/commit/03b5a6fe6))
- **maz-ui:** MazInput - improve UI and UX (BREAKING_CHANGES) ([413c2688c](https://github.com/LouisMazel/maz-ui/commit/413c2688c))
- **maz-ui:** Apply default border color to components ([98566be9c](https://github.com/LouisMazel/maz-ui/commit/98566be9c))
- **@maz-ui/themes:** Compatibility with vue and nuxt improvements ([53ccfd3c9](https://github.com/LouisMazel/maz-ui/commit/53ccfd3c9))
- **maz-ui:** MazBtn, MazBadge - rename props outline to outlined ([f750b2616](https://github.com/LouisMazel/maz-ui/commit/f750b2616))
- **maz-ui:** Rename toaster plugin to toast ([a69040c61](https://github.com/LouisMazel/maz-ui/commit/a69040c61))
- **maz-ui:** MazLink can be a button ([e97412aa2](https://github.com/LouisMazel/maz-ui/commit/e97412aa2))
- **maz-ui:** Typescript support improvements for directives ([320436e4d](https://github.com/LouisMazel/maz-ui/commit/320436e4d))
- **@maz-ui/translations:** Improve locale messages lazy loading ([daae8c871](https://github.com/LouisMazel/maz-ui/commit/daae8c871))

### 📖 Documentation

- **docs:** @maz-ui/nuxt - new documentation ([275746bcc](https://github.com/LouisMazel/maz-ui/commit/275746bcc))
- **docs:** Add documentation about resolvers ([f3ed70232](https://github.com/LouisMazel/maz-ui/commit/f3ed70232))
- **docs:** @maz-ui/nuxt - new documentation ([47ebb0a99](https://github.com/LouisMazel/maz-ui/commit/47ebb0a99))
- **docs:** Add documentation about resolvers ([bef76e9ea](https://github.com/LouisMazel/maz-ui/commit/bef76e9ea))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.14...v4.0.0-beta.15

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.14...v4.0.0-beta.15)

**Note:** No relevant commits found

## v4.0.0-beta.13...v4.0.0-beta.14

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.13...v4.0.0-beta.14)

**Note:** No relevant commits found

## v4.0.0-beta.12...v4.0.0-beta.13

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.12...v4.0.0-beta.13)

### 🩹 Fixes

- **maz-ui:** UseFormField - improve types ([ad3d9db43](https://github.com/LouisMazel/maz-ui/commit/ad3d9db43))
- **maz-ui:** UseFormField & useFormValidator - improve types ([c5e1e91ed](https://github.com/LouisMazel/maz-ui/commit/c5e1e91ed))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.11...v4.0.0-beta.12

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.11...v4.0.0-beta.12)

**Note:** No relevant commits found

## v4.0.0-beta.10...v4.0.0-beta.11

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.10...v4.0.0-beta.11)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.9...v4.0.0-beta.10

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.9...v4.0.0-beta.10)

### 🚀 Features

- **maz-ui:** MazDialogConfirm - add option to hide default buttons ([6606917cb](https://github.com/LouisMazel/maz-ui/commit/6606917cb))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.8...v4.0.0-beta.9

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.8...v4.0.0-beta.9)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.7...v4.0.0-beta.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.7...v4.0.0-beta.8)

### 🩹 Fixes

- Add --concurrency=1 to nx:affected:pre-commit to fix lint-staged backup issue ([da73cb0c1](https://github.com/LouisMazel/maz-ui/commit/da73cb0c1))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.6...v4.0.0-beta.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.6...v4.0.0-beta.7)

### 🚀 Features

- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([f0ef47ebe](https://github.com/LouisMazel/maz-ui/commit/f0ef47ebe))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([be6a80cc0](https://github.com/LouisMazel/maz-ui/commit/be6a80cc0))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([488f05d42](https://github.com/LouisMazel/maz-ui/commit/488f05d42))
- **maz-ui:** MazPopover - improve popover position placement and animations ([69853d82e](https://github.com/LouisMazel/maz-ui/commit/69853d82e))
- **maz-ui:** Add vite/client types into tsconfig ([5e729c42b](https://github.com/LouisMazel/maz-ui/commit/5e729c42b))
- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([26e1c7b10](https://github.com/LouisMazel/maz-ui/commit/26e1c7b10))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([98d415cc7](https://github.com/LouisMazel/maz-ui/commit/98d415cc7))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([68fdcbf60](https://github.com/LouisMazel/maz-ui/commit/68fdcbf60))
- **maz-ui:** MazPopover - improve popover position placement and animations ([fb9d89cfc](https://github.com/LouisMazel/maz-ui/commit/fb9d89cfc))
- **maz-ui:** Add vite/client types into tsconfig ([f93eb4045](https://github.com/LouisMazel/maz-ui/commit/f93eb4045))
- **maz-ui:** Rename MazDialogPromise component to MazDialogConfirm and add more button options ([3e0f76de7](https://github.com/LouisMazel/maz-ui/commit/3e0f76de7))
- **maz-ui:** MazInput - add loading state component with spinner support ([ec4e0cfef](https://github.com/LouisMazel/maz-ui/commit/ec4e0cfef))

### 🔥 Performance

- **maz-ui:** Toast uses passive event to improve perf ([c8420c152](https://github.com/LouisMazel/maz-ui/commit/c8420c152))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([602cbe2a8](https://github.com/LouisMazel/maz-ui/commit/602cbe2a8))
- **maz-ui:** Toast uses passive event to improve perf ([8bd22a1b6](https://github.com/LouisMazel/maz-ui/commit/8bd22a1b6))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([7f96b720f](https://github.com/LouisMazel/maz-ui/commit/7f96b720f))

### 💅 Refactors

- **@maz-ui/translations:** Improve locale messages lazy loading ([4a4e16d6c](https://github.com/LouisMazel/maz-ui/commit/4a4e16d6c))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.5...v4.0.0-beta.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.5...v4.0.0-beta.6)

### 🚀 Features

- **maz-ui:** UseFormValidator, useFormField - Type improvements and performance optimizations ([f0ef47ebe](https://github.com/LouisMazel/maz-ui/commit/f0ef47ebe))
- **maz-ui:** MazBtn, MazCheckbox, MazInput, MazRadio, MazSwitch - improve UX when focused and disable style apply within fieldset disable ([be6a80cc0](https://github.com/LouisMazel/maz-ui/commit/be6a80cc0))
- **maz-ui:** UseDisplayNames - improve cache to avoid memory leaks ([488f05d42](https://github.com/LouisMazel/maz-ui/commit/488f05d42))
- **maz-ui:** MazPopover - improve popover position placement and animations ([69853d82e](https://github.com/LouisMazel/maz-ui/commit/69853d82e))
- **maz-ui:** Add vite/client types into tsconfig ([5e729c42b](https://github.com/LouisMazel/maz-ui/commit/5e729c42b))

### 🔥 Performance

- **maz-ui:** Toast uses passive event to improve perf ([c8420c152](https://github.com/LouisMazel/maz-ui/commit/c8420c152))
- **maz-ui:** VTooltip - use element reference and do not recreate tooltip on update ([602cbe2a8](https://github.com/LouisMazel/maz-ui/commit/602cbe2a8))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## [4.0.0-beta.5](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.4...v4.0.0-beta.5) (2025-07-10)

### Bug Fixes

- **maz-ui:** utilities export path ([d31aee3](https://github.com/LouisMazel/maz-ui/commit/d31aee3ea6d466de41ba1fbbcdb2cd39dbc6fcc2))

## [4.0.0-beta.4](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.3...v4.0.0-beta.4) (2025-07-10)

### Features

- **maz-ui:** MazDropdown, Mazpopover - new trigger mode 'adaptive' for desktop and mobile ([2ed51aa](https://github.com/LouisMazel/maz-ui/commit/2ed51aaa9b2853a0eab0b5ca77b5e0f786e1a74b))

## 4.0.0-beta.3 (2025-07-10)

- chore: remove catalog feature from pnpm workspace ([0176319](https://github.com/LouisMazel/maz-ui/commit/0176319))

## 4.0.0-beta.2 (2025-07-09)

**Note:** Version bump only for package maz-ui

## 4.0.0-beta.1 (2025-07-09)

- chore: implement changesets to manage versions and releases ([65fcca2](https://github.com/LouisMazel/maz-ui/commit/65fcca2))
- chore: release flow by lerna ([1e93a2b](https://github.com/LouisMazel/maz-ui/commit/1e93a2b))
- chore: upgrade dependencies ([a03114e](https://github.com/LouisMazel/maz-ui/commit/a03114e))
- chore: upgrade dependencies ([0fbda6d](https://github.com/LouisMazel/maz-ui/commit/0fbda6d))
- chore: upgrade dependencies in major versions ([2d10379](https://github.com/LouisMazel/maz-ui/commit/2d10379))
- chore: upgrade dependencies in minor versions ([120c580](https://github.com/LouisMazel/maz-ui/commit/120c580))
- chore: use lerna x nx to cache flows ([de1bd9b](https://github.com/LouisMazel/maz-ui/commit/de1bd9b))
- chore(cli): mardown generated documentation templates improvements ([dc9e156](https://github.com/LouisMazel/maz-ui/commit/dc9e156))
- chore(deps): upgrade dependencies ([80b5872](https://github.com/LouisMazel/maz-ui/commit/80b5872))
- chore(docs): add migration guide to v4 ([4583d85](https://github.com/LouisMazel/maz-ui/commit/4583d85))
- chore(maz-ui): build all lib ([e08cb0e](https://github.com/LouisMazel/maz-ui/commit/e08cb0e))
- chore(maz-ui): consume new package @maz-ui/icons ([725536c](https://github.com/LouisMazel/maz-ui/commit/725536c))
- chore(maz-ui): improve tree-shaking ([68f863e](https://github.com/LouisMazel/maz-ui/commit/68f863e))
- chore(maz-ui): remove vClosable to keep only vClickOutside ([b1d836a](https://github.com/LouisMazel/maz-ui/commit/b1d836a))
- chore(maz-ui): separate formatters and utility methods ([0468ddd](https://github.com/LouisMazel/maz-ui/commit/0468ddd))
- chore(release): bump version to 4.0.0-alpha.0 ([074e0b0](https://github.com/LouisMazel/maz-ui/commit/074e0b0))
- chore(release): bump version to 4.0.0-alpha.2 ([7eb3ec0](https://github.com/LouisMazel/maz-ui/commit/7eb3ec0))
- chore(release): bump version to 4.0.0-alpha.3 ([936c813](https://github.com/LouisMazel/maz-ui/commit/936c813))
- chore(release): bump version to 4.0.0-alpha.4 ([0cb8e72](https://github.com/LouisMazel/maz-ui/commit/0cb8e72))
- chore(release): bump version to 4.0.0-alpha.5 ([bebfcfb](https://github.com/LouisMazel/maz-ui/commit/bebfcfb))
- chore(release): bump version to v3.50.1 ([2874d45](https://github.com/LouisMazel/maz-ui/commit/2874d45))
- chore(release): version packages 4.0.0-beta.0 ([531325a](https://github.com/LouisMazel/maz-ui/commit/531325a))
- feat(@maz-ui/icons): Add new @maz-ui/icons package to export SVG icons and Vue JS components icons ([9e3955d](https://github.com/LouisMazel/maz-ui/commit/9e3955d))
- feat(@maz-ui/icons): Add resolver to auto-import icons as Vue Components ([b76f65c](https://github.com/LouisMazel/maz-ui/commit/b76f65c))
- feat(@maz-ui/nuxt): implemente @maz-ui/themes - set and manage themes with nuxt ([d369b1f](https://github.com/LouisMazel/maz-ui/commit/d369b1f))
- feat(@maz-ui/nuxt): new standalone package for the nuxt module (no longer included in maz-ui bundle) ([d8e4dd4](https://github.com/LouisMazel/maz-ui/commit/d8e4dd4))
- feat(@maz-ui/themes): new package - create and manage theme with maz-ui ([a6ce6e6](https://github.com/LouisMazel/maz-ui/commit/a6ce6e6))
- feat(@maz-ui/themes): new package - create and manage theme with maz-ui ([7726ff8](https://github.com/LouisMazel/maz-ui/commit/7726ff8))
- feat(@maz-ui/themes): use cookie to store color mode ([780157c](https://github.com/LouisMazel/maz-ui/commit/780157c))
- feat(@maz-ui/translations): new packages to manage maz-ui's translations easily ([f8c2518](https://github.com/LouisMazel/maz-ui/commit/f8c2518))
- fix(@maz-ui/icons): export svg files correctly ([dd760f3](https://github.com/LouisMazel/maz-ui/commit/dd760f3))
- refactor(@maz-ui/themes): compatibility with vue and nuxt improvements ([cd369d2](https://github.com/LouisMazel/maz-ui/commit/cd369d2))
- feat(maz-ui): implement new theme manager provided by @maz-ui/themes ([bc23c6a](https://github.com/LouisMazel/maz-ui/commit/bc23c6a))
- feat(maz-ui): MazDropdown - use popover to display the dropdown menu ([c3b324e](https://github.com/LouisMazel/maz-ui/commit/c3b324e))
- feat(maz-ui): MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) (#118 ([cfabd9b](https://github.com/LouisMazel/maz-ui/commit/cfabd9b)), closes [#1189](https://github.com/LouisMazel/maz-ui/issues/1189)
- feat(maz-ui): MazGallery - add prop option to choose background color ([b1a37ee](https://github.com/LouisMazel/maz-ui/commit/b1a37ee))
- feat(maz-ui): MazInputPhoneNumber - display formatted number as input value ([754d167](https://github.com/LouisMazel/maz-ui/commit/754d167))
- feat(maz-ui): MazInputPhoneNumber, MazSelect, MazDropdown and vTooltip display the content in a popo ([44406d0](https://github.com/LouisMazel/maz-ui/commit/44406d0))
- feat(maz-ui): MazPopover - new component to display content as overlay ([22d61d0](https://github.com/LouisMazel/maz-ui/commit/22d61d0))
- feat(maz-ui): MazSelect - use popover to display option list ([4bf8d74](https://github.com/LouisMazel/maz-ui/commit/4bf8d74))
- feat(maz-ui): MazSelectCountry - new form component to select country and languages ([97fedf7](https://github.com/LouisMazel/maz-ui/commit/97fedf7))
- feat(maz-ui): MazSlider - add step option ([9becb79](https://github.com/LouisMazel/maz-ui/commit/9becb79))
- feat(maz-ui): MazUi plugin can install plugins and directives ([68c43f6](https://github.com/LouisMazel/maz-ui/commit/68c43f6))
- feat(maz-ui): Plugin Toaster and useToast - improve UI and UX of toast (BREAKING_CHANGES) ([d7617bd](https://github.com/LouisMazel/maz-ui/commit/d7617bd))
- feat(maz-ui): v4.0.0 ([d59c08f](https://github.com/LouisMazel/maz-ui/commit/d59c08f))
- refactor(maz-ui): apply default border color to components ([9254573](https://github.com/LouisMazel/maz-ui/commit/9254573))
- refactor(maz-ui): MazBtn, MazBadge - rename props outline to outlined ([5de3baf](https://github.com/LouisMazel/maz-ui/commit/5de3baf))
- refactor(maz-ui): MazInput - improve UI and UX (BREAKING_CHANGES) ([0c979ef](https://github.com/LouisMazel/maz-ui/commit/0c979ef))
- refactor(maz-ui): MazLink can be a button ([507ca66](https://github.com/LouisMazel/maz-ui/commit/507ca66))
- refactor(maz-ui): MazPicker - improve UI and UX ([26b8272](https://github.com/LouisMazel/maz-ui/commit/26b8272))
- refactor(maz-ui): rename toaster plugin to toast ([4838600](https://github.com/LouisMazel/maz-ui/commit/4838600))
- docs(docs): @maz-ui/nuxt - new documentation ([275746b](https://github.com/LouisMazel/maz-ui/commit/275746b))
- docs(docs): add documentation about resolvers ([f3ed702](https://github.com/LouisMazel/maz-ui/commit/f3ed702))
- ci: Add workfloxs for publishing icons and Nuxt packages to npm ([27463bf](https://github.com/LouisMazel/maz-ui/commit/27463bf))
- fix: update component paths and improve documentation references ([2a970a1](https://github.com/LouisMazel/maz-ui/commit/2a970a1))
- fix(docs): Suspense and hydration issues ([8acb358](https://github.com/LouisMazel/maz-ui/commit/8acb358))

## 4.0.0-beta.0 (2025-07-09)

- feat(@maz-ui/icons): Add new @maz-ui/icons package to export SVG icons and Vue JS components icons ([9e3955d](https://github.com/LouisMazel/maz-ui/commit/9e3955d))
- feat(@maz-ui/icons): Add resolver to auto-import icons as Vue Components ([b76f65c](https://github.com/LouisMazel/maz-ui/commit/b76f65c))
- feat(@maz-ui/nuxt): implemente @maz-ui/themes - set and manage themes with nuxt ([d369b1f](https://github.com/LouisMazel/maz-ui/commit/d369b1f))
- feat(@maz-ui/nuxt): new standalone package for the nuxt module (no longer included in maz-ui bundle) ([d8e4dd4](https://github.com/LouisMazel/maz-ui/commit/d8e4dd4))
- feat(@maz-ui/themes): new package - create and manage theme with maz-ui ([a6ce6e6](https://github.com/LouisMazel/maz-ui/commit/a6ce6e6))
- feat(@maz-ui/themes): new package - create and manage theme with maz-ui ([7726ff8](https://github.com/LouisMazel/maz-ui/commit/7726ff8))
- feat(@maz-ui/themes): use cookie to store color mode ([780157c](https://github.com/LouisMazel/maz-ui/commit/780157c))
- feat(@maz-ui/translations): new packages to manage maz-ui's translations easily ([f8c2518](https://github.com/LouisMazel/maz-ui/commit/f8c2518))
- fix(@maz-ui/icons): export svg files correctly ([dd760f3](https://github.com/LouisMazel/maz-ui/commit/dd760f3))
- refactor(@maz-ui/themes): compatibility with vue and nuxt improvements ([cd369d2](https://github.com/LouisMazel/maz-ui/commit/cd369d2))
- feat(maz-ui): implement new theme manager provided by @maz-ui/themes ([bc23c6a](https://github.com/LouisMazel/maz-ui/commit/bc23c6a))
- feat(maz-ui): MazDropdown - use popover to display the dropdown menu ([c3b324e](https://github.com/LouisMazel/maz-ui/commit/c3b324e))
- feat(maz-ui): MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) (#118 ([cfabd9b](https://github.com/LouisMazel/maz-ui/commit/cfabd9b)), closes [#1189](https://github.com/LouisMazel/maz-ui/issues/1189)
- feat(maz-ui): MazGallery - add prop option to choose background color ([b1a37ee](https://github.com/LouisMazel/maz-ui/commit/b1a37ee))
- feat(maz-ui): MazInputPhoneNumber - display formatted number as input value ([754d167](https://github.com/LouisMazel/maz-ui/commit/754d167))
- feat(maz-ui): MazInputPhoneNumber, MazSelect, MazDropdown and vTooltip display the content in a popo ([44406d0](https://github.com/LouisMazel/maz-ui/commit/44406d0))
- feat(maz-ui): MazPopover - new component to display content as overlay ([22d61d0](https://github.com/LouisMazel/maz-ui/commit/22d61d0))
- feat(maz-ui): MazSelect - use popover to display option list ([4bf8d74](https://github.com/LouisMazel/maz-ui/commit/4bf8d74))
- feat(maz-ui): MazSelectCountry - new form component to select country and languages ([97fedf7](https://github.com/LouisMazel/maz-ui/commit/97fedf7))
- feat(maz-ui): MazSlider - add step option ([9becb79](https://github.com/LouisMazel/maz-ui/commit/9becb79))
- feat(maz-ui): MazUi plugin can install plugins and directives ([68c43f6](https://github.com/LouisMazel/maz-ui/commit/68c43f6))
- feat(maz-ui): Plugin Toaster and useToast - improve UI and UX of toast (BREAKING_CHANGES) ([d7617bd](https://github.com/LouisMazel/maz-ui/commit/d7617bd))
- feat(maz-ui): v4.0.0 ([d59c08f](https://github.com/LouisMazel/maz-ui/commit/d59c08f))
- refactor(maz-ui): apply default border color to components ([9254573](https://github.com/LouisMazel/maz-ui/commit/9254573))
- refactor(maz-ui): MazBtn, MazBadge - rename props outline to outlined ([5de3baf](https://github.com/LouisMazel/maz-ui/commit/5de3baf))
- refactor(maz-ui): MazInput - improve UI and UX (BREAKING_CHANGES) ([0c979ef](https://github.com/LouisMazel/maz-ui/commit/0c979ef))
- refactor(maz-ui): MazLink can be a button ([507ca66](https://github.com/LouisMazel/maz-ui/commit/507ca66))
- refactor(maz-ui): MazPicker - improve UI and UX ([26b8272](https://github.com/LouisMazel/maz-ui/commit/26b8272))
- refactor(maz-ui): rename toaster plugin to toast ([4838600](https://github.com/LouisMazel/maz-ui/commit/4838600))
- chore: implement changesets to manage versions and releases ([65fcca2](https://github.com/LouisMazel/maz-ui/commit/65fcca2))
- chore: release flow by lerna ([1e93a2b](https://github.com/LouisMazel/maz-ui/commit/1e93a2b))
- chore: upgrade dependencies ([a03114e](https://github.com/LouisMazel/maz-ui/commit/a03114e))
- chore: upgrade dependencies ([0fbda6d](https://github.com/LouisMazel/maz-ui/commit/0fbda6d))
- chore: upgrade dependencies in major versions ([2d10379](https://github.com/LouisMazel/maz-ui/commit/2d10379))
- chore: upgrade dependencies in minor versions ([120c580](https://github.com/LouisMazel/maz-ui/commit/120c580))
- chore: use lerna x nx to cache flows ([de1bd9b](https://github.com/LouisMazel/maz-ui/commit/de1bd9b))
- chore(cli): mardown generated documentation templates improvements ([dc9e156](https://github.com/LouisMazel/maz-ui/commit/dc9e156))
- chore(deps): upgrade dependencies ([80b5872](https://github.com/LouisMazel/maz-ui/commit/80b5872))
- chore(docs): add migration guide to v4 ([4583d85](https://github.com/LouisMazel/maz-ui/commit/4583d85))
- chore(maz-ui): build all lib ([e08cb0e](https://github.com/LouisMazel/maz-ui/commit/e08cb0e))
- chore(maz-ui): consume new package @maz-ui/icons ([725536c](https://github.com/LouisMazel/maz-ui/commit/725536c))
- chore(maz-ui): improve tree-shaking ([68f863e](https://github.com/LouisMazel/maz-ui/commit/68f863e))
- chore(maz-ui): remove vClosable to keep only vClickOutside ([b1d836a](https://github.com/LouisMazel/maz-ui/commit/b1d836a))
- chore(maz-ui): separate formatters and utility methods ([0468ddd](https://github.com/LouisMazel/maz-ui/commit/0468ddd))
- chore(release): bump version to 4.0.0-alpha.0 ([074e0b0](https://github.com/LouisMazel/maz-ui/commit/074e0b0))
- chore(release): bump version to 4.0.0-alpha.2 ([7eb3ec0](https://github.com/LouisMazel/maz-ui/commit/7eb3ec0))
- chore(release): bump version to 4.0.0-alpha.3 ([936c813](https://github.com/LouisMazel/maz-ui/commit/936c813))
- chore(release): bump version to 4.0.0-alpha.4 ([0cb8e72](https://github.com/LouisMazel/maz-ui/commit/0cb8e72))
- chore(release): bump version to 4.0.0-alpha.5 ([bebfcfb](https://github.com/LouisMazel/maz-ui/commit/bebfcfb))
- chore(release): bump version to v3.50.1 ([2874d45](https://github.com/LouisMazel/maz-ui/commit/2874d45))
- docs(docs): @maz-ui/nuxt - new documentation ([275746b](https://github.com/LouisMazel/maz-ui/commit/275746b))
- docs(docs): add documentation about resolvers ([f3ed702](https://github.com/LouisMazel/maz-ui/commit/f3ed702))
- ci: Add workfloxs for publishing icons and Nuxt packages to npm ([27463bf](https://github.com/LouisMazel/maz-ui/commit/27463bf))
- fix: update component paths and improve documentation references ([2a970a1](https://github.com/LouisMazel/maz-ui/commit/2a970a1))
- fix(docs): Suspense and hydration issues ([8acb358](https://github.com/LouisMazel/maz-ui/commit/8acb358))
