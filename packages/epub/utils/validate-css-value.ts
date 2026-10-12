export function validateCssValue(value: string, property: string): string {
  const trimmed = value.trim()

  if (
    !trimmed ||
    /[;{}<>]/.test(trimmed) ||
    /url\s*\(|expression\s*\(/i.test(trimmed)
  ) {
    throw new Error(`Invalid CSS value for ${property}`)
  }

  return trimmed
}
