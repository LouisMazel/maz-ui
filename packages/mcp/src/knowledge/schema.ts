import { z } from 'zod'

/**
 * Contract of the agent knowledge produced by `tools/agent-docs`: one fragment
 * per package (`agent-docs/manifest.json`) and, in @maz-ui/mcp, an
 * `index.json` listing them. The fragments may come from the packages
 * installed in the user's project (any version), so they are validated at
 * runtime.
 */
export const SUPPORTED_SCHEMA_VERSION = 2

export const docCategories = [
  'guide',
  'component',
  'composable',
  'directive',
  'plugin',
  'ecosystem',
  'util',
  'node',
  'reference',
] as const

export type DocCategory = typeof docCategories[number]

const namedTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
})

export const docEntrySchema = z.object({
  id: z.string(),
  category: z.enum(docCategories),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  package: z.string(),
  file: z.string(),
  url: z.string().optional(),
  symbols: z.array(z.string()),
  imports: z.array(z.string()),
  aliases: z.array(z.string()),
  headings: z.array(z.string()),
  related: z.array(z.string()),
  chars: z.number(),
})

export const propApiSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  required: z.boolean(),
  default: z.string().optional(),
  values: z.array(z.string()).optional(),
  strictValues: z.boolean(),
  model: z.string().optional(),
})

export const componentApiSchema = z.object({
  name: z.string(),
  docId: z.string(),
  description: z.string().optional(),
  import: z.string(),
  parent: z.string().optional(),
  props: z.array(propApiSchema),
  events: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    payload: z.string().optional(),
  })),
  slots: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    bindings: z.array(z.object({
      name: z.string(),
      type: z.string().optional(),
      description: z.string().optional(),
    })),
  })),
  expose: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })),
})

export const tailwindSchema = z.object({
  entries: z.array(z.object({
    path: z.string(),
    description: z.string(),
  })),
  colors: z.array(z.object({
    name: z.string(),
    variable: z.string(),
    foreground: z.boolean(),
    scale: z.array(z.string()),
    usage: z.string(),
  })),
  radius: z.array(namedTokenSchema),
  shadows: z.array(namedTokenSchema),
  breakpoints: z.array(namedTokenSchema),
  /** Since maz-ui 5.7 */
  containers: z.array(namedTokenSchema).optional(),
  zIndex: z.array(namedTokenSchema),
  fonts: z.array(namedTokenSchema),
  durations: z.array(namedTokenSchema),
  easings: z.array(namedTokenSchema),
  spacing: z.array(namedTokenSchema),
  utilities: z.array(z.object({
    name: z.string(),
    css: z.string(),
    description: z.string().optional(),
  })),
  variants: z.array(namedTokenSchema),
  containerVariables: z.array(namedTokenSchema),
  transitions: z.array(z.string()),
})

export const packageGroups = ['ecosystem', 'tooling'] as const

export const fragmentSchema = z.object({
  schemaVersion: z.literal(SUPPORTED_SCHEMA_VERSION),
  package: z.string(),
  version: z.string(),
  description: z.string(),
  homepage: z.string(),
  group: z.enum(packageGroups),
  docs: z.array(docEntrySchema),
  components: z.array(componentApiSchema),
  tailwind: tailwindSchema.optional(),
  icons: z.object({
    names: z.array(z.string()),
  }).optional(),
})

export const bundleIndexSchema = z.object({
  schemaVersion: z.literal(SUPPORTED_SCHEMA_VERSION),
  name: z.literal('maz-ui'),
  fragments: z.array(z.string()),
})

/** `docs/manifest.json` of the maz-ui versions that shipped a single bundle for the whole ecosystem */
export const legacyManifestSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.literal('maz-ui'),
  version: z.string(),
  homepage: z.string(),
  packages: z.array(z.object({
    name: z.string(),
    description: z.string(),
    docId: z.string(),
  })),
  docs: z.array(docEntrySchema),
  components: z.array(componentApiSchema),
  icons: z.object({
    package: z.string(),
    names: z.array(z.string()),
  }),
  tailwind: tailwindSchema,
})

export type DocEntry = z.infer<typeof docEntrySchema>
export type PropApi = z.infer<typeof propApiSchema>
export type ComponentApi = z.infer<typeof componentApiSchema>
export type TailwindTokens = z.infer<typeof tailwindSchema>
export type Fragment = z.infer<typeof fragmentSchema>
export type PackageGroup = typeof packageGroups[number]
export type LegacyManifest = z.infer<typeof legacyManifestSchema>
