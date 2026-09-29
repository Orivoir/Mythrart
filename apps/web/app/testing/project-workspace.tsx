"use client"

import { useEffect, useMemo } from "react"
import { EditorContext, EditorContent, useEditor } from "@tiptap/react"
import { useProjectContext } from "@/components/hooks/use-project-context"

import { useWorkMode } from "@/components/hooks/use-work-mode"

import ProjectLeftNav from "@/components/ui/project-work/left-nav"
import ProjectWorkLayoutRoot from "@/components/ui/project-work/layout/root"
import ProjectLeftPanel from "@/components/ui/project-work/left-panel"
import ProjectRightPanel from "@/components/ui/project-work/right-panel"

import EditorToolbar from "@/components/ui/project-work/editor/toolbar"
import useTiptapExtensions from "@/components/hooks/use-tiptap-extensions"
import { useChapter } from "@/components/hooks/queries/use-chapter"
import { JSONContent } from "@tiptap/react"

export default function ProjectWorkspace() {
  const project = useWorkMode()

  const extensions = useTiptapExtensions(project.id)

  const {currentChapterEdition} = useProjectContext()

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
  })


  const { data: chapter } = useChapter(currentChapterEdition?.chapterId, "en")

  const providerValue = useMemo(
    () => ({ editor }),
    [editor],
  )


  useEffect(() => {

    console.log("has changed")

    if(!editor || !chapter) return

    console.log("with hydrate ok")

    editor.commands.setContent(chapter.content as JSONContent)

  }, [editor, chapter])

  return (
    <EditorContext.Provider value={providerValue}>
      <ProjectWorkLayoutRoot>

        <ProjectLeftNav />

        <ProjectLeftPanel />

        <main className="min-w-0 flex flex-1 flex-col">
          <EditorToolbar />

          {/* EditorHeader */}

          <EditorContent editor={editor} />

          {/* EditorEmpty */}
          {/* EditorMetadata */}

        </main>

        <aside>
          <ProjectRightPanel />
        </aside>

      </ProjectWorkLayoutRoot>
    </EditorContext.Provider>
  )
}