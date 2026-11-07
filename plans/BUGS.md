# Maz-UI - Bugs connus

Bugs repérés mais pas encore corrigés, avec ce qu'il faut savoir pour les traiter.

## Docs

### Images OG partagées entre les pages

Dans `apps/docs/.vitepress/config.mts` (`transformHead`), le nom du fichier de l'image OG ne garde que le premier mot du titre de la page (`currentTitle.split(' ')[0]`). Toutes les pages dont le titre commence par le même mot écrivent la même image (`/og-images/<mot>.png`) : la dernière générée gagne, et les autres pages partagent une image qui affiche le titre et la description d'une autre page.

- [ ] Nommer l'image d'après le chemin de la page (`pageData.relativePath`), pour une image par page.
- [ ] Ajouter un cache (par exemple un hash du titre et de la description dans le nom du fichier, et sauter la génération si le fichier existe) : sans lui, le build génère une image par page à chaque fois.
- [ ] Refaire le design des images (`apps/docs/.vitepress/og-image.tsx`) : le rendu actuel n'est ni beau ni moderne. À faire en même temps que le changement de nom, puisque toutes les images seront régénérées.
- À mesurer : la durée du build et le nombre de fichiers envoyés par `ftp-deploy`, qui augmentent avec une image par page.
