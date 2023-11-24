const { exec } = require('node:child_process')

async function execPromise(command) {
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

async function updateChangelog() {
  const { stdout: lastTag } = await execPromise('git describe --tags --abbrev=0')
  const { stdout: penultimateTag } = await execPromise(
    'git describe --abbrev=0 --tags $(git rev-list --tags --max-count=2 | tail -n 1)',
  )

  const { stdout } = await execPromise(
    `npx changelogen@latest --from=${penultimateTag.trim()} --to=${lastTag.trim()} --output=CHANGELOG.md`,
  )

  console.log()
  console.log('Changelog', stdout)

  await execPromise('git add -u && git commit --amend --no-edit && git push origin HEAD --force')
  // -m "chore(release): update CHANGELOG.md" && git push origin HEAD

  console.log('changelog update pushed')
}

updateChangelog()
