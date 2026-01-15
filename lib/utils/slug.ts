const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

export function generateSlug(length = 8): string {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]{3,32}$/.test(slug)
}
