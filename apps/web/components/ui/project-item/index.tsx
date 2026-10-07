"use client"
import ProjectItemLayout from "./layout"
import ProjectItemUpdated from "./updated"
import ProjectItemMetadata from "./metadata"

import type { CreateEbookResponseAPI } from "@/app/types/api/ebook"
import { Title, HelperText } from "@/components/ui/Typography"
import ProjectItemCover from "./cover"

export type ProjectItemProps = CreateEbookResponseAPI & {}

export default function ProjectItem({
  id,
  title,
  subtitle,
  updatedAt
}: ProjectItemProps) {

  const openProjectLink = "/project/" + id 

  return (
    <ProjectItemLayout projectLink={openProjectLink}>
      <ProjectItemCover id={id} title={title} />

      {/* Content */}
      <div className="flex flex-col px-3 pb-3 pt-2.5">
        <Title className="truncate text-sm font-semibold">
          {title}
        </Title>

        {subtitle && (
          <HelperText className="mt-0.5 line-clamp-2 text-xs font-medium">
            {subtitle}
          </HelperText>
        )}

        <ProjectItemMetadata projectId={id} />

        <ProjectItemUpdated updatedAt={updatedAt} />
      </div>
    </ProjectItemLayout>
  )
}