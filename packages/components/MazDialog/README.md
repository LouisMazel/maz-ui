# MazDialog

## Props

<!-- @vuese:MazDialog:props:start -->

| Name            | Description                                                           | Type      | Required | Default      |
| --------------- | --------------------------------------------------------------------- | --------- | -------- | ------------ |
| value           | `true` if dialog is open / `false` if is close                        | `Boolean` | `true`   | -            |
| maxWidth        | is the `max-width` of the dialog in pixels                            | `Number`  | `false`  | 500          |
| persistent      | if is `true`, is not possible to close he dialog with a click outside | `Boolean` | `false`  | -            |
| noHeader        | remove the header                                                     | `Boolean` | `false`  | -            |
| noFooter        | remove the footer                                                     | `Boolean` | `false`  | -            |
| noClose         | remove the close button                                               | `Boolean` | `false`  | -            |
| noConfirm       | remove the confirm button                                             | `Boolean` | `false`  | -            |
| success         | add "success" style to the dialog                                     | `Boolean` | `false`  | -            |
| danger          | add "danger" style to the dialog                                      | `Boolean` | `false`  | -            |
| dark            | add "dark" style to the dialog                                        | `Boolean` | `false`  | -            |
| excludedClasses | exclude elements classes (elements sometimes can close the dialog)    | `Array`   | `false`  | -            |
| fullsize        | make dialog fullsize                                                  | `Boolean` | `false`  | -            |
| title           | title of the dialog                                                   | `String`  | `false`  | Header title |

<!-- @vuese:MazDialog:props:end -->

## Events

<!-- @vuese:MazDialog:events:start -->

| Event Name | Description                           | Parameters      |
| ---------- | ------------------------------------- | --------------- |
| input      | sent when dialog is close             | Boolean `false` |
| opened     | sent when after dialog is open        | event           |
| closed     | sent when after dialog is close       | event           |
| confirm    | sent when you click on confirm button | event           |

<!-- @vuese:MazDialog:events:end -->

## Slots

<!-- @vuese:MazDialog:slots:start -->

| Name    | Description                    | Default Slot Content                                    |
| ------- | ------------------------------ | ------------------------------------------------------- |
| title   | Replace the title element text | `<p class="maz-dialog__header__title">Title header</p>` |
| default | Replace the content            | `<p>Content</p>`                                        |
| footer  | Replace the footer bar         | Two `<MazBtn />`                                        |

<!-- @vuese:MazDialog:slots:end -->
