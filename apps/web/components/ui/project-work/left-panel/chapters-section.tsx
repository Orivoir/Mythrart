"use client"

import { useProjectContext } from "@/components/hooks/use-project-context"
import ProjectLeftPanelItem from "./item"
import { useChaptersList } from "@/components/hooks/queries/use-chapters-list"
import { useCurrentEditor } from "@tiptap/react"

export default function ProjectLeftPanelChaptersSection() {

  const {
      project,
      currentChapterEdition,
      currentLocale,
      selectChapter
    } = useProjectContext()

    const {editor} = useCurrentEditor()

    const { items: chapters, isLoading, error } = useChaptersList(project.id, currentLocale)

    const onSelectChapter = (chapterId: string) => {

      
      if(currentChapterEdition?.chapterId) {
        if(!editor) return;
  
        const content = editor.getJSON()
        selectChapter(chapterId, content)
      } 

      selectChapter(chapterId)
    }

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
            onSelect={() => onSelectChapter(chapter.id)}
          />
        ))}
      </div>
    )
}