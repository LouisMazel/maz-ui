export default val => {
  if (!val) return ''
  const string = val.toString()
  return string.charAt(0).toUpperCase() + string.slice(1)
}
