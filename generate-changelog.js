const { exec } = require('node:child_process')

const simpleGit = require('simple-git')()

simpleGit.tag((err, tags) => {
  if (err) {
    console.error(err)
    return
  }

  // Trier les tags par ordre décroissant
  const sortedTags = tags.split('\n').sort((a, b) => {
    return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
  })

  // // Récupérer l'avant-dernier tag
  const avantDernierTag = sortedTags[1]

  exec(
    `npx changelogen@latest --from=${avantDernierTag} --output=CHANGELOG.md`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(error)
        return
      } else {
        console.log('stdout, stderr', stdout, stderr)

        exec('git add -u && git commit -m "chore: update CHANGELOG.md" && git push')
      }
    },
  )
})
