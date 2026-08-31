"use client"

import { Button } from "../../ui/button"
import { useTranslations } from "next-intl"
import { useFormStatus } from "react-dom"

export function FormPhoneSubmit() {

  const t = useTranslations("Auth.Login.Form")

  const status = useFormStatus()

  return (
    <Button
      type="submit"
      variant="accent-outline"
      className="w-full mt-2"
      size="lg"
      disabled={status.pending}
    >
      {t("PhoneSubmitButton")}
    </Button>
  )
}