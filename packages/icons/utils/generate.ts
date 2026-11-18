import { resolve } from 'node:path'
import { generateIcons } from './generateIcons.ts'

generateIcons({
  root: resolve(import.meta.dirname, '..'),
})
