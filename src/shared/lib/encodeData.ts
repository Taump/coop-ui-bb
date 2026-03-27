export const encodeData = (data: object): string => {
  const sData = JSON.stringify(data)
  const bytes = new TextEncoder().encode(sData)

  // Build binary string in chunks to avoid RangeError from spread on large arrays
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary)
}