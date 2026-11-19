// The SVG files of `@maz-ui/icons`, more precise than the `*?url` and `*?raw` of `vite/client`: a longer pattern wins, an
// icon prop with `strict` accepts them

declare module '@maz-ui/icons/svg/*?url' {
  const url: `/${string}` | `http://${string}` | `https://${string}` | `data:${string}`
  export default url
}

declare module '@maz-ui/icons/svg/*?raw' {
  const svg: `<svg${string}`
  export default svg
}
