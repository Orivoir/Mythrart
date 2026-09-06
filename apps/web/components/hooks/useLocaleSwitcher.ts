"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { LOCALE_COOKIE_NAME } from "@/i18n/locale"

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/** Persists the chosen locale in a cookie and refreshes so the server re-renders with it. */
export function useLocaleSwitcher() {
  const router = useRouter()

  return useCallback(
    (locale: string) => {
      document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`
      router.refresh()
    },
    [router],
  )
}
