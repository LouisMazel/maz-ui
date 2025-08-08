#!/usr/bin/env tsx
import { execPromise, logger } from '@maz-ui/node/index.js'
import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
import {
  createGithubRelease,
} from 'changelogen'

import { name } from '../../package.json'
import { generateChangelog, getChangelogConfig, rootDir } from './utils'

async function main() {
  logger.log('🚀 Publishing GitHub release...')

  try {
    const { stdout: penultimateTag } = await execPromise('git tag --sort=-v:refname | sed -n \'2p\'')
    const { stdout: lastTag } = await execPromise('git tag --sort=-v:refname | sed -n \'1p\'', {
      noSuccess: true,
      noStdout: true,
    })

    const lastTagTrimmed = lastTag.trim()
    const penultimateTagTrimmed = penultimateTag.trim()

    logger.log(`📋 Creating release for tag: ${lastTagTrimmed} (from ${penultimateTagTrimmed})`)

    const config = await getChangelogConfig({ from: penultimateTagTrimmed, to: lastTagTrimmed })
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

    const releaseBody = releaseChangelog.split('\n').slice(2).join('\n')

    logger.log('📝 Release content:', releaseBody)

    const tagName = lastTagTrimmed.startsWith('v') ? lastTagTrimmed : `v${lastTagTrimmed}`
    const isPrerelease = lastTagTrimmed.includes('beta') || lastTagTrimmed.includes('alpha') || lastTagTrimmed.includes('rc') || lastTagTrimmed.includes('dev') || lastTagTrimmed.includes('next')

    const release = {
      tag_name: tagName,
      name: tagName,
      body: releaseBody,
      prerelease: isPrerelease,
    }

    logger.log(`📋 Release details:`, {
      ...release,
      body: 'placeholder',
    })

    await createGithubRelease(config, release)

    logger.log()
    logger.success('✅ Release published to GitHub!')
    logger.log()
  }
  catch (error) {
    logger.error('❌ Full error details:', JSON.stringify(error, null, 2))
    const errorMessage = getErrorMessage(error)
    logger.error('❌ Error publishing GitHub release:', errorMessage)
    process.exit(1)
  }
}

main()
