# MazDropzone

## Props

<!-- @vuese:MazDropzone:props:start -->

| Name               | Description                                    | Type      | Required | Default     |
| ------------------ | ---------------------------------------------- | --------- | -------- | ----------- |
| url                | URL to upload files                            | `String`  | `true`   | -           |
| id                 | Id of component                                | `String`  | `false`  | MazDropzone |
| acceptedFiles      | File type accepted                             | `String`  | `false`  | image/\*    |
| paramName          | File name uploaded                             | `String`  | `false`  | file-name   |
| headers            | Set request headers with your own (token, jwt) | `Object`  | `true`   | -           |
| translations       | Messages translations (error, success)         | `Object`  | `false`  | null        |
| maxFiles           | Max files number                               | `Number`  | `false`  | 1           |
| maxFilesize        | Max files size                                 | `Number`  | `false`  | 2           |
| addRemoveLinks     | User can remove files with a button            | `Boolean` | `false`  | true        |
| dark               | Set dark theme                                 | `Boolean` | `false`  | false       |
| removeFilesOnError | If error remove all files in area              | `Boolean` | `false`  | false       |
| autoProcessQueue   | Not upload immediatly the files                | `Boolean` | `false`  | true        |

<!-- @vuese:MazDropzone:props:end -->

## Events

<!-- @vuese:MazDropzone:events:start -->

| Event Name          | Description | Parameters |
| ------------------- | ----------- | ---------- |
| file-added          | -           | -          |
| file-upload-success | -           | -          |
| file-upload-error   | -           | -          |
| file-removed        | -           | -          |
| file-sending        | -           | -          |

<!-- @vuese:MazDropzone:events:end -->
