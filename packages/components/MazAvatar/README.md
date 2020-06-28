# MazAvatar

## Props

<!-- @vuese:MazAvatar:props:start -->

| Name        | Description                                    | Type      | Required | Default      |
| ----------- | ---------------------------------------------- | --------- | -------- | ------------ |
| src         | url or path of the image                       | `String`  | `true`   | -            |
| url         | url or path to link another page               | `String`  | `false`  | null         |
| alt         | alt text of image                              | `String`  | `false`  | avatar image |
| target      | target attribute of link (if url is provide)   | `String`  | `false`  | \_self       |
| size        | size of avatar                                 | `Number`  | `false`  | 80           |
| bordered    | add border around the avatar                   | `Boolean` | `false`  | false        |
| editable    | add an edit layer & emit `edit` event on click | `Boolean` | `false`  | false        |
| square      | Make the avatar square                         | `Boolean` | `false`  | false        |
| noElevation | Remove the shadow behind the avatar            | `Boolean` | `false`  | false        |

<!-- @vuese:MazAvatar:props:end -->

## Events

<!-- @vuese:MazAvatar:events:start -->

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| edit       | -           | -          |

<!-- @vuese:MazAvatar:events:end -->
