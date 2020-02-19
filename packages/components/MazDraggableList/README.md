# MazDraggableList

> Smart Draggable List

## Props

<!-- @vuese:MazDraggableList:props:start -->

| Name  | Description                        | Type    | Required | Default |
| ----- | ---------------------------------- | ------- | -------- | ------- |
| value | Must be an `Array` (use `v-model`) | `Array` | `true`   | -       |

<!-- @vuese:MazDraggableList:props:end -->

## Events

<!-- @vuese:MazDraggableList:events:start -->

| Event Name | Description        | Parameters   |
| ---------- | ------------------ | ------------ |
| input      | update the v-model | list updated |

<!-- @vuese:MazDraggableList:events:end -->

## Slots

<!-- @vuese:MazDraggableList:slots:start -->

| Name    | Description                    | Default Slot Content      |
| ------- | ------------------------------ | ------------------------- |
| default | Default item displayed in list | `<span>{{ item }}</span>` |

<!-- @vuese:MazDraggableList:slots:end -->
