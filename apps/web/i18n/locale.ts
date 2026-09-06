export const LOCALE_COOKIE_NAME = "NEXT_LOCALE"
export const supportedLocales = ["en", "fr"] as const
export const defaultLocale = "en"

export function toSupportedLocale(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  const base = value.trim().toLowerCase().split("-")[0]

  return supportedLocales.includes(base as (typeof supportedLocales)[number])
    ? base
    : null
}
