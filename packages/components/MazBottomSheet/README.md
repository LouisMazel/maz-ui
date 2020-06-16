# NBottomSheet

## Props

<!-- @vuese:NBottomSheet:props:start -->

| Name            | Description | Type      | Required | Default |
| --------------- | ----------- | --------- | -------- | ------- |
| value           | -           | `Boolean` | `false`  | -       |
| excludedClasses | -           | `Array`   | `false`  | -       |
| persistent      | -           | `Boolean` | `false`  | -       |
| noClose         | -           | `Boolean` | `false`  | -       |
| noPadding       | -           | `Boolean` | `false`  | -       |
| noOverlay       | -           | `Boolean` | `false`  | -       |

<!-- @vuese:NBottomSheet:props:end -->

## Events

<!-- @vuese:NBottomSheet:events:start -->

| Event Name | Description                  | Parameters |
| ---------- | ---------------------------- | ---------- |
| input      | Return state of bottom sheet | Boolean    |
| close      | Emit on close sheet          | -          |

<!-- @vuese:NBottomSheet:events:end -->

## Slots

<!-- @vuese:NBottomSheet:slots:start -->

| Name    | Description  | Default Slot Content       |
| ------- | ------------ | -------------------------- |
| default | Slot content | `<h1>Default content</h1>` |

<!-- @vuese:NBottomSheet:slots:end -->
