"use client"
import ProjectItemCoverFallback from "./fallback"
import ProjectItemCoverLoading from "./loading"
import MoreOptionsBtn from "./more-options-btn"

import { useProjectCover } from "@/components/hooks/queries/use-project-cover"
import Image from "next/image"

export interface ProjectItemCoverProps {
  id: string
  title: string
}

export default function ProjectItemCover({id, title}: ProjectItemCoverProps) {

  const {
    data: coverImage,
    isPending,
    isError,
  } = useProjectCover(id)

  const withFallback = isError || !coverImage?.url

  return (
    <div className="mx-4 my-4 rounded-lg">
      <div className="relative aspect-[16/9] rounded-lg w-full overflow-hidden bg-muted">
        {isPending ? (
          <ProjectItemCoverLoading />
        ) : withFallback ? (
          <ProjectItemCoverFallback />
        ) : (
          <Image
            src={coverImage.url}
            alt={`Cover image of ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
          />
        )}

        <MoreOptionsBtn />
      </div>
    </div>
  )
}