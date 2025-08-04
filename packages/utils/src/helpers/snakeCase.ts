export function snakeCase(str: string): string {
  return str
    // Handle PascalCase/camelCase: MyComponent -> my_component
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    // Handle consecutive capitals: XMLParser -> xml_parser
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    // Replace spaces, dashes with underscores
    .replace(/[\s-]+/g, '_')
    // Convert to lowercase
    .toLowerCase()
    // Clean up multiple underscores
    .replace(/_+/g, '_')
    // Remove leading/trailing underscores
    .replace(/(^_)|(_$)/g, '')
}
