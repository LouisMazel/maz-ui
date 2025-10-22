export function formatJson(json: unknown, indent: number = 2) {
  return JSON.stringify(json, null, indent)
}
