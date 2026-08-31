"use client"

import { useTranslations } from "next-intl"

export function FormEmailInput() {
  const t = useTranslations("Auth.Login.Form")

  return (
    <input
      className="
        w-full
        rounded-md
        border-solid
        border-2
        border-muted
        focus:border-accent/40
        
        outline-transparent
        outline-offset-10
        outline-0
        py-2
        px-4
      "
      name="email"
      type="email"
      placeholder={t("EmailPlaceholder")}
    />
  )
}