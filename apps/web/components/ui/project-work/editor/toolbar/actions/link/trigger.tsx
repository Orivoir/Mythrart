"use client"

import { useTranslations } from "next-intl"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"

interface TriggerButtonProps
  extends React.ComponentProps<typeof ButtonWithIcon> {
  isActive: boolean
}
export default function TriggerButton({isActive, ...props}: TriggerButtonProps) {

  const t = useTranslations("Editor.Toolbar.Link")

  return (
    <ButtonWithIcon
      type="button"
      variant={isActive ? "accent-outline" : "ghost"}
      size="default"
      iconSize="lg"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      {...props}
    />
  )
}