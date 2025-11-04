import fs from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

fs.readdir(resolve(_dirname, './../../icons'), (_, files) => {
  console.log('files', files)
})
