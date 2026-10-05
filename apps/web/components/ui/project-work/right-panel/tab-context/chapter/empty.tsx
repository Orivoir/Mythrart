"use client"

import { BookOpen } from "lucide-react"
import { Text } from "@/components/ui/Typography"
import {useTranslations} from "next-intl"

export default function EmptyChapter() {

  const t = useTranslations("Workspace.RightPanel.Context.Chapter.Empty")

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="
        mb-4
        flex
        size-12
        items-center
        justify-center
        rounded-full
        bg-accent/10
        text-accent
      ">
        <BookOpen className="size-6" />
      </div>

      <Text className="font-medium">
        {t("Title")}
      </Text>

      <Text className="mt-1 text-sm text-muted-foreground">
        {t("Description")}
      </Text>
    </div>
  )
}