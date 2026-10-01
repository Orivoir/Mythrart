"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { formatDistanceToNow } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { motion } from "framer-motion"
import { CloudUpload } from "lucide-react"
import { Skeleton } from "@radix-ui/themes"

import { useLastChapter } from "@/components/hooks/queries/use-last-chapter"
import useSaveCloud from "@/components/hooks/custom-events/use-save-cloud"

export default function SaveState({
  projectId,
}: {
  projectId?: string
}) {
  const locale = useLocale()

  const [isSaving, setIsSaving] = useState(false)

  const {
    data: lastChapter,
    isLoading: isLastChapterLoading,
    refetch: refetchLastChapter,
  } = useLastChapter(projectId, "en") // locale ui is diff of work locale

  const onSavingStart = () => {
    console.log("Saving started")
    setIsSaving(true)
  }

  const onSavingFinish = async () => {
    await refetchLastChapter()
    setIsSaving(false)
  }

  useSaveCloud({
    callback: onSavingStart,
    type: "start",
  })

  useSaveCloud({
    callback: onSavingFinish,
    type: "finish",
  })

  const dateLocale = locale === "fr" ? fr : enUS

  if (isLastChapterLoading) {
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
        <Skeleton className="h-4 w-36" />
        <Skeleton className="size-5 rounded-full" />
      </div>
    )
  }

  if (!lastChapter) {
    return null
  }

  const prettyUpdatedAt = formatDistanceToNow(
    new Date(lastChapter.updatedAt),
    {
      addSuffix: true,
      locale: dateLocale,
    },
  )

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
      {isSaving ? (
        <>
          <span>
            {locale === "fr"
              ? "Sauvegarde en cours..."
              : "Saving..."}
          </span>

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <CloudUpload className="size-5 text-accent" />
          </motion.div>
        </>
      ) : (
        <>
          <span>
            {locale === "fr"
              ? `Dernière sauvegarde : ${prettyUpdatedAt}`
              : `Last save: ${prettyUpdatedAt}`}
          </span>

          <CloudUpload className="size-5" />
        </>
      )}
    </div>
  )
}