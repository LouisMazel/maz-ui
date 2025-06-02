import type { CosmiconfigResult } from 'cosmiconfig'
import type { MazUiConfig } from '../types'
import { cosmiconfig } from 'cosmiconfig'

interface LoadConfigResult extends NonNullable<CosmiconfigResult> {
  config: MazUiConfig
}

export async function loadConfig(): Promise<LoadConfigResult> {
  const explorer = cosmiconfig('maz-ui')

  const result = await explorer.search()

  if (result?.config) {
    return result
  }
  else {
    throw new Error('No config file "maz-ui" found')
  }
}
