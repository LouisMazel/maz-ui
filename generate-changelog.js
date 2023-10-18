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

  exec(`npx changelogen@latest --from=${avantDernierTag} --output=CHANGELOG.md`)

  simpleGit.add('.')

  // Créez un commit avec un message
  simpleGit.commit('refactor: update CHANGELOG.md', (error, result) => {
    if (error) {
      console.error(error)
      return
    }

    // Poussez le commit vers la branche courante
    simpleGit.push((error) => {
      if (error) {
        console.error(error)
        return
      }

      console.log('changelog commit pushed')
    })
  })
})
