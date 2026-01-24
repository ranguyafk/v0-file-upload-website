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
 * For basic protection - consider using a library like DOMPurify for client-side
 */
export function sanitizeString(input: string | null | undefined): string | null {
  if (!input) return null
  
  // Remove HTML tags and trim
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim()
}
