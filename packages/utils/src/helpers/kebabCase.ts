export function kebabCase(str: string): string {
  return str
    // Handle PascalCase/camelCase: MyComponent -> my-component
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    // Handle consecutive capitals: XMLParser -> xml-parser
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    // Replace spaces, underscores with dashes
    .replace(/[\s_]+/g, '-')
    // Convert to lowercase
    .toLowerCase()
    // Clean up multiple dashes
    .replace(/-+/g, '-')
    // Remove leading/trailing dashes
    .replace(/(^-)|(-$)/g, '')
}
