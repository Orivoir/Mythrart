import { usePrettyDistanceDate } from "@/hooks/use-pretty-distance-date"
import { Clock } from "lucide-react"
import { Text } from "@/components/ui/Typography"
import { useTranslations } from "next-intl"

export default function UpdateDate({
  updatedAt,
}: {
  updatedAt: number
}) {
  const prettyUpdatedAt = usePrettyDistanceDate(updatedAt)
  const t = useTranslations("Workspace.RightPanel.Context.Chapter.UpdateDate")

  return (
    <div className="mt-5 flex items-center gap-3">
      <div className="
        flex
        size-9
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-muted/10
      ">
        <Clock className="size-4 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-0.5">
        <Text className="text-xs text-muted-foreground">
          {t("Label")}
        </Text>

        <Text className="text-sm font-semibold">
          {prettyUpdatedAt}
        </Text>
      </div>
    </div>
  )
}