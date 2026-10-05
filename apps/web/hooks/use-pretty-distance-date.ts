import { useLocale } from "next-intl"
import { formatDistanceToNow } from "date-fns"
import { fr, enUS } from "date-fns/locale"

export function usePrettyDistanceDate(distanceDate: number) {

  const locale = useLocale()
  const dateFnsLocale = locale === "fr" ? fr : enUS

  return formatDistanceToNow(
    new Date(distanceDate),
    { addSuffix: true, locale: dateFnsLocale }
  )
}