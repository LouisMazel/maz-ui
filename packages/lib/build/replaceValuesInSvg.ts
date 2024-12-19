import fs from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from './utils/logger'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const SVGFolder = resolve(_dirname, '../icons')

fs.readdir(SVGFolder, (err, fichiers) => {
  if (err) {
    console.error('Error while reading file :', err)
    return
  }

  for (const fichier of fichiers) {
    const filePath = join(SVGFolder, fichier)

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        logger.error(`Error while reading file ${fichier} :`, err)
        return
      }

      const modifyContent = data
        .replaceAll('width="24"', 'width="1em"')
        .replaceAll('height="24"', 'height="1em"')
        // Remplacez les codes couleur hexadécimaux par "currentColor"
        .replaceAll(/stroke="#[\dA-Fa-f]{6}"/g, 'stroke="currentColor"')
        .replaceAll(/fill="#[\dA-Fa-f]{6}"/g, 'fill="currentColor"')

      fs.writeFile(filePath, modifyContent, 'utf8', (err) => {
        if (err) {
          logger.error(`Error while writing file ${fichier} :`, err)
        }
        else {
          logger.log(`Attributs updated for ${fichier}`)
        }
      })
    })
  }
})
