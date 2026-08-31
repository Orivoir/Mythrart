import { headers } from "next/headers"
import { getRequestConfig } from "next-intl/server"
const supportedLocales = ["en", "fr"] as const
const defaultLocale = "en"

function pickLocaleFromAcceptLanguage(value: string | null): string {
  if (!value) {
    return defaultLocale
  }

  const parsed = value
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";")
      const qParam = params.find((param) => param.trim().startsWith("q="))
      const q = qParam ? Number(qParam.split("=")[1]) : 1

      return {
        tag: rawTag.toLowerCase(),
        q: Number.isFinite(q) ? q : 0,
      }
    })
    .sort((a, b) => b.q - a.q)

  for (const candidate of parsed) {
    const base = candidate.tag.split("-")[0]

    if (supportedLocales.includes(base as (typeof supportedLocales)[number])) {
      return base
    }
  }

  return defaultLocale
}

export default getRequestConfig(async () => {
  const requestHeaders = await headers()
  const locale = pickLocaleFromAcceptLanguage(requestHeaders.get("accept-language"))

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
