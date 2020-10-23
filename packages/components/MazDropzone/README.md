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
| removeFileOnError  | If error remove file in area                   | `Boolean` | `false`  | false       |
| autoProcessQueue   | Not upload immediatly the files                | `Boolean` | `false`  | true        |
| duplicateCheck     | Not upload immediatly the files                | `Boolean` | `false`  | true        |

<!-- @vuese:MazDropzone:props:end -->

## Events

<!-- @vuese:MazDropzone:events:start -->

| Event Name                   | Description                                                                | Parameters           |
| ---------------------------- | -------------------------------------------------------------------------- | -------------------- |
| file-added                   | Called whenever a new file is dropped in the zone.                         | File                 |
| file-upload-success          | Called when the file is successfully sent.                                 | Response, File       |
| file-upload-multiple-success | Called when the file is successfully sent.                                 | Response, Files, XHR |
| file-upload-error            | Called when an error occured while uploading the file.                     | Error, File, XHR     |
| file-upload-multiple-error   | Called when an error occured while uploading the file.                     | Error                |
| max-files-reached            | Called when the number of files accepted reaches the maxFiles limit.       | File                 |
| s3-upload-error              | If error occures in AWS S3 upload.                                         | errorMessage         |
| s3-upload-success            | When file is uploaded to AWS S3 successfully.                              | s3ObjectLocation     |
| file-removed                 | A file was removed from the dropzone.                                      | File                 |
| file-sending                 | Modify the request and add addtional parameters to request before sending. | file, xhr, formData  |
| duplicate-file               | Fired when duplicateCheck is enabled and duplicate file is found.          | file                 |

<!-- @vuese:MazDropzone:events:end -->
