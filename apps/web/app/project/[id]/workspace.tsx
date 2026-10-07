"use client"

import { useEffect, useMemo, useRef } from "react"

import { useProjectContext } from "@/components/hooks/use-project-context"
import { useUpdateChapter } from "@/components/hooks/queries/use-update-chapter"
import { useWorkMode } from "@/components/hooks/use-work-mode"
import { useChapter } from "@/components/hooks/queries/use-chapter"
import useTiptapExtensions from "@/components/hooks/use-tiptap-extensions"

import { EditorContext, EditorContent, useEditor } from "@tiptap/react"

import ProjectLeftNav from "@/components/ui/project-work/left-nav"
import ProjectWorkLayoutRoot from "@/components/ui/project-work/layout/root"
import ProjectLeftPanel from "@/components/ui/project-work/left-panel"
import ProjectRightPanel from "@/components/ui/project-work/right-panel"
import EditorToolbar from "@/components/ui/project-work/editor/toolbar"
import ProjectWorkEditorHeader from "@/components/ui/project-work/editor/header"
import ProjectWorkEditorMetadata from "@/components/ui/project-work/editor/metadata"

import { Separator } from "@/components/ui/Separator"

import type { JSONContent } from "@tiptap/react"
import type { ChapterEdition } from "@/components/contexts/ProjectContext/ProjectContext.types"

export default function ProjectWorkspace() {

  /**
   * disable header logged, appears workspace header
   * and get project from the workspace context
   */
  const project = useWorkMode()

  const {currentChapterEdition, currentLocale} = useProjectContext()

  /**
   * keep a mutable reference to the current chapter edition
   * because dynamique tiptap extension are memoized
   */
  const currentChapterEditionRef = useRef<ChapterEdition | undefined>(currentChapterEdition)
  currentChapterEditionRef.current = currentChapterEdition

  const {mutate: updateChapterMutation} = useUpdateChapter()

  const extensions = useTiptapExtensions({
    projectId: project.id,

    // callback trigger at shortcut save (e.g: ctrl+S on window os)
    onSave: (content) => {
      
      if(!currentChapterEditionRef.current?.chapterId) return


      updateChapterMutation({
        chapterId: currentChapterEditionRef.current.chapterId,
        data: {
          content
        }
      })
    },
  })

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
  })

  const { data: chapter } = useChapter(
    currentChapterEdition?.chapterId,
    currentLocale
  )

  const providerValue = useMemo(
    () => ({ editor }),
    [editor],
  )

  useEffect(() => {

    if(!editor || !chapter) return

    const {content} = chapter

    editor.commands.setContent(content as JSONContent)

  }, [editor, chapter])

  return (
    <EditorContext.Provider value={providerValue}>
      <ProjectWorkLayoutRoot>

        <ProjectLeftNav />

        <ProjectLeftPanel />

        <main className="min-w-0 flex flex-1 flex-col">
          <EditorToolbar />

          <div className="flex min-h-0 flex-1 flex-col">
            
            {/* Zone d'édition */}
            <div className="min-h-0 flex-1 overflow-y-auto px-24 py-6">
              <ProjectWorkEditorHeader />

              <EditorContent editor={editor} spellCheck={false} />
            </div>


            {/* Metadata */}
            <div className="max-h-[160px] shrink-0">
              <Separator decorative orientation="horizontal" />
              <ProjectWorkEditorMetadata />
            </div>

          </div>
        </main>

        <aside>
          <ProjectRightPanel />
        </aside>

      </ProjectWorkLayoutRoot>
    </EditorContext.Provider>
  )

}