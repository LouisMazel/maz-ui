import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

fs.readdir(path.resolve(_dirname, './../../icons'), (_, files) => {
  // eslint-disable-next-line no-console
  console.log('files', files)
})
