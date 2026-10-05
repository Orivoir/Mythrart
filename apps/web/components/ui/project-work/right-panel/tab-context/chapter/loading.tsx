import GranularLoading from "@/components/ui/granular-loading"
import { Text } from "@/components/ui/Typography"
import {useTranslations} from "next-intl"

export default function LoadingChapter() {
  const t = useTranslations("Workspace.RightPanel.Context.Chapter.Loading")

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10">
      <GranularLoading />

      <Text className="mt-3 text-sm text-muted-foreground">
        {t("Label")}
      </Text>
    </div>
  )
}