# MazAvatar

## Props

<!-- @vuese:MazAvatar:props:start -->

| Name        | Description                                    | Type      | Required | Default |
| ----------- | ---------------------------------------------- | --------- | -------- | ------- |
| src         | url or path of the image                       | `String`  | `true`   | -       |
| url         | url or path to link another page               | `String`  | `false`  | -       |
| target      | target attribute of link (if url is provide)   | `String`  | `false`  | \_self  |
| size        | size of avatar                                 | `Number`  | `false`  | 80      |
| bordered    | add border around the avatar                   | `Boolean` | `false`  | -       |
| editable    | add an edit layer & emit `edit` event on click | `Boolean` | `false`  | -       |
| square      | Make the avatar square                         | `Boolean` | `false`  | -       |
| noElevation | Remove the shadow behind the avatar            | `Boolean` | `false`  | -       |

<!-- @vuese:MazAvatar:props:end -->

## Events

<!-- @vuese:MazAvatar:events:start -->

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| edit       | -           | -          |

<!-- @vuese:MazAvatar:events:end -->
