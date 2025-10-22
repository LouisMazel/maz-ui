export function formatJson(json: unknown) {
  return JSON.stringify(json, null, 2)
}
