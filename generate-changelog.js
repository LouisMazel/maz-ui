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
  const lastTag = sortedTags[0]
  const penultimateTag = sortedTags[1]

  exec(
    `npx changelogen@latest --from=${penultimateTag} --to=${lastTag} --output=CHANGELOG.md`,
    (error, stdout) => {
      if (error) {
        console.error(error)
        return
      } else {
        console.log(stdout)

        exec('git add -u && git commit -m "chore: update CHANGELOG.md" && git push origin HEAD')
      }
    },
  )
})
