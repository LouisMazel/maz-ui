import fs from 'node:fs'
import { resolve } from 'node:path'

fs.readdir(resolve(__dirname, './../../icons'), (_, files) => {
  // eslint-disable-next-line no-console
  console.log('files', files)
})
