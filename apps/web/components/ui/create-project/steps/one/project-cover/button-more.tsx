"use client"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/Typography"
import { useTranslations } from "next-intl"
import { MoreHorizontal } from "lucide-react"

export interface ButtonMoreProps {
  onClick?: () => void
}

export default function ButtonMore({ onClick }: ButtonMoreProps) {
  const t = useTranslations("CreateProject.StepOne")

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="
        flex h-[132px] w-[90px] shrink-0 flex-col
        items-center justify-center gap-2 rounded-md
        bg-soft-blue p-0 hover:bg-soft-blue/75
        px-14
      "
    >
      <MoreHorizontal
        className="size-6 text-foreground"
        aria-hidden="true"
      />

      <Text className="text-xs text-muted-foreground">
        {t("cover.morePresets")}
      </Text>
    </Button>
  )
}