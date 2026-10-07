import { usePrettyDistanceDate } from "@/hooks/use-pretty-distance-date"
import { HelperText } from "@/components/ui/Typography"
import {useTranslations} from "next-intl"
import {Clock} from "lucide-react"

export default function ProjectItemUpdated({updatedAt}: {updatedAt: number}) {
  
  const prettyUpdatedAt = usePrettyDistanceDate(updatedAt)

  const t = useTranslations("Dashboard.Item.Updated")
  
  return (
    <div className="mt-3 border-t border-border pt-2.5 flex flex-row gap-1">
      <Clock className="mr-1 inline h-3.5 w-3.5 text-muted" />
      <HelperText className="text-[11px]">
        {t("Label")} {prettyUpdatedAt}
      </HelperText>
    </div>
  )
}