// UUID v4 validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Validates if a string is a valid UUID v4
 */
export function isValidUUID(uuid: string | null | undefined): boolean {
  if (!uuid) return false
  return UUID_REGEX.test(uuid)
}

/**
 * Sanitizes a string for safe storage (removes HTML tags and scripts)
 * Returns trimmed string or empty string if input is invalid
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return ''
  
  // Remove HTML tags, script content, and javascript: protocols
  // This is a basic sanitization - for rich text content, use a library like DOMPurify
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}
