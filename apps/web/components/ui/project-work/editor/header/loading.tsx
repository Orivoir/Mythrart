import ProjectWorkLayoutEditorHeader from "@/components/ui/project-work/layout/editor/header"
import GranularLoading from "@/components/ui/granular-loading"
import { Skeleton } from "@radix-ui/themes"

export default function ProjectWorkEditorHeaderLoading() {

  return (
    <ProjectWorkLayoutEditorHeader>
      <div className="flex flex-row items-center gap-2">
        <GranularLoading />
        <Skeleton width="100px" height="18px" />
      </div>
    </ProjectWorkLayoutEditorHeader>
  )
}