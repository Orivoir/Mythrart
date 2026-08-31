"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useFormStatus } from "react-dom"

export function FormEmailSubmit() {

  const t = useTranslations("Auth.Login.Form")

  const status = useFormStatus()

  return (
    <Button
      type="submit"
      variant="accent"
      className="w-full mt-2"
      size="lg"
      disabled={status.pending}
    >
      {t("EmailSubmitButton")}
    </Button>
  )
}