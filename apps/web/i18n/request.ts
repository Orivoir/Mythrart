import { cookies, headers } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import {
  defaultLocale,
  LOCALE_COOKIE_NAME,
  toSupportedLocale,
} from "./locale"

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
    const locale = toSupportedLocale(candidate.tag)

    if (locale) {
      return locale
    }
  }

  return defaultLocale
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const localeCookie = toSupportedLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value,
  )

  const requestHeaders = await headers()
  const locale =
    localeCookie ??
    pickLocaleFromAcceptLanguage(requestHeaders.get("accept-language"))

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

