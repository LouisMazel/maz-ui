import { exit } from 'node:process'
import { cancel, isCancel } from '@clack/prompts'

export function checkIsCancel(value: unknown) {
  if (isCancel(value)) {
    cancel('Operation cancelled.')
    exit(0)
  }
}
