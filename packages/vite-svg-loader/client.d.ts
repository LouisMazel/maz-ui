declare module '*.svg?component' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'

  const component: FunctionalComponent<SVGAttributes>
  export default component
}

declare module '*.svg?skipsvgo' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'

  const component: FunctionalComponent<SVGAttributes>
  export default component
}

declare module '*.svg?component&skipsvgo' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'

  const component: FunctionalComponent<SVGAttributes>
  export default component
}

declare module '*.svg?raw' {
  const svg: string
  export default svg
}

declare module '*.svg?raw&skipsvgo' {
  const svg: string
  export default svg
}

declare module '*.svg?url' {
  const url: string
  export default url
}

declare module '*.svg?uri' {
  const url: `/${string}` | `http://${string}` | `https://${string}` | `data:${string}`
  export default url
}

declare module '*.svg?svg' {
  const svg: `<svg${string}`
  export default svg
}
