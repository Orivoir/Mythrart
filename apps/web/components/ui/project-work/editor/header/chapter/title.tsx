import {Text} from "@/components/ui/Typography"
import {useTranslations} from "next-intl"

export default function ProjectWorkEditorHeaderTitle({position}: {position: number}) {
  const t = useTranslations("Editor.Header.Chapter")

  return (
    <Text>
      {t("Title")} {position}
    </Text>
  )
}