"use client"

import {useLocale} from "next-intl"
import { formatDistanceToNow } from "date-fns"
import { fr, enUS } from "date-fns/locale"


import { Cloud } from "lucide-react"

export default function SaveState({ updatedAt }: { updatedAt?: number }) {

  if(updatedAt === undefined) return null

  const locale = useLocale()
  const dateLocale = locale === "fr" ? fr : enUS

  const date = new Date()
  date.setTime(updatedAt)

  const prettyUpdateAt = formatDistanceToNow(new Date(updatedAt), {
  addSuffix: true,
  locale: dateLocale,
})

  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-3
        px-4
        text-xs
        text-muted-foreground
      "
    >
      {updatedAt && (
        <span>
          Dernière sauvegarde : {prettyUpdateAt}
        </span>
      )}

      <Cloud className="size-5" />
    </div>
  )
}