import {
  generateMarkDown,
  getGitDiff,
  loadChangelogConfig,
  parseCommits,
  syncGithubRelease,
} from 'changelogen'
import { exec } from 'node:child_process'
import { existsSync, promises as fsp } from 'node:fs'
import { version } from './lerna.json'

async function execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
  return await new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`🔴 [cli](${command}) Execution failed - ${error.message}.`)
        reject(error)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

export async function checkConfig() {
  const config = await loadChangelogConfig(process.cwd())

  if (!config.output) {
    throw new Error('No output specified in changelog config')
  }

  if (!config.tokens.github) {
    throw new Error('No GitHub token specified in changelog config')
  }

  console.log('Changelogen config is valid')
}

export async function updateChangelog() {
  await checkConfig()
  // const { stdout: penultimateTag } = await execPromise("git tag --sort=-v:refname | sed -n '2p'")
  const { stdout: previousTag } = await execPromise("git tag --sort=-v:refname | sed -n '1p'")
  const previousTagTrimed = previousTag.trim()

  const newTag = `v${version.trim()}`

  await execPromise(`git tag ${newTag}`)
  await execPromise(`git push origin ${newTag}`)

  console.log('Tag pushed to GitHub.')
  console.log()

  const config = await loadChangelogConfig(process.cwd(), {
    from: previousTagTrimed,
    to: newTag,
  })

  const rawCommits = await getGitDiff(previousTagTrimed, newTag)
  const commits = parseCommits(rawCommits, config).filter((commit) => {
    return (
      config.types[commit.type] &&
      !(commit.type === 'chore' && ['release'].includes(commit.scope) && !commit.isBreaking)
    )
  })

  const newChangelog = await generateMarkDown(commits, config)

  let changelogMD: string

  if (typeof config.output === 'string' && existsSync(config.output)) {
    changelogMD = await fsp.readFile(config.output, 'utf8')
  } else {
    changelogMD = '# Changelog\n\n'
  }

  const lastEntry = changelogMD.match(/^###?\s+.*$/m)

  if (lastEntry) {
    changelogMD =
      changelogMD.slice(0, lastEntry.index) +
      newChangelog +
      '\n\n' +
      changelogMD.slice(lastEntry.index)
  } else {
    changelogMD += '\n' + newChangelog + '\n\n'
  }

  await fsp.writeFile(config.output as string, changelogMD)

  await execPromise('pnpm format')

  const changelogWithoutTitle = newChangelog.split('\n').slice(2).join('\n')

  console.log(changelogWithoutTitle)

  await execPromise(`git add -u`)
  await execPromise(`git commit -m "chore(release): bump version to ${newTag}"`)
  await execPromise(`git push origin HEAD`)

  try {
    const response = await syncGithubRelease(config, {
      version: newTag.replace('v', ''),
      body: changelogWithoutTitle,
    })

    console.log()
    console.log('Release pushed to GitHub.', response)
    console.log()
  } catch (error: any) {
    console.error('error', error)
  }
}
