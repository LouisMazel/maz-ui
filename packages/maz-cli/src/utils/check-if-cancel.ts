import { cancel, isCancel } from '@clack/prompts'
import { exit } from 'node:process'

export function checkIsCancel(value: unknown) {
  if (isCancel(value)) {
    cancel('Operation cancelled.')
    exit(0)
  }
}
