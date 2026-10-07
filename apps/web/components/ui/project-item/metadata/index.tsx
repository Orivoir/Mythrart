"use client"

import { useProjectMetadata } from "@/components/hooks/queries/use-metadata"
import { ProjectItemMetadataSkeleton } from "./skeleton"

import {
  FileText,
  Globe2,
  Paperclip,
  Users,
} from "lucide-react"

import MetadataItem from "./item"
import MetadataSeparator from "./separator"
import WritingItem from "./writing-item"
import {useTranslations} from "next-intl"

interface ProjectItemMetadataProps {
  projectId: string
}

export default function ProjectItemMetadata({
  projectId,
}: ProjectItemMetadataProps) {
  const {
    data: metadata,
    isPending,
    isError,
  } = useProjectMetadata(projectId)

  const t = useTranslations("Dashboard.Item.Metadata")

  if (isPending) {
    return <ProjectItemMetadataSkeleton />
  }

  if (isError || !metadata) {
    return null
  }

  return (
    <div className="mt-2.5 flex flex-col gap-1.5">
      {/* Type / chapitres / scènes */}
      <div className="flex flex-wrap items-center mb-2">
        <WritingItem text={metadata.type.name} />
        <MetadataSeparator />
        <WritingItem text={t("Chapters", { count: metadata.chaptersCount })} />
        <MetadataSeparator />
        <WritingItem text={t("Scenes", { count: metadata.scenesCount })} />
      </div>

      {/* Version / locales / collaborateurs / assets */}
      <div className="flex flex-wrap items-center">
        {metadata.currentSnapshot && (
          <>
            <MetadataItem icon={FileText}>
              v{metadata.currentSnapshot.version}
            </MetadataItem>

            {(metadata.locales.count > 0 ||
              metadata.collaboratorsCount > 0 ||
              metadata.chapterAssetReferencesCount > 0) && (
              <MetadataSeparator />
            )}
          </>
        )}

        {metadata.locales.count > 0 && (
          <>
            <MetadataItem icon={Globe2}>
              {t("Locales", { count: metadata.locales.count })}
            </MetadataItem>

            {(metadata.collaboratorsCount > 0 ||
              metadata.chapterAssetReferencesCount > 0) && (
              <MetadataSeparator />
            )}
          </>
        )}

        {metadata.collaboratorsCount > 0 && (
          <>
            <MetadataItem icon={Users}>
              {t("Collaborators", { count: metadata.collaboratorsCount })}
            </MetadataItem>

            {metadata.chapterAssetReferencesCount > 0 && (
              <MetadataSeparator />
            )}
          </>
        )}

        {metadata.chapterAssetReferencesCount > 0 && (
          <MetadataItem icon={Paperclip}>
            {t("Assets", { count: metadata.chapterAssetReferencesCount })}
          </MetadataItem>
        )}
      </div>
    </div>
  )
}