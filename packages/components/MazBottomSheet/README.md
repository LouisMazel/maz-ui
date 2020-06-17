# MazBottomSheet

## Props

<!-- @vuese:MazBottomSheet:props:start -->

| Name            | Description | Type      | Required | Default |
| --------------- | ----------- | --------- | -------- | ------- |
| value           | -           | `Boolean` | `false`  | -       |
| excludedClasses | -           | `Array`   | `false`  | -       |
| persistent      | -           | `Boolean` | `false`  | -       |
| noClose         | -           | `Boolean` | `false`  | -       |
| noPadding       | -           | `Boolean` | `false`  | -       |
| noOverlay       | -           | `Boolean` | `false`  | -       |
| dark            | -           | `Boolean` | `false`  | -       |

<!-- @vuese:MazBottomSheet:props:end -->

## Events

<!-- @vuese:MazBottomSheet:events:start -->

| Event Name | Description                  | Parameters |
| ---------- | ---------------------------- | ---------- |
| input      | Return state of bottom sheet | Boolean    |
| close      | Emit on close sheet          | -          |

<!-- @vuese:MazBottomSheet:events:end -->

## Slots

<!-- @vuese:MazBottomSheet:slots:start -->

| Name    | Description  | Default Slot Content       |
| ------- | ------------ | -------------------------- |
| default | Slot content | `<h1>Default content</h1>` |

<!-- @vuese:MazBottomSheet:slots:end -->
