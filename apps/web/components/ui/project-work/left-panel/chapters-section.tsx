"use client"

import { useProjectContext } from "@/components/hooks/use-project-context"
import ProjectLeftPanelEmpty from "@/components/ui/project-work/left-panel/empty"
import ProjectLeftPanelItem from "./item"
import { useChaptersList } from "@/components/hooks/queries/use-chapters-list"

export default function ProjectLeftPanelChaptersSection() {

  const {
      project,
      currentChapterEdition,
      currentLocale,
      selectChapter
    } = useProjectContext()

    const { items: chapters, isLoading, error } = useChaptersList(project.id, currentLocale)

    return (
      <div className="flex flex-col gap-2">
        {chapters.map((chapter) => (
          <ProjectLeftPanelItem
            key={chapter.id}
            id={chapter.id}
            title={chapter.title}
            position={chapter.position}
            type="chapter"
            isActive={
              currentChapterEdition?.chapterId === chapter.id
            }
            onSelect={selectChapter}
          />
        ))}
      </div>
    )
}