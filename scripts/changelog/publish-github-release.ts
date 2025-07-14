#!/usr/bin/env tsx
import { getErrorMessage } from '@maz-ui/utils/src/index.js'
import { logger } from '@maz-ui/utils/src/utils/logger.js'
import {
  syncGithubRelease,
} from 'changelogen'

import { name, version } from '../../package.json'
import { generateChangelog, getChangelogConfig, rootDir } from './utils'

async function main() {
  logger.log('🚀 Publishing GitHub release...')

  try {
    const config = await getChangelogConfig({ from: version, to: 'HEAD' })
    const releaseChangelog = await generateChangelog(
      {
        pkg: {
          name,
          path: rootDir,
        },
        config,
      },
    )

    if (!releaseChangelog) {
      logger.error('❌ No changelog found for latest version')
      return
    }

    logger.log('📝 Release content:', releaseChangelog)

    const response = await syncGithubRelease(config, {
      version,
      body: releaseChangelog,
    })

    logger.log()
    logger.success('✅ Release published to GitHub!', JSON.stringify(response, null, 2))
    logger.log()
  }
  catch (error) {
    const errorMessage = getErrorMessage(error)
    logger.error('❌ Error publishing GitHub release:', errorMessage)
    process.exit(1)
  }
}

main()
