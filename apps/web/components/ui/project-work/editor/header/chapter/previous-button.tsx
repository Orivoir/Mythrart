"use client"

import { useProjectContext } from "@/components/hooks/use-project-context"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"
import {ChevronLeft} from "lucide-react"
import {useTranslations} from "next-intl"

export default function PreviousButton({position}: {position: number}) {

  const t = useTranslations("Editor.Header.Chapter")
  //const {selectChapterFromPosition} = useProjectContext()

  const disabled = position < 1

  return (
    <ButtonWithIcon
      icon={ChevronLeft}
      iconSize="lg"
      variant="ghost"
      className="rounded-full p-0"
      size="sm"
      title={t("PreviousButtonAriaLabel")}
      aria-label={t("PreviousButtonAriaLabel")}
      disabled={disabled}
    //  onClick={() => selectChapterFromPosition(position)}
    />
  )
}