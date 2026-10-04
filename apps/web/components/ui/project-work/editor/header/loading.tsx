import ProjectWorkLayoutEditorHeader from "@/components/ui/project-work/layout/editor/header"
import { Skeleton } from "@radix-ui/themes"

export default function ProjectWorkEditorHeaderLoading() {

  return (
    <ProjectWorkLayoutEditorHeader>
      <div className="flex flex-col items-start justify-center gap-3">
        <Skeleton width="160px" height="24px" />
        <Skeleton width="160px" height="4px" />
      </div>
    </ProjectWorkLayoutEditorHeader>
  )
}