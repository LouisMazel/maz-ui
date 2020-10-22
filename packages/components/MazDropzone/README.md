# MazDropzone

## Props

<!-- @vuese:MazDropzone:props:start -->

| Name               | Description | Type      | Required | Default     |
| ------------------ | ----------- | --------- | -------- | ----------- |
| url                | -           | `String`  | `true`   | -           |
| id                 | -           | `String`  | `false`  | MazDropzone |
| acceptedFiles      | -           | `String`  | `false`  | image/\*    |
| paramName          | -           | `String`  | `false`  | file-name   |
| headers            | -           | `Object`  | `true`   | -           |
| translations       | -           | `Object`  | `false`  | null        |
| maxFiles           | -           | `Number`  | `false`  | 1           |
| maxFilesize        | -           | `Number`  | `false`  | 2           |
| addRemoveLinks     | -           | `Boolean` | `false`  | true        |
| dark               | -           | `Boolean` | `false`  | false       |
| removeFilesOnError | -           | `Boolean` | `false`  | false       |

<!-- @vuese:MazDropzone:props:end -->

## Events

<!-- @vuese:MazDropzone:events:start -->

| Event Name          | Description | Parameters |
| ------------------- | ----------- | ---------- |
| file-added          | -           | -          |
| file-upload-error   | -           | -          |
| file-upload-success | -           | -          |
| file-removed        | -           | -          |
| file-sending        | -           | -          |

<!-- @vuese:MazDropzone:events:end -->
