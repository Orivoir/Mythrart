"use client"

import { useProjectContext } from "@/components/hooks/use-project-context"
import ProjectWorkLayoutEditorHeader from "@/components/ui/project-work/layout/editor/header"
import {useChapter} from "@/components/hooks/queries/use-chapter"
import ProjectWorkEditorHeaderLoading from "./loading"
import ChapterHeader from "./chapter"
import SceneHeader from "./scene"
import {Title} from "@/components/ui/Typography"

export default function ProjectWorkEditorHeader() {

  const {currentChapterEdition} = useProjectContext()
  const {data: chapter, isLoading} = useChapter(currentChapterEdition?.chapterId)

  if(!currentChapterEdition?.chapterId) return null

  if(isLoading || !chapter) {
    return (
      <ProjectWorkEditorHeaderLoading />
    )
  }

  return (
    <ProjectWorkLayoutEditorHeader>
      <div className="flex flex-row items-center justify-between">
        <ChapterHeader position={chapter.position} />

        {currentChapterEdition?.sceneId && (
          <SceneHeader />
        )}

      </div>

      <div className="mt-12">
        <Title className="text-4xl font-bold" isEditable={true}>
          {chapter.title}
        </Title>
      </div>
    </ProjectWorkLayoutEditorHeader>
  )
}