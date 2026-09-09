"use client"

import { ImagePlus } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { Text } from "@/components/ui/Typography"
import { useTranslations } from "next-intl"

export interface CoverUploadProps {
  onCoverChange?: (files: File[]) => void
  onCoverPresetReset?: () => void
}

export default function CoverUpload({onCoverChange, onCoverPresetReset}: CoverUploadProps) {
  const t = useTranslations("CreateProject.StepOne")

  return (
    <FileUpload
      maxSize={5 * 1024 * 1024}
      allowedFileTypes={[
        "image/png",
        "image/jpeg",
        "image/webp",
      ]}
      onChange={(files) => {
        onCoverPresetReset?.()
        onCoverChange?.(files)
      }}
      className="shrink-0"
    >
      <div className="
        flex h-[132px] w-[156px] flex-col items-center justify-center
        rounded-md border border-dashed border-accent
        bg-accent/5 px-3 text-center
        transition-colors hover:bg-accent/10
      ">
        <ImagePlus
          className="mb-3 size-6 text-accent"
          aria-hidden="true"
        />

        <Text className="font-medium text-accent">
          {t("cover.upload")}
        </Text>

        <Text className="mt-1 text-xs leading-5 text-muted-foreground">
          {t("cover.fileTypes")}
          <br />
          {t("cover.maxSize")}
        </Text>
      </div>
    </FileUpload>
  )
}